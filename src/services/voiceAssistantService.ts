import Groq from 'groq-sdk';
import { supabase } from '../supabase/client';
import Config from 'react-native-config';
import { createTag, createProject } from './taskService';

// ─── Public types ─────────────────────────────────────────────────────────────

export interface TaskStats {
  total: number;
  pending: number;
  completed: number;
  todo: number;
}

export interface ProjectMemberInfo {
  email: string;
  role: string;
}

export interface ProjectInfo {
  projectName: string;
  taskCount: number;
  members: ProjectMemberInfo[];
}

export interface SearchResultItem {
  id: string;
  title: string;
  status: string;
  projectName: string;
}

export interface MemberProjectItem {
  projectName: string;
  role: string;
  taskCount: number;
}

export interface MemberTaskItem {
  id: string;
  title: string;
  status: string;
  projectName: string;
}

export interface CreatedItem {
  id: string;
  name: string;
}

export type StructuredData =
  | { type: 'task_stats'; payload: TaskStats }
  | { type: 'project_info'; payload: ProjectInfo[] }
  | { type: 'search_results'; payload: SearchResultItem[] }
  | { type: 'member_projects'; payload: { memberName: string; projects: MemberProjectItem[] } }
  | { type: 'member_tasks'; payload: { memberName: string; status: string; tasks: MemberTaskItem[] } }
  | { type: 'tag_created'; payload: CreatedItem }
  | { type: 'project_created'; payload: CreatedItem };

// ─── Groq client ─────────────────────────────────────────────────────────────

const groq = new Groq({
  apiKey: Config.GROQ_API_KEY ?? '',
  dangerouslyAllowBrowser: true,
});

// const MODEL = 'llama-3.3-70b-versatile';
const MODEL = 'llama-3.1-8b-instant';

// ─── Tool definitions ─────────────────────────────────────────────────────────
// Rules for llama-3.3-70b-versatile tool schemas:
//   • No-argument tools must still have a valid non-empty `properties` object
//     (use a dummy `_noop` field) — empty `{}` triggers the XML fallback format
//   • Never use `required: []` — omit `required` entirely for optional params
//   • Avoid `enum` on optional fields; use plain string with examples in description

const TOOLS: Groq.Chat.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'get_task_stats',
      description:
        'Returns task counts: total, todo, pending, and completed. ' +
        'Call this for ANY question about task counts, status breakdown, or progress.',
      parameters: {
        type: 'object',
        properties: {
          _noop: { type: 'string', description: 'Unused. Pass empty string.' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_project_info',
      description:
        'Returns all projects with their member list (email + role) and task counts. ' +
        'Call for questions about projects, members, assignments, or workloads.',
      parameters: {
        type: 'object',
        properties: {
          _noop: { type: 'string', description: 'Unused. Pass empty string.' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'search_tasks',
      description:
        'Search tasks by keyword in title, by status, or both. ' +
        'Call when user says "find", "search", "show me tasks", or asks about specific tasks.',
      parameters: {
        type: 'object',
        properties: {
          keyword: {
            type: 'string',
            description: 'Word or phrase to search in task title. Omit to skip title filter.',
          },
          status: {
            type: 'string',
            description: 'Filter by status. Allowed values: "todo", "pending", "completed". Omit to return all statuses.',
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_my_projects',
      description:
        'Returns all projects assigned to the currently logged-in user (me/myself/I). ' +
        'Call when user says "my projects", "projects assigned to me", "how many projects do I have", ' +
        '"which projects am I in", or any question using "me", "my", or "I" about projects.',
      parameters: {
        type: 'object',
        properties: {
          _noop: { type: 'string', description: 'Unused. Pass empty string.' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_my_tasks',
      description:
        'Returns tasks assigned to the currently logged-in user (me/myself/I), optionally filtered by status. ' +
        'Call when user says "my tasks", "my pending tasks", "what tasks do I have", ' +
        '"show my completed tasks", or any question using "me", "my", or "I" about tasks.',
      parameters: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            description: 'Filter by status: "todo", "pending", or "completed". Omit to return all.',
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_member_projects',
      description:
        'Returns all projects assigned to a SPECIFIC OTHER member, searched by their name or email. ' +
        'Call when user asks about a named person like "which projects is john assigned to". ' +
        'Do NOT call this for "me", "my", or "I" — use get_my_projects instead.',
      parameters: {
        type: 'object',
        properties: {
          member_name: {
            type: 'string',
            description:
              'The name or partial email of the member to look up. ' +
              'Example: "testing", "john", "john@example.com". Never pass "me" or "I".',
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_member_tasks',
      description:
        'Returns tasks assigned to a SPECIFIC OTHER member, optionally filtered by status. ' +
        'Call when user asks "what tasks does john have", "pending tasks of testing". ' +
        'Do NOT call this for "me", "my", or "I" — use get_my_tasks instead.',
      parameters: {
        type: 'object',
        properties: {
          member_name: {
            type: 'string',
            description: 'Name or partial email of the member. Example: "testing", "john". Never pass "me".',
          },
          status: {
            type: 'string',
            description: 'Filter by status: "todo", "pending", or "completed". Omit to return all.',
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'create_tag',
      description:
        'Creates a new tag with the given name. ' +
        'Call ONLY when user explicitly says "create tag", "add tag", or "make a new tag". ' +
        'Admin only action.',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The name of the tag to create. Example: "urgent", "backend", "design".',
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'create_project',
      description:
        'Creates a new project with the given name. ' +
        'Call ONLY when user explicitly says "create project", "add project", or "make a new project". ' +
        'Admin only action.',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The name of the project to create. Example: "Mobile App", "Backend API".',
          },
        },
      },
    },
  },
];

// Say this	Action
// "Create tag urgent"	Creates tag named "urgent"
// "Add tag backend"	Creates tag named "backend"
// "Create project Mobile App"	Creates project named "Mobile App"
// "Make a new project Backend API"	Creates project named "Backend API"

// ─── Supabase query helpers ───────────────────────────────────────────────────

const queryTaskStats = async (userId: string, isAdmin: boolean): Promise<TaskStats> => {
  let query = supabase.from('task').select('status');
  if (!isAdmin) { query = query.eq('user_id', userId); }
  const { data, error } = await query;
  if (error) { throw new Error(error.message); }
  const rows = data ?? [];
  return {
    total: rows.length,
    pending: rows.filter((r: any) => r.status === 'pending').length,
    completed: rows.filter((r: any) => r.status === 'completed').length,
    todo: rows.filter((r: any) => r.status === 'todo').length,
  };
};

const queryProjectInfo = async (): Promise<ProjectInfo[]> => {
  const [membersResult, tasksResult] = await Promise.all([
    supabase
      .from('project_members')
      .select('user_id, role, project_id, projects(id, name), profiles(email)'),
    supabase.from('task').select('project_id'),
  ]);
  if (membersResult.error) { throw new Error(membersResult.error.message); }

  const tasksByProject: Record<string, number> = {};
  for (const t of tasksResult.data ?? []) {
    const pid = (t as any).project_id;
    if (pid) { tasksByProject[pid] = (tasksByProject[pid] ?? 0) + 1; }
  }

  const grouped: Record<string, ProjectInfo> = {};
  for (const item of membersResult.data ?? []) {
    const project = (item as any).projects;
    const profile = (item as any).profiles;
    if (!project) { continue; }
    if (!grouped[project.id]) {
      grouped[project.id] = {
        projectName: project.name,
        taskCount: tasksByProject[project.id] ?? 0,
        members: [],
      };
    }
    grouped[project.id].members.push({
      email: profile?.email ?? 'unknown',
      role: item.role,
    });
  }
  return Object.values(grouped);
};

const querySearchTasks = async (
  userId: string,
  isAdmin: boolean,
  keyword?: string,
  status?: string,
): Promise<SearchResultItem[]> => {
  let query = supabase
    .from('task')
    .select('id, title, status, project_id, projects(name)');
  if (!isAdmin) { query = query.eq('user_id', userId); }
  if (keyword) { query = query.ilike('title', `%${keyword}%`); }
  if (status) { query = query.eq('status', status); }
  const { data, error } = await query;
  if (error) { throw new Error(error.message); }
  return (data ?? []).map((row: any) => ({
    id: row.id,
    title: row.title,
    status: row.status,
    projectName: row.projects?.name ?? 'No project',
  }));
};

const queryMemberProjects = async (
  memberName: string,
): Promise<{ memberName: string; projects: MemberProjectItem[] }> => {
  // Search profiles whose email contains the keyword
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('id, email')
    .ilike('email', `%${memberName}%`);

  if (profileError) { throw new Error(profileError.message); }
  if (!profiles || profiles.length === 0) {
    return { memberName, projects: [] };
  }

  // Use the first matching profile
  const profile = profiles[0];
  const matchedEmail = profile.email as string;

  // Fetch all project_members rows for this user
  const { data: memberRows, error: memberError } = await supabase
    .from('project_members')
    .select('role, project_id, projects(id, name)')
    .eq('user_id', profile.id);

  if (memberError) { throw new Error(memberError.message); }

  // Fetch task counts per project
  const { data: tasks } = await supabase.from('task').select('project_id');
  const tasksByProject: Record<string, number> = {};
  for (const t of tasks ?? []) {
    const pid = (t as any).project_id;
    if (pid) { tasksByProject[pid] = (tasksByProject[pid] ?? 0) + 1; }
  }

  const projects: MemberProjectItem[] = (memberRows ?? []).map((row: any) => ({
    projectName: row.projects?.name ?? 'Unknown',
    role: row.role,
    taskCount: tasksByProject[row.project_id] ?? 0,
  }));

  return { memberName: matchedEmail, projects };
};

const queryMemberTasks = async (
  memberName: string,
  status?: string,
): Promise<{ memberName: string; status: string; tasks: MemberTaskItem[] }> => {
  // Find matching profile by email keyword
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('id, email')
    .ilike('email', `%${memberName}%`);

  if (profileError) { throw new Error(profileError.message); }
  if (!profiles || profiles.length === 0) {
    return { memberName, status: status ?? 'all', tasks: [] };
  }

  const profile = profiles[0];
  const matchedEmail = profile.email as string;

  // Fetch tasks for this user, optionally filtered by status
  let query = supabase
    .from('task')
    .select('id, title, status, project_id, projects(name)')
    .eq('user_id', profile.id);

  if (status) { query = query.eq('status', status); }

  const { data, error } = await query;
  if (error) { throw new Error(error.message); }

  const tasks: MemberTaskItem[] = (data ?? []).map((row: any) => ({
    id: row.id,
    title: row.title,
    status: row.status,
    projectName: row.projects?.name ?? 'No project',
  }));

  return { memberName: matchedEmail, status: status ?? 'all', tasks };
};

// ─── Execute a tool by name ───────────────────────────────────────────────────

const executeTool = async (
  name: string,
  args: Record<string, any>,
  userId: string,
  isAdmin: boolean,
  onData?: (data: StructuredData) => void,
): Promise<string> => {
  try {
    if (name === 'get_task_stats') {
      const result = await queryTaskStats(userId, isAdmin);
      onData?.({ type: 'task_stats', payload: result });
      return JSON.stringify(result);
    }
    if (name === 'get_project_info') {
      const result = await queryProjectInfo();
      onData?.({ type: 'project_info', payload: result });
      return JSON.stringify({ projects: result });
    }
    if (name === 'search_tasks') {
      const result = await querySearchTasks(userId, isAdmin, args.keyword, args.status);
      onData?.({ type: 'search_results', payload: result });
      return JSON.stringify({ results: result, count: result.length });
    }
    if (name === 'get_member_projects') {
      const memberName = (args.member_name ?? '').trim();
      if (!memberName) { return JSON.stringify({ error: 'member_name is required.' }); }
      const result = await queryMemberProjects(memberName);
      onData?.({ type: 'member_projects', payload: result });
      return JSON.stringify(result);
    }
    if (name === 'get_member_tasks') {
      const memberName = (args.member_name ?? '').trim();
      if (!memberName) { return JSON.stringify({ error: 'member_name is required.' }); }
      const result = await queryMemberTasks(memberName, args.status);
      onData?.({ type: 'member_tasks', payload: result });
      return JSON.stringify({ memberName: result.memberName, status: result.status, count: result.tasks.length, tasks: result.tasks });
    }
    if (name === 'create_tag') {
      if (!isAdmin) { return JSON.stringify({ error: 'Only admins can create tags.' }); }
      const tagName = (args.name ?? '').trim();
      if (!tagName) { return JSON.stringify({ error: 'Tag name is required.' }); }
      const result = await createTag(tagName);
      if (!result) { return JSON.stringify({ error: 'Failed to create tag.' }); }
      onData?.({ type: 'tag_created', payload: { id: result.id, name: result.name } });
      return JSON.stringify({ success: true, id: result.id, name: result.name });
    }
    if (name === 'create_project') {
      if (!isAdmin) { return JSON.stringify({ error: 'Only admins can create projects.' }); }
      const projectName = (args.name ?? '').trim();
      if (!projectName) { return JSON.stringify({ error: 'Project name is required.' }); }
      const result = await createProject(projectName);
      if (!result) { return JSON.stringify({ error: 'Failed to create project.' }); }
      onData?.({ type: 'project_created', payload: { id: result.id, name: result.name } });
      return JSON.stringify({ success: true, id: result.id, name: result.name });
    }
    return JSON.stringify({ error: 'Unknown tool.' });
  } catch (err: any) {
    return JSON.stringify({ error: err.message });
  }
};

// ─── Public: process voice / text query with Groq ─────────────────────────────

export const processVoiceQuery = async (
  userQuery: string,
  userId: string,
  isAdmin: boolean,
  onToken: (delta: string) => void,
  onData?: (data: StructuredData) => void,
): Promise<string> => {

  const messages: Groq.Chat.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: [
        'You are a helpful voice assistant for a task and project management app.',
        'Always call the appropriate tool to get current data before answering.',
        'Respond in a friendly, conversational tone in 2–4 sentences. Be specific with numbers.',
        isAdmin
          ? 'User context: admin — can see all tasks, all projects, all members, and can create new tags and projects using the create_tag and create_project tools.'
          : 'User context: team member — can only see their own assigned tasks. Cannot create tags or projects.',
      ].join(' '),
    },
    { role: 'user', content: userQuery },
  ];

  let fullResponse = '';

  // Agentic tool-use loop
  while (true) {
    // Use streaming for the final text response; non-streaming for tool calls
    const response = await groq.chat.completions.create({
      model: MODEL,
      messages,
      tools: TOOLS,
      tool_choice: 'auto',
      parallel_tool_calls: false,   // one tool at a time — prevents format errors
      stream: false,
    });

    const choice = response.choices[0];
    const assistantMessage = choice.message;
    messages.push(assistantMessage as Groq.Chat.ChatCompletionMessageParam);

    // No tool calls → stream the final answer
    if (!assistantMessage.tool_calls || assistantMessage.tool_calls.length === 0) {
      const text = assistantMessage.content ?? '';

      // Stream text token by token for UI effect
      const words = text.split(' ');
      for (const word of words) {
        const chunk = fullResponse.length === 0 ? word : ` ${word}`;
        fullResponse += chunk;
        onToken(chunk);
        await new Promise(resolve => setTimeout(resolve, 30));
      }
      break;
    }

    // Execute all tool calls and push results
    const toolResults = await Promise.all(
      assistantMessage.tool_calls.map(async toolCall => {
        const args = JSON.parse(toolCall.function.arguments || '{}');
        const result = await executeTool(
          toolCall.function.name,
          args,
          userId,
          isAdmin,
          onData,
        );
        return {
          role: 'tool' as const,
          tool_call_id: toolCall.id,
          content: result,
        };
      }),
    );

    messages.push(...toolResults);
  }

  return fullResponse;
};

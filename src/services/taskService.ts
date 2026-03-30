import { supabase } from "../supabase/client";

export const fetchUserTodos = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  const result = await supabase
    .from('task')
    .select('id, title, status, priority, created_at, subtasks(id, title, is_completed)')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false });
  if (result.error) {
    console.log('fetchUserTodos error:', result.error.message);
    return { data: null, error: result.error };
  }
  return result;
};

// export const fetchAllTodos = async () => {
//   const result = await supabase
//     .from('task')
//     .select('id, title, status, priority, created_at, user_id, subtasks(id, title, is_completed), profiles(email)')
//     .order('created_at', { ascending: false });
//   if (result.error) {
//     console.log('fetchAllTodos error:', result.error.message);
//     return { data: null, error: result.error };
//   }
//   return result;
// };

export const fetchAllTodos = async () => {
  const { data, error } = await supabase
    .from('task')
    .select('id, title, status, priority, created_at, subtasks(id, title, is_completed)')
    .order('created_at', { ascending: false });

  if (error) {
    console.log('fetchAllTodos error:', error.message);
    return { data: null, error };
  }

  return { data, error: null };
};

export interface Project {
  id: string;
  name: string;
}

export interface Tag {
  id: string;
  name: string;
}

// Admin → all projects; member/viewer → only assigned projects
export const fetchProjectsForTask = async (
  isAdmin: boolean,
  userId?: string,
): Promise<Project[]> => {
  if (isAdmin) {
    const { data, error } = await supabase.from('projects').select('id, name');
    if (error) throw new Error(error.message);
    return data ?? [];
  }

  // Non-admin: fetch only projects the user is a member of
  const { data, error } = await supabase
    .from('project_members')
    .select('projects(id, name)')
    .eq('user_id', userId ?? '');
  if (error) throw new Error(error.message);

  return (data ?? [])
    .map((row: any) => row.projects)
    .filter(Boolean) as Project[];
};

export const fetchTagsForTask = async (): Promise<Tag[]> => {
  const { data, error } = await supabase.from('tags').select('id, name');
  if (error) throw new Error(error.message);
  return data ?? [];
};

export const createProject = async (name: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('projects')
      .insert([
        {
          name,
          user_id: user?.id,
        },
      ])
      .select()
      .single();
  
    if (error) {    
      console.log('Project error:', error.message);
      return null;
    }
  
    return data;
  };

  export const createTodo = async ({
    title,
    projectId,
    priority = 'low',
  }: {
    title: string;
    projectId: string;
    priority?: string;
  }) => {
    const { data: { user } } = await supabase.auth.getUser();
  
    const { data, error } = await supabase
      .from('task')
      .insert([
        {
          title,
          user_id: user?.id,
          project_id: projectId,
          priority,
        },
      ])
      .select()
      .single();
  
    if (error) {
      console.log('Task error:', error.message);
      return null;
    }
  
    return data;
  };

  export const createSubtasks = async (taskId: string, subtasks: string[]) => {
    const payload = subtasks.map((title) => ({
      title,
      task_id: taskId,
    }));
  
    const { error } = await supabase
      .from('subtasks')
      .insert(payload);
  
    if (error) {
      console.log('Subtask error:', error.message);
    }
  };

  export const createTag = async (name: string) => {
    const { data: { user } } = await supabase.auth.getUser();
  
    const { data, error } = await supabase
      .from('tags')
      .insert([
        {
          name,
          user_id: user?.id,
        },
      ])
      .select()
      .single();
  
    if (error) {
      console.log('Tag error:', error.message);
      return null;
    }
  
    return data;
  };

  export const attachTagsToTodo = async (taskId: string, tagIds: string[]) => {
    const payload = tagIds.map((tagId: string) => ({
      task_id: taskId,
      tag_id: tagId,
    }));
  
    const { error } = await supabase
      .from('task_tags')
      .insert(payload);
  
    if (error) {
      console.log('Attach tag error:', error.message);
    }
  };

  export const createFullTodo = async ({
    title,
    projectId,
    subtasks = [],
    tagIds = [],
    priority = 'low',
  }: {
    title: string;
    projectId: string;
    subtasks?: string[];
    tagIds?: string[];
    priority?: string;
  }) => {
    try {
      // 1. Create task
      const task = await createTodo({
        title,
        projectId,
        priority,
      });
  
      if (!task) return;
  
      // 2. Create subtasks
      if (subtasks.length) {
        await createSubtasks(task.id, subtasks);
      }
  
      // 3. Attach tags
      if (tagIds.length) {
        await attachTagsToTodo(task.id, tagIds);
      }
  
      return task;
    } catch (err) {
      console.log('Full task error:', err);
    }
  };

  export const fetchTodosByProject = async (projectId: string) => {
    const result = await supabase
      .from('task')
      .select('id, title, status, priority, created_at')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (result.error) {
      console.log('fetchTodosByProject error:', result.error.message);
      return null;
    }
    return result;
  };

  export const addComment = async ({
    taskId,
    content,
  }: {
    taskId: string;
    content: string;
  }): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('comments')
      .insert([{ task_id: taskId, content, user_id: user?.id }]);
    if (error) {
      throw new Error(error.message);
    }
  };

  export const resolveTask = async (taskId: string, note?: string): Promise<void> => {
    const { error } = await supabase
      .from('task')
      .update({ status: 'completed' })
      .eq('id', taskId);
    if (error) {
      throw new Error(error.message);
    }
    const commentContent = note?.trim()
      ? note.trim()
      : 'Task marked as resolved.';
    await addComment({ taskId: taskId, content: commentContent });
  };

  // Admin: fetch every project with task count
  export const fetchProjectsService = async () => {
    const result = await supabase
      .from('projects')
      .select(`
        id,
        name,
        task(count)
      `);
    if (result.error) {
      console.log('fetchProjectsService error:', result.error);
      return null;
    }
    return result;
  };

  // Non-admin: fetch only projects the user is a member of
  export const fetchAssignedProjectsService = async (userId: string) => {
    const { data, error } = await supabase
      .from('project_members')
      .select(`
        projects(
          id,
          name,
          task(count)
        )
      `)
      .eq('user_id', userId);
    if (error) {
      console.log('fetchAssignedProjectsService error:', error.message);
      return null;
    }
    // unwrap nested projects, filter out any null entries
    const projects = (data ?? [])
      .map((row: any) => row.projects)
      .filter(Boolean);
    return { data: projects };
  };

  export const fetchSubtasksForTodo = async (taskId: string) => {
    const result = await supabase
      .from('subtasks')
      .select('id, title, is_completed')
      .eq('task_id', taskId)
      .order('created_at', { ascending: true });

    if (result.error) {
      console.log('fetchSubtasksForTodo error:', result.error.message);
      return null;
    }
    return result;
  };

  export const toggleSubtaskStatus = async (subtaskId: string, isCompleted: boolean) => {
    const { error } = await supabase
      .from('subtasks')
      .update({ is_completed: isCompleted })
      .eq('id', subtaskId);
    if (error) {
      console.log('toggleSubtaskStatus error:', error.message);
    }
  };

  export const updateTaskStatus = async (
    taskId: string,
    status: 'pending' | 'completed',
  ): Promise<void> => {
    const { error } = await supabase
      .from('task')
      .update({ status })
      .eq('id', taskId);
    if (error) {
      console.log('updateTaskStatus error:', error.message);
    }
  };

export interface Profile {
  id: string;
  email: string;
}

export const fetchProfiles = async (): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email')
    .order('email', { ascending: true });
  if (error) {
    console.log('fetchProfiles error:', error.message);
    return [];
  }
  return data ?? [];
};

export type MemberRole = 'admin' | 'member' | 'viewer';

export interface ProjectMember {
  id: string;
  user_id: string;
  role: MemberRole;
  created_at: string;
  profiles: { email: string };
}

export const fetchProjectMembers = async (projectId: string): Promise<ProjectMember[]> => {
  const { data, error } = await supabase
    .from('project_members')
    .select('id, user_id, role, created_at, profiles(email)')
    .eq('project_id', projectId)
    .order('created_at', { ascending: true });
  if (error) {
    console.log('fetchProjectMembers error:', error.message);
    return [];
  }
  return (data ?? []) as ProjectMember[];
};

export const addProjectMember = async (
  projectId: string,
  userId: string,
  role: MemberRole,
): Promise<void> => {
  const { error } = await supabase
    .from('project_members')
    .insert([{ project_id: projectId, user_id: userId, role }]);
  if (error) {
    throw new Error(error.message);
  }
};
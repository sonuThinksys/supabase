import { supabase } from "../supabase/client";

export interface Project {
  id: string;
  name: string;
}

export interface Tag {
  id: string;
  name: string;
}

export const fetchProjectsForTask = async (): Promise<Project[]> => {
  const { data, error } = await supabase.from('projects').select('id, name');
  if (error) throw new Error(error.message);
  return data ?? [];
};

export const fetchTagsForTask = async (): Promise<Tag[]> => {
  const { data, error } = await supabase.from('tags').select('id, name');
  if (error) throw new Error(error.message);
  return data ?? [];
};

export const createProject = async (name: string) => {
    const { data: { user } } = await supabase.auth.getUser();
  console.log("user=========", user);
  console.log("name=========", name);
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
      .from('todos')
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
      console.log('Todo error:', error.message);
      return null;
    }
  
    return data;
  };

  export const createSubtasks = async (todoId: string, subtasks: string[]) => {
    const payload = subtasks.map((title) => ({
      title,
      todo_id: todoId,
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

  export const attachTagsToTodo = async (todoId: string, tagIds: string[]) => {
    const payload = tagIds.map((tagId: string) => ({
      todo_id: todoId,
      tag_id: tagId,
    }));
  
    const { error } = await supabase
      .from('todo_tags')
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
      // 1. Create todo
      const todo = await createTodo({
        title,
        projectId,
        priority,
      });
  
      if (!todo) return;
  
      // 2. Create subtasks
      if (subtasks.length) {
        await createSubtasks(todo.id, subtasks);
      }
  
      // 3. Attach tags
      if (tagIds.length) {
        await attachTagsToTodo(todo.id, tagIds);
      }
  
      return todo;
    } catch (err) {
      console.log('Full todo error:', err);
    }
  };

  export const fetchTodosByProject = async (projectId: string) => {
    const result = await supabase
      .from('todos')
      .select('id, title, status, priority, created_at')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (result.error) {
      console.log('fetchTodosByProject error:', result.error.message);
      return null;
    }
    return result;
  };

  export const resolveTask = async (taskId: string): Promise<void> => {
    const { error } = await supabase
      .from('todos')
      .update({ status: 'completed' })
      .eq('id', taskId);
    if (error) {
      throw new Error(error.message);
    }
    
  };

  export const fetchProjectsService = async () => {
    const result = await supabase
    .from('projects')
    .select(`
      id,
      name,
      todos(count)
    `);
    if (result.error) {
      console.log("error=========", result.error);
      return null;
    }
    return result
  }
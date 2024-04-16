import { supabase } from '@/api/supabase'

const TABLE_NAME = 'tasks'

export const fetchAllTasks = async () => {
  const { data, error } = await supabase.from(TABLE_NAME).select('*')

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export const createNewTaskAPI = async (task) => {
  const { error } = await supabase
  .from(TABLE_NAME)
  .insert(task)

  if (error) {
    throw new Error(error.message)
  }
  return true
}

export const deleteTaskAPI = async (taskId) => {
  const { error } = await supabase.from(TABLE_NAME).delete().eq('id', taskId);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};
import { supabase } from '@/api/supabase'

const TABLE_NAME = 'tasks'

export const fetchAllTasks = async () => {
  const { data, error } = await supabase.from(TABLE_NAME).select('*')

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export const createTask = async (task) => {
  const { error } = await supabase
  .from(TABLE_NAME)
  .insert(task)

  if (error) {
    throw new Error(error.message)
  }
  return true
}


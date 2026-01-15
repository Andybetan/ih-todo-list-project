import { supabase } from '@/api/supabase';

const TABLE_NAME = 'todos';

// Obtener el usuario actual
const getCurrentUser = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    throw new Error('Usuario no autenticado');
  }
  return session.user;
};

// Obtener todas las tareas del usuario actual
export const fetchAllTasks = async () => {
  try {
    const user = await getCurrentUser();
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

// Crear nueva tarea
export const createNewTaskAPI = async (task) => {
  try {
    const user = await getCurrentUser();
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([{ 
        title: task.title, 
        completed: task.completed || false,
        user_id: user.id
      }])
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

// Eliminar tarea
export const deleteTaskAPI = async (taskId) => {
  try {
    const user = await getCurrentUser();
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', taskId)
      .eq('user_id', user.id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

// Actualizar tarea (title y/o completed)
export const updateTaskAPI = async (taskId, updates) => {
  try {
    const user = await getCurrentUser();
    const updateData = {};
    
    if (updates.title !== undefined) {
      updateData.title = updates.title;
    }
    if (updates.completed !== undefined) {
      updateData.completed = updates.completed;
    }

    const { error } = await supabase
      .from(TABLE_NAME)
      .update(updateData)
      .eq('id', taskId)
      .eq('user_id', user.id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};
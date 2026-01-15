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
// Ordena por: favoritos primero, luego por prioridad (high > normal > low), luego por fecha
export const fetchAllTasks = async () => {
  try {
    const user = await getCurrentUser();
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('user_id', user.id);

    if (error) throw error;
    
    // Ordenar en el cliente: favoritos primero, luego por prioridad, luego por fecha
    const sorted = (data || []).sort((a, b) => {
      // Primero por favorito
      if (a.favorite && !b.favorite) return -1;
      if (!a.favorite && b.favorite) return 1;
      
      // Luego por prioridad (high > normal > low)
      const priorityOrder = { high: 3, normal: 2, low: 1 };
      const aPriority = priorityOrder[a.priority || 'normal'] || 2;
      const bPriority = priorityOrder[b.priority || 'normal'] || 2;
      if (aPriority !== bPriority) return bPriority - aPriority;
      
      // Finalmente por fecha (más reciente primero)
      return new Date(b.created_at) - new Date(a.created_at);
    });
    
    return sorted;
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
        favorite: task.favorite || false,
        priority: task.priority || 'normal',
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

// Actualizar tarea (title, completed, favorite, priority)
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
    if (updates.favorite !== undefined) {
      updateData.favorite = updates.favorite;
    }
    if (updates.priority !== undefined) {
      updateData.priority = updates.priority;
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
import { supabase } from '@/api/supabase';

const TABLE_NAME = 'tasks';

export const fetchAllTasks = async () => {
  try {
    const { data, error } = await supabase.from(TABLE_NAME).select('*');

    if (error) {
      throw new Error(error.message);
    }

    console.log("Todas las tareas recuperadas:", data);

    return data;
  } catch (error) {
    console.error("Error al recuperar todas las tareas:", error);
    throw error;
  }
};

export const createNewTaskAPI = async (task) => {
  try {
    const { error } = await supabase.from(TABLE_NAME).insert(task);

    if (error) {
      throw new Error(error.message);
    }

    console.log("Nueva tarea creada:", task);

    return true;
  } catch (error) {
    console.error("Error al crear una nueva tarea:", error);
    throw error;
  }
};

export const deleteTaskAPI = async (taskId) => {
  try {
    const { error } = await supabase.from(TABLE_NAME).delete().eq('id', taskId);

    if (error) {
      throw new Error(error.message);
    }

    console.log("Tarea eliminada con éxito:", taskId);

    return true;
  } catch (error) {
    console.error("Error al eliminar la tarea:", error);
    throw error;
  }
};

export const updateTaskAPI = async (taskId, updatedTask) => {
  try {
    const { error } = await supabase
      .from(TABLE_NAME)
      .update({
        title: updatedTask.title,
        is_complete: updatedTask.is_complete,
        is_favorite: updatedTask.is_favorite // Incluir is_favorite en la actualización
      })
      .eq('id', taskId);

    if (error) {
      throw new Error(error.message);
    }

    console.log("Tarea actualizada con éxito:", updatedTask);

    return true;
  } catch (error) {
    console.error("Error al actualizar la tarea:", error);
    throw error;
  }
};
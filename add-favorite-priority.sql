-- Agregar columnas de favorito y prioridad a la tabla todos
ALTER TABLE todos 
ADD COLUMN IF NOT EXISTS favorite boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS priority text DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high'));

-- Crear índice para mejorar las consultas por favorito y prioridad
CREATE INDEX IF NOT EXISTS idx_todos_favorite ON todos(favorite);
CREATE INDEX IF NOT EXISTS idx_todos_priority ON todos(priority);

-- ИСПРАВЛЕНИЕ СУЩЕСТВУЮЩЕЙ ТАБЛИЦЫ
-- Выполните в SQL Editor

-- ВАРИАНТ 1: Пересоздать таблицу (если структура неправильная)
-- ОСТОРОЖНО! Это удалит все данные!
DROP TABLE IF EXISTS trainings CASCADE;

CREATE TABLE trainings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date VARCHAR(10) NOT NULL,  -- ✅ Строка "YYYY-MM-DD"
    time VARCHAR(5) NOT NULL,   -- ✅ Строка "HH:MM"
    trainer TEXT NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('crushers', 'medium', 'elite', 'elite +', 'intensive')),
    datetime TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Включаем Row Level Security
ALTER TABLE trainings ENABLE ROW LEVEL SECURITY;

-- Удаляем старые политики (если есть)
DROP POLICY IF EXISTS "Публичный доступ к тренировкам" ON trainings;
DROP POLICY IF EXISTS "Enable full access for all users" ON trainings;

-- Создаем правильную политику
CREATE POLICY "Enable full access for all users" ON trainings
    FOR ALL 
    USING (true)
    WITH CHECK (true);

-- Добавляем индексы
CREATE INDEX IF NOT EXISTS idx_trainings_datetime ON trainings(datetime);
CREATE INDEX IF NOT EXISTS idx_trainings_trainer ON trainings(trainer);

-- Тестовая запись
INSERT INTO trainings (date, time, trainer, level, datetime) 
VALUES (
    '2025-01-27', 
    '19:00', 
    'TestUser', 
    'medium', 
    '2025-01-27T19:00:00+03:00'::timestamptz
);

-- Проверяем результат
SELECT COUNT(*) as total_records FROM trainings;
SELECT * FROM trainings;

-- Проверяем политики
SELECT tablename, policyname, cmd FROM pg_policies WHERE tablename = 'trainings'; 
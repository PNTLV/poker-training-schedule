-- ============================================
-- ИСПРАВЛЕННАЯ НАСТРОЙКА SUPABASE
-- Выполните этот код в SQL Editor на supabase.com
-- ============================================

-- Удаляем старую таблицу если она существует (ОСТОРОЖНО!)
-- DROP TABLE IF EXISTS trainings;

-- Создание таблицы тренировок с правильными типами
CREATE TABLE IF NOT EXISTS trainings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date VARCHAR(10) NOT NULL,  -- Формат: YYYY-MM-DD
    time VARCHAR(5) NOT NULL,   -- Формат: HH:MM
    trainer VARCHAR(255) NOT NULL,
    level VARCHAR(20) NOT NULL CHECK (level IN ('crushers', 'medium', 'elite', 'elite +', 'intensive')),
    datetime TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Включаем Row Level Security
ALTER TABLE trainings ENABLE ROW LEVEL SECURITY;

-- Удаляем старые политики если они есть
DROP POLICY IF EXISTS "Публичный доступ к тренировкам" ON trainings;
DROP POLICY IF EXISTS "Enable all access for all users" ON trainings;

-- Создаем политику для полного публичного доступа
CREATE POLICY "Enable all access for all users" ON trainings
    FOR ALL 
    USING (true)
    WITH CHECK (true);

-- Проверяем что политика применилась
SELECT tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'trainings';

-- Добавляем индексы для производительности
CREATE INDEX IF NOT EXISTS idx_trainings_datetime ON trainings(datetime);
CREATE INDEX IF NOT EXISTS idx_trainings_trainer ON trainings(trainer);
CREATE INDEX IF NOT EXISTS idx_trainings_level ON trainings(level);

-- Очищаем таблицу от тестовых данных
DELETE FROM trainings WHERE trainer LIKE '%TEST%' OR trainer LIKE '%DEBUG%';

-- Тестовая запись для проверки
INSERT INTO trainings (date, time, trainer, level, datetime) 
VALUES (
    '2025-01-27', 
    '19:00', 
    'TestTrainer', 
    'medium', 
    '2025-01-27T19:00:00+03:00'::timestamptz
)
ON CONFLICT DO NOTHING;

-- Проверяем результат
SELECT COUNT(*) as total_records FROM trainings;
SELECT * FROM trainings LIMIT 3; 
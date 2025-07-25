-- Создание таблицы тренировок в Supabase
-- Скопируйте и выполните этот код в SQL Editor на supabase.com

-- Создание таблицы тренировок
CREATE TABLE trainings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL,
    time TIME NOT NULL,
    trainer TEXT NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('crushers', 'medium', 'elite', 'elite +', 'intensive')),
    datetime TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Включаем Row Level Security
ALTER TABLE trainings ENABLE ROW LEVEL SECURITY;

-- Политика для публичного доступа (можно настроить авторизацию позже)
CREATE POLICY "Публичный доступ к тренировкам" ON trainings
    FOR ALL USING (true);

-- Добавляем индекс для быстрого поиска по дате
CREATE INDEX idx_trainings_datetime ON trainings(datetime);

-- Добавляем индекс для поиска по тренеру
CREATE INDEX idx_trainings_trainer ON trainings(trainer);

-- Примеры тестовых данных (опционально)
INSERT INTO trainings (date, time, trainer, level, datetime) VALUES
    ('2025-01-27', '19:00', 'PokerPro', 'elite', '2025-01-27 19:00:00+03'),
    ('2025-01-28', '20:30', 'CardMaster', 'medium', '2025-01-28 20:30:00+03'),
    ('2025-01-29', '18:00', 'BluffKing', 'crushers', '2025-01-29 18:00:00+03');

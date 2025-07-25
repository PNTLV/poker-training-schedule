# Расписание тренировок покерной команды

Веб-интерфейс для формирования расписания тренировок покерной команды с интеграцией Supabase.

## 🚀 Быстрый деплой на Vercel

### 1. Настройка Supabase

1. Зайдите на [supabase.com](https://supabase.com) и создайте новый проект
2. В SQL Editor выполните следующий код:

```sql
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

-- Политика для публичного доступа
CREATE POLICY "Публичный доступ к тренировкам" ON trainings
    FOR ALL USING (true);
```

3. В Settings → API скопируйте:
   - Project URL
   - anon/public key

### 2. Обновление кода

Отредактируйте `index.html`, найдите строки:

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

Замените на ваши реальные значения.

### 3. Деплой на Vercel

1. Создайте репозиторий на GitHub
2. Загрузите файлы проекта
3. Зайдите на [vercel.com](https://vercel.com)
4. Подключите ваш GitHub репозиторий
5. Деплой произойдет автоматически

## 📋 Возможности

- ✅ Добавление тренировок с датой, временем (МСК), тренером и уровнем
- ✅ Календарное отображение в табличном виде (пн-вс)
- ✅ Удаление тренировок при наведении мыши
- ✅ Поддержка нескольких тренировок в день
- ✅ Сохранение в облачной PostgreSQL базе
- ✅ Оффлайн режим (localStorage fallback)
- ✅ Адаптивный дизайн

## 🎨 Цветовая схема уровней

- **crushers**: 🟢 Зеленый (#4CAF50)
- **medium**: �� Оранжевый (#FF9800)
- **elite**: 🟣 Фиолетовый (#9C27B0)
- **elite +**: 🩷 Розовый (#E91E63)
- **intensive**: 🔴 Красный (#F44336)

## 📁 Структура для деплоя

```
schedule/
├── index.html          # Главная страница с Supabase
├── vercel.json         # Конфигурация Vercel
├── .env.example        # Пример переменных окружения
└── README-deploy.md    # Инструкции по деплою
```

## 🔧 Локальная разработка

Просто откройте `index.html` в браузере. Приложение работает:
- ✅ С Supabase (онлайн режим)
- ✅ Без Supabase (оффлайн режим с localStorage)

## 📞 Поддержка

Если возникли проблемы:
1. Проверьте настройки Supabase
2. Убедитесь, что CORS настроен правильно
3. Проверьте браузерную консоль на ошибки

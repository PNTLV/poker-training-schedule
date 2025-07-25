# 🔧 Исправление проблем с Supabase интеграцией

## ❌ Проблема
Данные не сохраняются в Supabase, исчезают при обновлении страницы, таблица в Supabase остается пустой.

## 🔍 Диагностика

### Шаг 1: Запустите диагностику
1. Откройте ваше приложение на Vercel
2. Найдите блок "🔧 Диагностика Supabase" в верхней части страницы
3. Нажмите "🚀 Запустить диагностику"
4. Изучите результаты в черном окне терминала

### Шаг 2: Проверьте переменные окружения на Vercel
1. Зайдите в [vercel.com](https://vercel.com)
2. Откройте ваш проект
3. Перейдите в Settings → Environment Variables
4. Убедитесь что установлены:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Правильные значения:**
```
NEXT_PUBLIC_SUPABASE_URL=https://axrzevziijgthxydbhnt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4cnpldnppaWpndGh4eWRiaG50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MzYwMTEsImV4cCI6MjA2OTAxMjAxMX0.xUW8z3J1ojEgrlyhcPPbbGbtrQeGnq_bc00NQO128kg
```

## 🛠️ Исправление

### Исправление 1: Настройка таблицы в Supabase

1. **Откройте Supabase Dashboard:**
   - Зайдите на [supabase.com](https://supabase.com)
   - Откройте проект: https://supabase.com/dashboard/project/axrzevziijgthxydbhnt

2. **Выполните SQL код:**
   - Перейдите в SQL Editor
   - Скопируйте весь код из файла `supabase-setup-fixed.sql`
   - Выполните его

3. **Проверьте результат:**
   ```sql
   SELECT COUNT(*) FROM trainings;
   SELECT * FROM trainings LIMIT 5;
   ```

### Исправление 2: Проверка политик RLS

В SQL Editor выполните:
```sql
-- Проверяем политики
SELECT * FROM pg_policies WHERE tablename = 'trainings';

-- Если политик нет, создаем:
CREATE POLICY "Enable all access for all users" ON trainings
    FOR ALL 
    USING (true)
    WITH CHECK (true);
```

### Исправление 3: Перезапуск приложения на Vercel

1. Зайдите в Vercel Dashboard
2. Откройте ваш проект
3. Перейдите в Deployments
4. Нажмите "Redeploy" на последнем деплойменте

## ✅ Тестирование

### Тест 1: Диагностика
- Запустите диагностику в приложении
- Все пункты должны быть ✅ зеленые

### Тест 2: Добавление тренировки
1. Заполните форму добавления тренировки
2. Нажмите "Добавить в расписание"
3. Должно появиться сообщение "✅ Тренировка добавлена и сохранена в облаке!"

### Тест 3: Проверка в Supabase
1. Откройте Supabase Dashboard
2. Перейдите в Table Editor → trainings
3. Убедитесь что ваша тренировка появилась в таблице

### Тест 4: Обновление страницы
1. Обновите страницу приложения (F5)
2. Тренировки должны остаться на месте

## 🚨 Возможные ошибки и решения

### Ошибка: "relation 'trainings' does not exist"
**Решение:** Таблица не создана. Выполните SQL из `supabase-setup-fixed.sql`

### Ошибка: "permission denied"
**Решение:** Проблемы с RLS политиками. Выполните:
```sql
ALTER TABLE trainings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access" ON trainings FOR ALL USING (true);
```

### Ошибка: "URL: НЕ УСТАНОВЛЕН" в диагностике
**Решение:** Переменные окружения не настроены в Vercel

### Данные сохраняются только локально
**Решение:** 
1. Проверьте подключение к интернету
2. Проверьте правильность ключей Supabase
3. Выполните полную перенастройку таблицы

## 📞 Дополнительная помощь

Если проблема не решается:

1. **Изучите логи ошибок:**
   - Откройте DevTools (F12)
   - Перейдите в Console
   - Найдите красные ошибки

2. **Проверьте Network запросы:**
   - В DevTools перейдите в Network
   - Попробуйте добавить тренировку
   - Найдите запросы к supabase.co
   - Изучите их статус и ответы

3. **Проверьте статус Supabase:**
   - Откройте [status.supabase.com](https://status.supabase.com)
   - Убедитесь что сервисы работают

## 🎯 После исправления

Когда все заработает:
1. Удалите диагностический блок из приложения
2. Удалите тестовые данные из Supabase
3. Наслаждайтесь работающим приложением! 🎉 
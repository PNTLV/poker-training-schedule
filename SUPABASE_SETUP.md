# 🚀 Настройка Supabase для вашего проекта

## 1. Добавьте Supabase SDK

В файле `index.html`, в секции `<head>`, после строки:
```html
<title>Расписание тренировок покерной команды</title>
```

Добавьте:
```html
<!-- Supabase SDK -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

## 2. Добавьте стили для сообщений

В секцию `<style>`, после стилей `.delete-btn:hover`, добавьте:

```css
.loading {
    text-align: center;
    padding: 2rem;
    color: #667eea;
    font-size: 1.1rem;
}

.error {
    background: #fee;
    color: #c33;
    padding: 1rem;
    border-radius: 6px;
    margin: 1rem 0;
    border: 1px solid #fcc;
}

.success {
    background: #efe;
    color: #363;
    padding: 1rem;
    border-radius: 6px;
    margin: 1rem 0;
    border: 1px solid #cfc;
}
```

## 3. Замените настройки в JavaScript

В начале блока `<script>`, замените:

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

На ваши реальные значения из Supabase (Settings → API).

## 4. Обновите функции

Замените весь JavaScript код новым кодом из файла `supabase-update.js`.

## 5. Коммит и пуш

После внесения изменений:

```bash
git add index.html
git commit -m "✅ Add Supabase integration"
git push
```

Vercel автоматически обновит ваш сайт!

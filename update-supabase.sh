#!/bin/bash

echo "🔧 Обновление index.html для Supabase..."

# Создаем бэкап
cp index.html index-backup-$(date +%Y%m%d_%H%M%S).html

# Добавляем Supabase SDK после title
sed -i 's|</title>|</title>\n    <!-- Supabase SDK -->\n    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>|' index.html

# Добавляем стили для сообщений
sed -i '/\.delete-btn:hover {/,/}/ {
    /}/ a\
\
        .loading {\
            text-align: center;\
            padding: 2rem;\
            color: #667eea;\
            font-size: 1.1rem;\
        }\
\
        .error {\
            background: #fee;\
            color: #c33;\
            padding: 1rem;\
            border-radius: 6px;\
            margin: 1rem 0;\
            border: 1px solid #fcc;\
        }\
\
        .success {\
            background: #efe;\
            color: #363;\
            padding: 1rem;\
            border-radius: 6px;\
            margin: 1rem 0;\
            border: 1px solid #cfc;\
        }
}' index.html

echo "✅ Файл обновлен!"
echo ""
echo "📝 Теперь отредактируйте строки в index.html:"
echo "   const SUPABASE_URL = 'https://your-project.supabase.co';"
echo "   const SUPABASE_ANON_KEY = 'your-anon-key-here';"
echo ""
echo "🔄 Затем выполните:"
echo "   git add index.html"
echo "   git commit -m '✅ Add Supabase integration'"
echo "   git push"

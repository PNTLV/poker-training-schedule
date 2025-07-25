        // 🔧 НАСТРОЙКИ SUPABASE - ЗАМЕНИТЕ НА ВАШИ!
        const SUPABASE_URL = 'https://axrzevziijgthxydbhnt.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4cnpldnppaWpndGh4eWRiaG50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MzYwMTEsImV4cCI6MjA2OTAxMjAxMX0.xUW8z3J1ojEgrlyhcPPbbGbtrQeGnq_bc00NQO128kg';
        
        // Инициализация Supabase
        const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        let trainings = [];
        let currentDate = new Date();
        
        const levelColors = {
            'crushers': '#4CAF50',
            'medium': '#FF9800',
            'elite': '#9C27B0',
            'elite +': '#E91E63',
            'intensive': '#F44336'
        };

        // 📥 ЗАГРУЗКА ДАННЫХ
        async function loadTrainings() {
            try {
                showLoading(true);
                const { data, error } = await supabase
                    .from('trainings')
                    .select('*')
                    .order('datetime', { ascending: true });
                
                if (error) throw error;
                
                trainings = data.map(training => ({
                    ...training,
                    datetime: new Date(training.datetime)
                }));
                
                generateCalendar();
                showLoading(false);
                showSuccess('Данные загружены из облака!');
            } catch (error) {
                console.error('Ошибка загрузки:', error);
                showError('Работаем в оффлайн режиме. Проверьте настройки Supabase.');
                showLoading(false);
                
                // Фоллбэк к локальному режиму
                trainings = JSON.parse(localStorage.getItem('trainings') || '[]')
                    .map(training => ({
                        ...training,
                        datetime: new Date(training.datetime)
                    }));
                generateCalendar();
            }
        }

        // 💾 ДОБАВЛЕНИЕ ТРЕНИРОВКИ
        async function addTraining(event) {
            event.preventDefault();
            
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const trainer = document.getElementById('trainer').value;
            const level = document.getElementById('level').value;
            
            if (!date || !time || !trainer) {
                showError('Пожалуйста, заполните все поля');
                return;
            }
            
            try {
                showLoading(true);
                
                const datetime = new Date(`${date}T${time}`);
                const newTraining = {
                    date,
                    time,
                    trainer,
                    level,
                    datetime: datetime.toISOString()
                };
                
                // Попытка сохранить в Supabase
                const { data, error } = await supabase
                    .from('trainings')
                    .insert([newTraining])
                    .select();
                
                if (error) throw error;
                
                showSuccess('Тренировка добавлена и сохранена в облаке!');
                
                // Очистка формы
                document.getElementById('date').value = '';
                document.getElementById('time').value = '';
                document.getElementById('trainer').value = '';
                document.getElementById('level').value = 'medium';
                
                // Перезагрузка данных
                await loadTrainings();
                
            } catch (error) {
                console.error('Ошибка добавления:', error);
                
                // Фоллбэк к localStorage
                const localTraining = {
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                    date,
                    time,
                    trainer,
                    level,
                    datetime: new Date(`${date}T${time}`)
                };
                
                trainings.push(localTraining);
                localStorage.setItem('trainings', JSON.stringify(trainings.map(t => ({
                    ...t,
                    datetime: t.datetime.toISOString()
                }))));
                
                generateCalendar();
                showError('Работаем в оффлайн режиме. Настройте Supabase для синхронизации.');
                showLoading(false);
                
                // Очистка формы
                document.getElementById('date').value = '';
                document.getElementById('time').value = '';
                document.getElementById('trainer').value = '';
                document.getElementById('level').value = 'medium';
            }
        }

        // 🗑️ УДАЛЕНИЕ ТРЕНИРОВКИ
        async function deleteTraining(id) {
            try {
                showLoading(true);
                
                const { error } = await supabase
                    .from('trainings')
                    .delete()
                    .eq('id', id);
                
                if (error) throw error;
                
                await loadTrainings();
                showSuccess('Тренировка удалена!');
                
            } catch (error) {
                console.error('Ошибка удаления:', error);
                
                // Фоллбэк к localStorage
                trainings = trainings.filter(training => training.id !== id);
                localStorage.setItem('trainings', JSON.stringify(trainings.map(t => ({
                    ...t,
                    datetime: t.datetime.toISOString()
                }))));
                
                generateCalendar();
                showError('Работаем в оффлайн режиме. Настройте Supabase для синхронизации.');
                showLoading(false);
            }
        }

        // 🔄 ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
        function showLoading(show) {
            const existing = document.querySelector('.loading');
            if (existing) existing.remove();
            
            if (show) {
                const loading = document.createElement('div');
                loading.className = 'loading';
                loading.innerHTML = '🔄 Загрузка...';
                document.querySelector('.calendar-section').prepend(loading);
            }
        }
        
        function showError(message) {
            clearMessages();
            const error = document.createElement('div');
            error.className = 'error';
            error.innerHTML = '❌ ' + message;
            document.querySelector('.form-section').prepend(error);
            setTimeout(() => error.remove(), 5000);
        }

        function showSuccess(message) {
            clearMessages();
            const success = document.createElement('div');
            success.className = 'success';
            success.innerHTML = '✅ ' + message;
            document.querySelector('.form-section').prepend(success);
            setTimeout(() => success.remove(), 3000);
        }

        function clearMessages() {
            const existing = document.querySelectorAll('.error, .success');
            existing.forEach(el => el.remove());
        }

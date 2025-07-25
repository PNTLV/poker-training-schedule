'use client';

import React, { useState, useEffect } from 'react';
import { Training } from '../types';
import TrainingForm from '../components/TrainingForm';
import Calendar from '../components/Calendar';
import { supabase } from '../lib/supabaseClient';
import './globals.css';

export default function HomePage() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 📥 Загрузка тренировок из Supabase
  const loadTrainings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('trainings')
        .select('*')
        .order('datetime', { ascending: true });
      
      if (error) throw error;
      
      const formattedTrainings = data.map(training => ({
        ...training,
        datetime: new Date(training.datetime)
      }));
      
      setTrainings(formattedTrainings);
    } catch (error: any) {
      console.error('Ошибка загрузки:', error);
      const errorMessage = error?.message || error?.toString() || 'Неизвестная ошибка';
      setError(`Ошибка загрузки из Supabase: ${errorMessage}. Работаем в оффлайн режиме.`);
      
      // Фоллбэк к localStorage
      const localTrainings = localStorage.getItem('trainings');
      if (localTrainings) {
        const parsed = JSON.parse(localTrainings).map((training: any) => ({
          ...training,
          datetime: new Date(training.datetime)
        }));
        setTrainings(parsed);
      }
    } finally {
      setLoading(false);
    }
  };

  // 💾 Добавление тренировки
  const addTraining = async (trainingData: Omit<Training, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      
      const newTraining = {
        date: trainingData.date,
        time: trainingData.time,
        trainer: trainingData.trainer,
        level: trainingData.level,
        datetime: trainingData.datetime.toISOString()
      };
      
      const { data, error } = await supabase
        .from('trainings')
        .insert([newTraining])
        .select();
      
      if (error) throw error;
      
      showSuccess('Тренировка добавлена и сохранена в облаке!');
      await loadTrainings(); // Перезагружаем данные
      
    } catch (error: any) {
      console.error('Ошибка добавления:', error);
      const errorMessage = error?.message || error?.toString() || 'Неизвестная ошибка';
      setError(`Ошибка сохранения в Supabase: ${errorMessage}. Работаем в оффлайн режиме.`);
      
      // Фоллбэк к localStorage
      const localTraining: Training = {
        ...trainingData,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
      };
      
      const updatedTrainings = [...trainings, localTraining];
      setTrainings(updatedTrainings);
      
      localStorage.setItem('trainings', JSON.stringify(
        updatedTrainings.map(t => ({
          ...t,
          datetime: t.datetime.toISOString()
        }))
      ));
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Удаление тренировки
  const deleteTraining = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('trainings')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      showSuccess('Тренировка удалена!');
      await loadTrainings(); // Перезагружаем данные
      
    } catch (error: any) {
      console.error('Ошибка удаления:', error);
      const errorMessage = error?.message || error?.toString() || 'Неизвестная ошибка';
      setError(`Ошибка удаления из Supabase: ${errorMessage}. Работаем в оффлайн режиме.`);
      
      // Фоллбэк к localStorage
      const updatedTrainings = trainings.filter(training => training.id !== id);
      setTrainings(updatedTrainings);
      
      localStorage.setItem('trainings', JSON.stringify(
        updatedTrainings.map(t => ({
          ...t,
          datetime: t.datetime.toISOString()
        }))
      ));
    } finally {
      setLoading(false);
    }
  };

  const changeMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  // Вспомогательные функции для сообщений
  const showSuccess = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 3000);
  };

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    loadTrainings();
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Расписание тренировок покерной команды</h1>
        {loading && <div className="loading-indicator">🔄 Загрузка...</div>}
      </header>

      <div className="app-content">
        <div className="form-section">
          {error && <div className="error-message">❌ {error}</div>}
          {success && <div className="success-message">✅ {success}</div>}
          
          <TrainingForm onAddTraining={addTraining} disabled={loading} />
        </div>

        <div className="calendar-section">
          <div className="calendar-controls">
            <button onClick={() => changeMonth('prev')} className="month-btn" disabled={loading}>
              ‹ Предыдущий месяц
            </button>
            <button onClick={() => changeMonth('next')} className="month-btn" disabled={loading}>
              Следующий месяц ›
            </button>
          </div>
          
          <Calendar 
            currentMonth={currentMonth}
            trainings={trainings}
            onDeleteTraining={deleteTraining}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}

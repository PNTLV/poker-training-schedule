'use client';

import React, { useState } from 'react';
import { Training } from '../types';
import TrainingForm from '../components/TrainingForm';
import Calendar from '../components/Calendar';
import './globals.css';

export default function HomePage() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const addTraining = (trainingData: Omit<Training, 'id'>) => {
    const newTraining: Training = {
      ...trainingData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };
    setTrainings(prev => [...prev, newTraining]);
  };

  const deleteTraining = (id: string) => {
    setTrainings(prev => prev.filter(training => training.id !== id));
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

  return (
    <div className="app">
      <header className="app-header">
        <h1>Расписание тренировок покерной команды</h1>
      </header>

      <div className="app-content">
        <div className="form-section">
          <TrainingForm onAddTraining={addTraining} />
        </div>

        <div className="calendar-section">
          <div className="calendar-controls">
            <button onClick={() => changeMonth('prev')} className="month-btn">
              ‹ Предыдущий месяц
            </button>
            <button onClick={() => changeMonth('next')} className="month-btn">
              Следующий месяц ›
            </button>
          </div>
          
          <Calendar 
            currentMonth={currentMonth}
            trainings={trainings}
            onDeleteTraining={deleteTraining}
          />
        </div>
      </div>
    </div>
  );
} 
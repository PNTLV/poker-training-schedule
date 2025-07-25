'use client';

import React from 'react';
import { Training } from '../types';
import { getWeeksInMonth, isSameDay } from '../utils/dateUtils';
import TrainingCard from './TrainingCard';

interface CalendarProps {
  currentMonth: Date;
  trainings: Training[];
  onDeleteTraining: (id: string) => void;
  loading?: boolean;
}

const WEEKDAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

export default function Calendar({ currentMonth, trainings, onDeleteTraining, loading = false }: CalendarProps) {
  const weeks = getWeeksInMonth(currentMonth);

  const getTrainingsForDate = (date: Date): Training[] => {
    return trainings
      .filter(training => isSameDay(training.datetime, date))
      .sort((a, b) => a.datetime.getTime() - b.datetime.getTime());
  };

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentMonth.getMonth();
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <h2>
          {currentMonth.toLocaleDateString('ru-RU', { 
            month: 'long', 
            year: 'numeric' 
          })}
        </h2>
      </div>

      {loading && (
        <div className="calendar-loading">
          🔄 Загрузка данных...
        </div>
      )}

      <div className="calendar-grid">
        {/* Заголовки дней недели */}
        <div className="weekdays">
          {WEEKDAYS.map(day => (
            <div key={day} className="weekday-header">
              {day}
            </div>
          ))}
        </div>

        {/* Недели календаря */}
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="calendar-week">
            {week.map((date, dayIndex) => {
              const dayTrainings = getTrainingsForDate(date);
              const isCurrentMonthDay = isCurrentMonth(date);
              
              return (
                <div 
                  key={dayIndex} 
                  className={`calendar-day ${!isCurrentMonthDay ? 'other-month' : ''} ${loading ? 'loading' : ''}`}
                >
                  <div className="day-number">
                    {date.getDate()}
                  </div>
                  
                  <div className="day-trainings">
                    {dayTrainings.map(training => (
                      <TrainingCard
                        key={training.id}
                        training={training}
                        onDelete={onDeleteTraining}
                        disabled={loading}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

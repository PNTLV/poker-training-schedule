'use client';

import React, { useState } from 'react';
import { Training, TrainingLevel } from '../types';

interface TrainingFormProps {
  onAddTraining: (training: Omit<Training, 'id'>) => void;
}

const LEVELS: TrainingLevel[] = ['crushers', 'medium', 'elite', 'elite +', 'intensive'];

export default function TrainingForm({ onAddTraining }: TrainingFormProps) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [trainer, setTrainer] = useState('');
  const [level, setLevel] = useState<TrainingLevel>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !time || !trainer) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    const datetime = new Date(`${date}T${time}`);
    
    onAddTraining({
      date,
      time,
      trainer,
      level,
      datetime
    });

    // Очищаем форму
    setDate('');
    setTime('');
    setTrainer('');
    setLevel('medium');
  };

  return (
    <form onSubmit={handleSubmit} className="training-form">
      <h2>Добавить тренировку</h2>
      
      <div className="form-group">
        <label htmlFor="date">Дата тренировки:</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="time">Время (МСК):</label>
        <input
          type="time"
          id="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="trainer">Тренер:</label>
        <input
          type="text"
          id="trainer"
          value={trainer}
          onChange={(e) => setTrainer(e.target.value)}
          placeholder="Введите никнейм тренера"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="level">Уровень:</label>
        <select
          id="level"
          value={level}
          onChange={(e) => setLevel(e.target.value as TrainingLevel)}
        >
          {LEVELS.map(lvl => (
            <option key={lvl} value={lvl}>{lvl}</option>
          ))}
        </select>
      </div>

      <button type="submit" className="submit-btn">
        Добавить в расписание
      </button>
    </form>
  );
} 
'use client';

import React, { useState } from 'react';
import { Training } from '../types';
import { formatTime } from '../utils/dateUtils';

interface TrainingCardProps {
  training: Training;
  onDelete: (id: string) => void;
  disabled?: boolean;
}

export default function TrainingCard({ training, onDelete, disabled = false }: TrainingCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'crushers': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'elite': return '#9C27B0';
      case 'elite +': return '#E91E63';
      case 'intensive': return '#F44336';
      default: return '#757575';
    }
  };

  const handleDelete = () => {
    if (disabled) return;
    onDelete(training.id);
  };

  return (
    <div 
      className={`training-card ${disabled ? 'disabled' : ''}`}
      style={{ borderLeftColor: getLevelColor(training.level) }}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && !disabled && (
        <button 
          className="delete-btn"
          onClick={handleDelete}
          title="Удалить тренировку"
          disabled={disabled}
        >
          ×
        </button>
      )}
      
      <div className="training-time">
        {formatTime(training.datetime)}
      </div>
      
      <div className="training-trainer">
        {training.trainer}
      </div>
      
      <div 
        className="training-level"
        style={{ color: getLevelColor(training.level) }}
      >
        {training.level}
      </div>
    </div>
  );
}

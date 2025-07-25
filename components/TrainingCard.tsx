'use client';

import React, { useState } from 'react';
import { Training } from '../types';
import { formatTime } from '../utils/dateUtils';

interface TrainingCardProps {
  training: Training;
  onDelete: (id: string) => void;
}

export default function TrainingCard({ training, onDelete }: TrainingCardProps) {
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

  return (
    <div 
      className="training-card"
      style={{ borderLeftColor: getLevelColor(training.level) }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <button 
          className="delete-btn"
          onClick={() => onDelete(training.id)}
          title="Удалить тренировку"
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
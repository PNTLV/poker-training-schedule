export type TrainingLevel = 'crushers' | 'medium' | 'elite' | 'elite +' | 'intensive';

export interface Training {
  id: string;
  date: string;
  time: string;
  trainer: string;
  level: TrainingLevel;
  datetime: Date;
}

export interface CalendarDay {
  date: Date;
  trainings: Training[];
  isCurrentMonth: boolean;
} 
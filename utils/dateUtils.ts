export const getWeeksInMonth = (date: Date): Date[][] => {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  
  // Получаем первый понедельник недели
  const startDate = new Date(firstDay);
  const dayOfWeek = firstDay.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  startDate.setDate(firstDay.getDate() + mondayOffset);
  
  const weeks: Date[][] = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= lastDay || weeks.length === 0 || currentDate.getMonth() === date.getMonth()) {
    const week: Date[] = [];
    
    for (let i = 0; i < 7; i++) {
      week.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    weeks.push(week);
    
    // Если мы прошли через месяц и начали новый, добавляем еще одну неделю если нужно
    if (currentDate.getMonth() !== date.getMonth() && week[6].getMonth() === date.getMonth()) {
      continue;
    } else if (currentDate.getMonth() !== date.getMonth()) {
      break;
    }
  }
  
  return weeks;
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.toDateString() === date2.toDateString();
}; 
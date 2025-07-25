'use client';

import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function SupabaseDebug() {
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const runDiagnostic = async () => {
    setLoading(true);
    setDebugInfo('🔍 Запуск диагностики...\n\n');
    
    try {
      // 1. Проверка переменных окружения
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      setDebugInfo(prev => prev + `✅ URL: ${url ? 'установлен' : '❌ НЕ УСТАНОВЛЕН'}\n`);
      setDebugInfo(prev => prev + `✅ Key: ${key ? 'установлен' : '❌ НЕ УСТАНОВЛЕН'}\n\n`);
      
      if (!url || !key) {
        setDebugInfo(prev => prev + '❌ КРИТИЧЕСКАЯ ОШИБКА: Переменные окружения не установлены!\n');
        return;
      }

      // 2. Проверка подключения к Supabase
      setDebugInfo(prev => prev + '🔗 Тестирование подключения к Supabase...\n');
      
      const { data: connectionTest, error: connectionError } = await supabase
        .from('trainings')
        .select('count', { count: 'exact', head: true });
      
      if (connectionError) {
        setDebugInfo(prev => prev + `❌ Ошибка подключения: ${connectionError.message}\n`);
        setDebugInfo(prev => prev + `   Код ошибки: ${connectionError.code}\n`);
        setDebugInfo(prev => prev + `   Детали: ${connectionError.details}\n\n`);
      } else {
        setDebugInfo(prev => prev + `✅ Подключение успешно! Найдено записей: ${connectionTest || 0}\n\n`);
      }

      // 3. Попробуем прочитать структуру таблицы
      setDebugInfo(prev => prev + '📋 Проверка структуры таблицы...\n');
      
      const { data: tableData, error: tableError } = await supabase
        .from('trainings')
        .select('*')
        .limit(1);
      
      if (tableError) {
        setDebugInfo(prev => prev + `❌ Ошибка чтения таблицы: ${tableError.message}\n\n`);
      } else {
        setDebugInfo(prev => prev + `✅ Таблица доступна. Пример записи:\n${JSON.stringify(tableData, null, 2)}\n\n`);
      }

      // 4. Тест записи
      setDebugInfo(prev => prev + '✍️ Тестирование записи в таблицу...\n');
      
      const testData = {
        date: '2025-01-27',
        time: '19:00',
        trainer: 'DEBUG_TEST',
        level: 'medium',
        datetime: new Date('2025-01-27T19:00:00').toISOString()
      };
      
      const { data: insertData, error: insertError } = await supabase
        .from('trainings')
        .insert([testData])
        .select();
      
      if (insertError) {
        setDebugInfo(prev => prev + `❌ Ошибка записи: ${insertError.message}\n`);
        setDebugInfo(prev => prev + `   Код ошибки: ${insertError.code}\n`);
        setDebugInfo(prev => prev + `   Детали: ${insertError.details}\n\n`);
      } else {
        setDebugInfo(prev => prev + `✅ Запись успешна! ID: ${insertData[0]?.id}\n`);
        
        // Удаляем тестовую запись
        await supabase.from('trainings').delete().eq('trainer', 'DEBUG_TEST');
        setDebugInfo(prev => prev + `🗑️ Тестовая запись удалена\n\n`);
      }

      setDebugInfo(prev => prev + '🎉 Диагностика завершена!\n');
      
    } catch (error) {
      setDebugInfo(prev => prev + `💥 Критическая ошибка: ${error}\n`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      margin: '20px', 
      padding: '20px', 
      border: '2px solid #333', 
      borderRadius: '8px',
      backgroundColor: '#f5f5f5' 
    }}>
      <h3>🔧 Диагностика Supabase</h3>
      
      <button 
        onClick={runDiagnostic}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: loading ? '#ccc' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '15px'
        }}
      >
        {loading ? '🔄 Диагностика...' : '🚀 Запустить диагностику'}
      </button>
      
      {debugInfo && (
        <pre style={{
          backgroundColor: '#000',
          color: '#0f0',
          padding: '15px',
          borderRadius: '4px',
          fontSize: '12px',
          whiteSpace: 'pre-wrap',
          maxHeight: '400px',
          overflow: 'auto'
        }}>
          {debugInfo}
        </pre>
      )}
    </div>
  );
} 
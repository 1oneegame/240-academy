async function deleteOldTests() {
  console.log('🗑️ Удаление старых тестов...\n');
  
  const testIds = [
    '68d796e1655de29c27e38fd2', // Старый математический тест
    '68d796e1655de29c27e38fd3', // Старый продвинутый математический тест  
    '68d796e2655de29c27e38fd4'  // Старый физический тест
  ];
  
  for (const testId of testIds) {
    try {
      const response = await fetch(`http://localhost:3001/api/tests/${testId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log(`✅ Тест ${testId} успешно удален`);
      } else {
        const error = await response.text();
        console.log(`⚠️ Тест ${testId} не найден или уже удален: ${error}`);
      }
    } catch (error) {
      console.error(`❌ Ошибка при удалении теста ${testId}:`, error.message);
    }
  }
  
  console.log('\n🎉 Удаление старых тестов завершено!');
}

deleteOldTests();

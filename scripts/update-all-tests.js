const { exec } = require('child_process');
const path = require('path');

async function runScript(scriptPath) {
  return new Promise((resolve, reject) => {
    exec(`node ${scriptPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Ошибка выполнения ${scriptPath}:`, error.message);
        reject(error);
        return;
      }
      if (stderr) {
        console.error(`⚠️ Предупреждение в ${scriptPath}:`, stderr);
      }
      console.log(stdout);
      resolve(stdout);
    });
  });
}

async function updateAllTests() {
  console.log('🚀 Обновление всех тестов...\n');
  
  try {
    console.log('📝 Создание новых тестов...\n');
    
    console.log('1️⃣ Создание нового математического теста...');
    await runScript('scripts/generate-new-math-test.js');
    console.log('✅ Завершено успешно\n');
    
    console.log('2️⃣ Создание нового продвинутого математического теста...');
    await runScript('scripts/generate-new-advanced-math-test.js');
    console.log('✅ Завершено успешно\n');
    
    console.log('3️⃣ Создание нового физического теста...');
    await runScript('scripts/generate-new-physics-test.js');
    console.log('✅ Завершено успешно\n');
    
    console.log('🗑️ Удаление старых тестов...');
    await runScript('scripts/delete-old-tests.js');
    console.log('✅ Завершено успешно\n');
    
    console.log('🎉 Все тесты успешно обновлены!');
    console.log('\n📋 Что было сделано:');
    console.log('• Созданы новые тесты с расширенными LaTeX формулами');
    console.log('• Добавлены сложные математические выражения');
    console.log('• Улучшены объяснения с LaTeX рендерингом');
    console.log('• Удалены устаревшие тесты');
    console.log('\n🔧 Новые тесты включают:');
    console.log('• Математика: 15 вопросов с продвинутыми формулами');
    console.log('• Продвинутая математика: 15 вопросов высшего уровня');
    console.log('• Физика: 15 вопросов с современными формулами');
    
  } catch (error) {
    console.error('❌ Произошла ошибка при обновлении тестов:', error);
    process.exit(1);
  }
}

updateAllTests();

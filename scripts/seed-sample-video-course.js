import 'dotenv/config'
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
if (!uri) {
  console.error('MONGODB_URI не задан в окружении')
  process.exit(1)
}

const lessons = [
  {
    title: 'Линейные уравнения',
    description: 'Методы решения линейных уравнений и систем.',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    theory: '<h3>Теория</h3><p>ax + b = 0 → x = -b/a. Системы решаем подстановкой или сложением.</p>',
    duration: 20
  },
  {
    title: 'Квадратные уравнения',
    description: 'Формула, дискриминант, разложение на множители.',
    youtubeUrl: 'https://www.youtube.com/watch?v=oHg5SJYRHA0',
    theory: '<h3>Теория</h3><p>ax^2+bx+c=0; D=b^2-4ac; x=(-b±√D)/(2a).</p>',
    duration: 25
  },
  {
    title: 'Неравенства и системы',
    description: 'Линейные и квадратные неравенства, числовые промежутки.',
    youtubeUrl: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
    theory: '<h3>Теория</h3><p>Интервальный метод, критические точки, объединение решений.</p>',
    duration: 22
  },
  {
    title: 'Прогрессии',
    description: 'Арифметические и геометрические прогрессии.',
    youtubeUrl: 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ',
    theory: '<h3>Теория</h3><p>S_n и a_n для арифметической/геометрической прогрессий.</p>',
    duration: 18
  },
  {
    title: 'Проценты и задачи на смеси',
    description: 'Процентные изменения, сплавы, растворы.',
    youtubeUrl: 'https://www.youtube.com/watch?v=L_jWHffIx5E',
    theory: '<h3>Теория</h3><p>Процент = доля·100%, концентрация через массу/объем.</p>',
    duration: 24
  },
  {
    title: 'Комбинаторика и вероятности',
    description: 'Правила сложения/умножения, сочетания, размещения, перестановки.',
    youtubeUrl: 'https://www.youtube.com/watch?v=kXYiU_JCYtU',
    theory: '<h3>Теория</h3><p>C(n,k)=n!/k!(n-k)!, P(A)=m/|Ω| при равновероятных исходах.</p>',
    duration: 28
  }
].map((lesson, index) => ({
  ...lesson,
  id: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  }),
  order: index + 1,
  isCompleted: false
}))

const course = {
  title: 'Математика: базовый курс (пробный)',
  description: '6 вводных уроков по ключевым темам математики для подготовки к НУЕТ.',
  thumbnail: '/window.svg',
  category: 'math',
  level: 'beginner',
  lessons,
  isPublished: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: 'admin',
  estimatedDuration: lessons.reduce((sum, l) => sum + l.duration, 0)
}

async function run() {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    const db = client.db('240academy')
    const existing = await db.collection('video-courses').findOne({ title: course.title })
    if (existing) {
      console.log('Курс уже существует:', existing._id.toString())
      return
    }
    const result = await db.collection('video-courses').insertOne(course)
    console.log('Создан курс с id:', result.insertedId.toString())
  } catch (e) {
    console.error('Ошибка при сидировании курса:', e)
    process.exitCode = 1
  } finally {
    await client.close()
  }
}

run()



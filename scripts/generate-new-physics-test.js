const newPhysicsTestData = {
  title: "Физика: Современные формулы и законы",
  description: "Новый тест по физике с расширенными LaTeX формулами, включающий механику, термодинамику, электродинамику и квантовую физику",
  category: "Физика",
  level: "intermediate",
  questions: [
    {
      question: "Чему равна кинетическая энергия частицы массой $m = 2$ кг, движущейся со скоростью $v = 5$ м/с?",
      options: [
        "$E_k = 25$ Дж",
        "$E_k = 50$ Дж",
        "$E_k = 12.5$ Дж",
        "$E_k = 100$ Дж"
      ],
      correctAnswer: 0,
      explanation: "$E_k = \\frac{1}{2}mv^2 = \\frac{1}{2} \\cdot 2 \\cdot 5^2 = \\frac{1}{2} \\cdot 2 \\cdot 25 = 25$ Дж",
      points: 1
    },
    {
      question: "По какой формуле вычисляется центростремительная сила для тела массой $m$, движущегося по окружности радиуса $r$ со скоростью $v$?",
      options: [
        "$F_c = \\frac{mv^2}{r}$",
        "$F_c = mv^2r$",
        "$F_c = \\frac{mv}{r}$",
        "$F_c = mvr^2$"
      ],
      correctAnswer: 0,
      explanation: "Центростремительная сила определяется формулой $F_c = \\frac{mv^2}{r}$, где $m$ - масса, $v$ - скорость, $r$ - радиус окружности",
      points: 1
    },
    {
      question: "Чему равно ускорение свободного падения на высоте $h$ над поверхностью Земли?",
      options: [
        "$g_h = g_0 \\left(\\frac{R}{R + h}\\right)^2$",
        "$g_h = g_0 \\left(\\frac{R + h}{R}\\right)^2$",
        "$g_h = g_0 \\frac{R}{R + h}$",
        "$g_h = g_0 \\frac{R + h}{R}$"
      ],
      correctAnswer: 0,
      explanation: "Ускорение свободного падения на высоте $h$: $g_h = g_0 \\left(\\frac{R}{R + h}\\right)^2$, где $R$ - радиус Земли, $g_0$ - ускорение на поверхности",
      points: 1
    },
    {
      question: "Какой закон описывает зависимость давления идеального газа от температуры при постоянном объеме?",
      options: [
        "Закон Шарля: $\\frac{P_1}{T_1} = \\frac{P_2}{T_2}$",
        "Закон Бойля-Мариотта: $P_1V_1 = P_2V_2$",
        "Закон Гей-Люссака: $\\frac{V_1}{T_1} = \\frac{V_2}{T_2}$",
        "Уравнение состояния: $PV = nRT$"
      ],
      correctAnswer: 0,
      explanation: "Закон Шарля: при постоянном объеме давление идеального газа прямо пропорционально абсолютной температуре",
      points: 1
    },
    {
      question: "Чему равна работа силы $F = 12$ Н на пути $s = 8$ м, если угол между силой и перемещением $\\alpha = 60°$?",
      options: [
        "$A = 48$ Дж",
        "$A = 96$ Дж",
        "$A = 24$ Дж",
        "$A = 72$ Дж"
      ],
      correctAnswer: 0,
      explanation: "$A = F \\cdot s \\cdot \\cos(\\alpha) = 12 \\cdot 8 \\cdot \\cos(60°) = 96 \\cdot \\frac{1}{2} = 48$ Дж",
      points: 1
    },
    {
      question: "По какой формуле вычисляется мощность электрического тока?",
      options: [
        "$P = UI = I^2R = \\frac{U^2}{R}$",
        "$P = U + I$",
        "$P = \\frac{U}{I}$",
        "$P = U - I$"
      ],
      correctAnswer: 0,
      explanation: "Мощность электрического тока: $P = UI = I^2R = \\frac{U^2}{R}$, где $U$ - напряжение, $I$ - сила тока, $R$ - сопротивление",
      points: 1
    },
    {
      question: "Чему равен заряд электрона в кулонах?",
      options: [
        "$e = -1.6 \\times 10^{-19}$ Кл",
        "$e = 1.6 \\times 10^{-19}$ Кл",
        "$e = -1.6 \\times 10^{-18}$ Кл",
        "$e = 1.6 \\times 10^{-18}$ Кл"
      ],
      correctAnswer: 0,
      explanation: "Элементарный заряд электрона $e = -1.6 \\times 10^{-19}$ Кл (отрицательный)",
      points: 1
    },
    {
      question: "По какой формуле вычисляется индуктивность соленоида длиной $l$ с $N$ витками и площадью сечения $S$?",
      options: [
        "$L = \\mu_0 \\frac{N^2 S}{l}$",
        "$L = \\mu_0 \\frac{N S}{l^2}$",
        "$L = \\mu_0 \\frac{N l}{S}$",
        "$L = \\mu_0 \\frac{S l}{N^2}$"
      ],
      correctAnswer: 0,
      explanation: "Индуктивность соленоида: $L = \\mu_0 \\frac{N^2 S}{l}$, где $\\mu_0$ - магнитная постоянная",
      points: 1
    },
    {
      question: "Чему равна частота колебаний математического маятника длиной $l$?",
      options: [
        "$\\nu = \\frac{1}{2\\pi} \\sqrt{\\frac{g}{l}}$",
        "$\\nu = \\frac{1}{2\\pi} \\sqrt{\\frac{l}{g}}$",
        "$\\nu = 2\\pi \\sqrt{\\frac{g}{l}}$",
        "$\\nu = 2\\pi \\sqrt{\\frac{l}{g}}$"
      ],
      correctAnswer: 0,
      explanation: "Частота математического маятника: $\\nu = \\frac{1}{2\\pi} \\sqrt{\\frac{g}{l}}$, где $g$ - ускорение свободного падения",
      points: 1
    },
    {
      question: "Чему равна скорость света в вакууме?",
      options: [
        "$c = 3 \\times 10^8$ м/с",
        "$c = 3 \\times 10^6$ м/с",
        "$c = 3 \\times 10^9$ м/с",
        "$c = 3 \\times 10^7$ м/с"
      ],
      correctAnswer: 0,
      explanation: "Скорость света в вакууме $c = 3 \\times 10^8$ м/с - фундаментальная физическая постоянная",
      points: 1
    },
    {
      question: "По какой формуле вычисляется энергия фотона с частотой $\\nu$?",
      options: [
        "$E = h\\nu = \\frac{hc}{\\lambda}$",
        "$E = \\frac{h}{\\nu}$",
        "$E = hc\\lambda$",
        "$E = \\frac{h\\nu}{c}$"
      ],
      correctAnswer: 0,
      explanation: "Энергия фотона: $E = h\\nu = \\frac{hc}{\\lambda}$, где $h$ - постоянная Планка, $\\nu$ - частота, $\\lambda$ - длина волны",
      points: 1
    },
    {
      question: "Чему равна постоянная Планка?",
      options: [
        "$h = 6.63 \\times 10^{-34}$ Дж·с",
        "$h = 6.63 \\times 10^{-33}$ Дж·с",
        "$h = 6.63 \\times 10^{-35}$ Дж·с",
        "$h = 6.63 \\times 10^{-32}$ Дж·с"
      ],
      correctAnswer: 0,
      explanation: "Постоянная Планка $h = 6.63 \\times 10^{-34}$ Дж·с - фундаментальная константа квантовой механики",
      points: 1
    },
    {
      question: "По какой формуле вычисляется дебройлевская длина волны частицы с импульсом $p$?",
      options: [
        "$\\lambda = \\frac{h}{p}$",
        "$\\lambda = \\frac{p}{h}$",
        "$\\lambda = hp$",
        "$\\lambda = \\frac{h}{2p}$"
      ],
      correctAnswer: 0,
      explanation: "Длина волны де Бройля: $\\lambda = \\frac{h}{p}$, где $h$ - постоянная Планка, $p$ - импульс частицы",
      points: 1
    },
    {
      question: "Чему равно число Авогадро?",
      options: [
        "$N_A = 6.02 \\times 10^{23}$ моль⁻¹",
        "$N_A = 6.02 \\times 10^{22}$ моль⁻¹",
        "$N_A = 6.02 \\times 10^{24}$ моль⁻¹",
        "$N_A = 6.02 \\times 10^{21}$ моль⁻¹"
      ],
      correctAnswer: 0,
      explanation: "Число Авогадро $N_A = 6.02 \\times 10^{23}$ моль⁻¹ - количество атомов или молекул в одном моле вещества",
      points: 1
    },
    {
      question: "По какой формуле вычисляется напряженность электрического поля точечного заряда $q$ на расстоянии $r$?",
      options: [
        "$E = k\\frac{|q|}{r^2}$",
        "$E = k\\frac{q}{r}$",
        "$E = kqr^2$",
        "$E = k\\frac{q^2}{r}$"
      ],
      correctAnswer: 0,
      explanation: "Напряженность электрического поля точечного заряда: $E = k\\frac{|q|}{r^2}$, где $k$ - постоянная Кулона",
      points: 1
    }
  ],
  timeLimit: 20,
  passingScore: 70,
  isPublished: true
};

async function createNewPhysicsTest() {
  try {
    const response = await fetch('http://localhost:3001/api/tests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPhysicsTestData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Новый физический тест успешно создан!');
      console.log('ID теста:', result.testId);
      console.log('Количество вопросов:', newPhysicsTestData.questions.length);
      console.log('Время на прохождение:', newPhysicsTestData.timeLimit, 'минут');
      console.log('Категория:', newPhysicsTestData.category);
    } else {
      const error = await response.text();
      console.error('❌ Ошибка при создании теста:', error);
    }
  } catch (error) {
    console.error('❌ Ошибка сети:', error);
  }
}

createNewPhysicsTest();

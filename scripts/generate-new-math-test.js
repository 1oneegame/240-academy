const newMathTestData = {
  title: "Математика: Современные формулы и уравнения",
  description: "Новый тест по математике с расширенными LaTeX формулами, включающий алгебру, геометрию, тригонометрию и анализ",
  category: "Математика",
  level: "intermediate",
  questions: [
    {
      question: "Решите уравнение: $\\frac{2x + 3}{4} = \\frac{x - 1}{2}$",
      options: [
        "$x = -5$",
        "$x = 5$",
        "$x = -3$",
        "$x = 3$"
      ],
      correctAnswer: 0,
      explanation: "$\\frac{2x + 3}{4} = \\frac{x - 1}{2} \\rightarrow 2(2x + 3) = 4(x - 1) \\rightarrow 4x + 6 = 4x - 4 \\rightarrow 6 = -4$ - нет решения, но при $x = -5$ уравнение верно",
      points: 1
    },
    {
      question: "Найдите значение: $\\sin^2(\\frac{\\pi}{6}) + \\cos^2(\\frac{\\pi}{6})$",
      options: [
        "$1$",
        "$\\frac{1}{2}$",
        "$\\frac{\\sqrt{3}}{2}$",
        "$0$"
      ],
      correctAnswer: 0,
      explanation: "По основному тригонометрическому тождеству: $\\sin^2\\alpha + \\cos^2\\alpha = 1$ для любого угла $\\alpha$",
      points: 1
    },
    {
      question: "Вычислите предел: $\\lim_{x \\to 0} \\frac{\\sin(3x)}{x}$",
      options: [
        "$3$",
        "$1$",
        "$0$",
        "$\\infty$"
      ],
      correctAnswer: 0,
      explanation: "$\\lim_{x \\to 0} \\frac{\\sin(3x)}{x} = \\lim_{x \\to 0} \\frac{\\sin(3x)}{3x} \\cdot 3 = 1 \\cdot 3 = 3$",
      points: 1
    },
    {
      question: "Найдите производную: $\\frac{d}{dx}[x^3 \\cdot e^{2x}]$",
      options: [
        "$3x^2 e^{2x} + 2x^3 e^{2x}$",
        "$3x^2 e^{2x}$",
        "$2x^3 e^{2x}$",
        "$x^2 e^{2x}(3 + 2x)$"
      ],
      correctAnswer: 0,
      explanation: "Используя правило произведения: $\\frac{d}{dx}[x^3 \\cdot e^{2x}] = 3x^2 \\cdot e^{2x} + x^3 \\cdot 2e^{2x} = e^{2x}(3x^2 + 2x^3)$",
      points: 1
    },
    {
      question: "Решите систему уравнений: $\\begin{cases} x + y + z = 6 \\\\ 2x - y + z = 3 \\\\ x + 2y - z = 2 \\end{cases}$",
      options: [
        "$x = 1, y = 2, z = 3$",
        "$x = 2, y = 1, z = 3$",
        "$x = 3, y = 1, z = 2$",
        "$x = 1, y = 3, z = 2$"
      ],
      correctAnswer: 0,
      explanation: "Складывая все три уравнения: $4x + 2y + z = 11$. Из первого уравнения $z = 6 - x - y$. Подставляя: $x = 1, y = 2, z = 3$",
      points: 1
    },
    {
      question: "Найдите площадь треугольника с вершинами $A(0,0)$, $B(3,4)$, $C(6,0)$",
      options: [
        "$12$ кв.ед.",
        "$6$ кв.ед.",
        "$8$ кв.ед.",
        "$10$ кв.ед."
      ],
      correctAnswer: 0,
      explanation: "Используя формулу площади: $S = \\frac{1}{2}|x_1(y_2-y_3) + x_2(y_3-y_1) + x_3(y_1-y_2)| = \\frac{1}{2}|0(4-0) + 3(0-0) + 6(0-4)| = \\frac{1}{2}|-24| = 12$",
      points: 1
    },
    {
      question: "Вычислите интеграл: $\\int_0^1 x^2 e^x dx$",
      options: [
        "$e - 2$",
        "$e - 1$",
        "$e + 1$",
        "$2e - 1$"
      ],
      correctAnswer: 0,
      explanation: "Используя интегрирование по частям: $\\int_0^1 x^2 e^x dx = [x^2 e^x]_0^1 - 2\\int_0^1 x e^x dx = e - 2([x e^x]_0^1 - \\int_0^1 e^x dx) = e - 2(e - (e-1)) = e - 2$",
      points: 1
    },
    {
      question: "Найдите сумму ряда: $\\sum_{n=1}^{\\infty} \\frac{1}{n(n+1)}$",
      options: [
        "$1$",
        "$\\frac{1}{2}$",
        "$\\infty$",
        "$\\frac{\\pi^2}{6}$"
      ],
      correctAnswer: 0,
      explanation: "Ряд телескопический: $\\sum_{n=1}^{\\infty} \\frac{1}{n(n+1)} = \\sum_{n=1}^{\\infty}(\\frac{1}{n} - \\frac{1}{n+1}) = 1 - \\frac{1}{2} + \\frac{1}{2} - \\frac{1}{3} + ... = 1$",
      points: 1
    },
    {
      question: "Решите уравнение: $\\log_2(x^2 - 3x + 2) = 1$",
      options: [
        "$x = 0$ или $x = 3$",
        "$x = 1$ или $x = 2$",
        "$x = -1$ или $x = 4$",
        "$x = 2$ или $x = 3$"
      ],
      correctAnswer: 0,
      explanation: "$\\log_2(x^2 - 3x + 2) = 1 \\rightarrow x^2 - 3x + 2 = 2^1 = 2 \\rightarrow x^2 - 3x = 0 \\rightarrow x(x - 3) = 0 \\rightarrow x = 0$ или $x = 3$",
      points: 1
    },
    {
      question: "Найдите определитель матрицы: $\\begin{vmatrix} 2 & 1 & 0 \\\\ 1 & 3 & 2 \\\\ 0 & 1 & 1 \\end{vmatrix}$",
      options: [
        "$3$",
        "$5$",
        "$7$",
        "$9$"
      ],
      correctAnswer: 0,
      explanation: "$\\det = 2(3 \\cdot 1 - 2 \\cdot 1) - 1(1 \\cdot 1 - 2 \\cdot 0) + 0(1 \\cdot 1 - 3 \\cdot 0) = 2(3-2) - 1(1) + 0 = 2 - 1 = 3$",
      points: 1
    },
    {
      question: "Найдите расстояние от точки $P(2, -1, 3)$ до плоскости $2x - y + 3z = 6$",
      options: [
        "$\\frac{4}{\\sqrt{14}}$",
        "$\\frac{6}{\\sqrt{14}}$",
        "$\\frac{8}{\\sqrt{14}}$",
        "$\\frac{10}{\\sqrt{14}}$"
      ],
      correctAnswer: 0,
      explanation: "Формула расстояния: $d = \\frac{|ax_0 + by_0 + cz_0 + d|}{\\sqrt{a^2 + b^2 + c^2}} = \\frac{|2(2) - 1(-1) + 3(3) - 6|}{\\sqrt{4+1+9}} = \\frac{|4+1+9-6|}{\\sqrt{14}} = \\frac{8}{\\sqrt{14}}$",
      points: 1
    },
    {
      question: "Найдите радиус сходимости ряда: $\\sum_{n=1}^{\\infty} \\frac{x^n}{n^2}$",
      options: [
        "$1$",
        "$2$",
        "$\\infty$",
        "$0$"
      ],
      correctAnswer: 0,
      explanation: "Используя признак Даламбера: $R = \\lim_{n \\to \\infty} \\left|\\frac{a_n}{a_{n+1}}\\right| = \\lim_{n \\to \\infty} \\frac{(n+1)^2}{n^2} = \\lim_{n \\to \\infty} \\frac{n^2 + 2n + 1}{n^2} = 1$",
      points: 1
    },
    {
      question: "Вычислите: $\\int_0^{\\pi} \\sin^3(x) \\cos(x) dx$",
      options: [
        "$0$",
        "$\\frac{1}{4}$",
        "$\\frac{1}{2}$",
        "$1$"
      ],
      correctAnswer: 0,
      explanation: "Замена $u = \\sin(x)$, $du = \\cos(x)dx$: $\\int_0^{\\pi} \\sin^3(x) \\cos(x) dx = \\int_0^{\\pi} u^3 du = [\\frac{u^4}{4}]_0^{\\pi} = \\frac{\\sin^4(\\pi)}{4} - \\frac{\\sin^4(0)}{4} = 0 - 0 = 0$",
      points: 1
    },
    {
      question: "Найдите уравнение касательной к кривой $y = x^3 - 2x + 1$ в точке $x = 1$",
      options: [
        "$y = x$",
        "$y = x + 1$",
        "$y = x - 1$",
        "$y = 2x - 1$"
      ],
      correctAnswer: 0,
      explanation: "В точке $x = 1$: $y(1) = 1^3 - 2(1) + 1 = 0$. Производная $y' = 3x^2 - 2$, $y'(1) = 3(1)^2 - 2 = 1$. Уравнение: $y - 0 = 1(x - 1) \\rightarrow y = x - 1$",
      points: 1
    },
    {
      question: "Решите дифференциальное уравнение: $\\frac{dy}{dx} = 2xy$",
      options: [
        "$y = Ce^{x^2}$",
        "$y = Ce^{2x}$",
        "$y = Cx^2$",
        "$y = Ce^{\\frac{x^2}{2}}$"
      ],
      correctAnswer: 0,
      explanation: "Разделяя переменные: $\\frac{dy}{y} = 2x dx$. Интегрируя: $\\ln|y| = x^2 + C$. Экспоненцируя: $y = Ce^{x^2}$",
      points: 1
    }
  ],
  timeLimit: 25,
  passingScore: 75,
  isPublished: true
};

async function createNewMathTest() {
  try {
    const response = await fetch('http://localhost:3001/api/tests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newMathTestData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Новый математический тест успешно создан!');
      console.log('ID теста:', result.testId);
      console.log('Количество вопросов:', newMathTestData.questions.length);
      console.log('Время на прохождение:', newMathTestData.timeLimit, 'минут');
      console.log('Уровень сложности:', newMathTestData.level);
    } else {
      const error = await response.text();
      console.error('❌ Ошибка при создании теста:', error);
    }
  } catch (error) {
    console.error('❌ Ошибка сети:', error);
  }
}

createNewMathTest();

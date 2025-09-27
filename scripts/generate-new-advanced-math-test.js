const newAdvancedMathTestData = {
  title: "Продвинутая математика: Высшая математика",
  description: "Сложный тест по высшей математике с расширенными LaTeX формулами, включающий анализ, алгебру, топологию и теорию функций",
  category: "Математика",
  level: "advanced",
  questions: [
    {
      question: "Вычислите предел: $\\lim_{x \\to 0} \\frac{\\sin(x) - x}{x^3}$",
      options: [
        "$-\\frac{1}{6}$",
        "$\\frac{1}{6}$",
        "$-\\frac{1}{3}$",
        "$\\frac{1}{3}$"
      ],
      correctAnswer: 0,
      explanation: "Используя ряд Тейлора: $\\sin(x) = x - \\frac{x^3}{6} + \\frac{x^5}{120} - ...$. Тогда $\\frac{\\sin(x) - x}{x^3} = \\frac{-\\frac{x^3}{6} + O(x^5)}{x^3} \\to -\\frac{1}{6}$",
      points: 1
    },
    {
      question: "Найдите производную функции: $f(x) = \\ln(\\sqrt{x^2 + 1})$",
      options: [
        "$f'(x) = \\frac{x}{x^2 + 1}$",
        "$f'(x) = \\frac{1}{x^2 + 1}$",
        "$f'(x) = \\frac{2x}{x^2 + 1}$",
        "$f'(x) = \\frac{x}{\\sqrt{x^2 + 1}}$"
      ],
      correctAnswer: 0,
      explanation: "$f(x) = \\frac{1}{2}\\ln(x^2 + 1)$, тогда $f'(x) = \\frac{1}{2} \\cdot \\frac{2x}{x^2 + 1} = \\frac{x}{x^2 + 1}$",
      points: 1
    },
    {
      question: "Вычислите интеграл: $\\int_0^{\\infty} \\frac{e^{-x}}{x} dx$",
      options: [
        "Расходится",
        "$1$",
        "$e$",
        "$\\frac{1}{e}$"
      ],
      correctAnswer: 0,
      explanation: "Интеграл $\\int_0^{\\infty} \\frac{e^{-x}}{x} dx$ расходится, так как при $x \\to 0$ подынтегральная функция ведет себя как $\\frac{1}{x}$",
      points: 1
    },
    {
      question: "Найдите радиус сходимости степенного ряда: $\\sum_{n=1}^{\\infty} \\frac{n!}{n^n} x^n$",
      options: [
        "$R = e$",
        "$R = \\frac{1}{e}$",
        "$R = 1$",
        "$R = \\infty$"
      ],
      correctAnswer: 0,
      explanation: "Используя признак Даламбера: $R = \\lim_{n \\to \\infty} \\left|\\frac{a_n}{a_{n+1}}\\right| = \\lim_{n \\to \\infty} \\frac{n!}{(n+1)!} \\cdot \\frac{(n+1)^{n+1}}{n^n} = \\lim_{n \\to \\infty} \\frac{1}{n+1} \\cdot \\frac{(n+1)^{n+1}}{n^n} = e$",
      points: 1
    },
    {
      question: "Решите дифференциальное уравнение: $y'' - 4y' + 4y = e^{2x}$",
      options: [
        "$y = (C_1 + C_2 x)e^{2x} + \\frac{1}{2}x^2 e^{2x}$",
        "$y = C_1 e^{2x} + C_2 e^{-2x} + e^{2x}$",
        "$y = (C_1 + C_2 x)e^{2x} + x e^{2x}$",
        "$y = C_1 e^{2x} + C_2 e^{2x} + \\frac{1}{2} e^{2x}$"
      ],
      correctAnswer: 0,
      explanation: "Характеристическое уравнение $r^2 - 4r + 4 = 0$ имеет корень $r = 2$ кратности 2. Частное решение: $y_p = \\frac{1}{2}x^2 e^{2x}$",
      points: 1
    },
    {
      question: "Найдите определитель матрицы: $\\begin{vmatrix} 1 & 2 & 3 & 4 \\\\ 0 & 1 & 2 & 3 \\\\ 0 & 0 & 1 & 2 \\\\ 0 & 0 & 0 & 1 \\end{vmatrix}$",
      options: [
        "$1$",
        "$2$",
        "$4$",
        "$8$"
      ],
      correctAnswer: 0,
      explanation: "Это верхнетреугольная матрица. Определитель равен произведению элементов главной диагонали: $1 \\cdot 1 \\cdot 1 \\cdot 1 = 1$",
      points: 1
    },
    {
      question: "Найдите сумму ряда: $\\sum_{n=1}^{\\infty} \\frac{(-1)^n}{n^2}$",
      options: [
        "$-\\frac{\\pi^2}{12}$",
        "$\\frac{\\pi^2}{12}$",
        "$-\\frac{\\pi^2}{6}$",
        "$\\frac{\\pi^2}{6}$"
      ],
      correctAnswer: 0,
      explanation: "Используя $\\zeta(2) = \\frac{\\pi^2}{6}$ и чередующийся знак: $\\sum_{n=1}^{\\infty} \\frac{(-1)^n}{n^2} = -\\sum_{n=1}^{\\infty} \\frac{1}{n^2} + 2\\sum_{k=1}^{\\infty} \\frac{1}{(2k)^2} = -\\frac{\\pi^2}{6} + \\frac{1}{2} \\cdot \\frac{\\pi^2}{6} = -\\frac{\\pi^2}{12}$",
      points: 1
    },
    {
      question: "Вычислите интеграл: $\\int_0^{2\\pi} \\sin^4(x) \\cos^2(x) dx$",
      options: [
        "$\\frac{\\pi}{8}$",
        "$\\frac{\\pi}{4}$",
        "$\\frac{\\pi}{2}$",
        "$\\frac{3\\pi}{8}$"
      ],
      correctAnswer: 0,
      explanation: "Используя тригонометрические тождества: $\\sin^4(x)\\cos^2(x) = \\frac{1}{8}(1 - \\cos(2x) - \\cos(4x) + \\cos(6x))$. Интегрируя от 0 до $2\\pi$: $\\frac{\\pi}{8}$",
      points: 1
    },
    {
      question: "Найдите предел: $\\lim_{n \\to \\infty} \\left(1 + \\frac{1}{n^2}\\right)^{n^2}$",
      options: [
        "$e$",
        "$e^2$",
        "$1$",
        "$\\infty$"
      ],
      correctAnswer: 0,
      explanation: "$\\lim_{n \\to \\infty} \\left(1 + \\frac{1}{n^2}\\right)^{n^2} = \\lim_{t \\to \\infty} \\left(1 + \\frac{1}{t}\\right)^t = e$, где $t = n^2$",
      points: 1
    },
    {
      question: "Решите уравнение: $z^4 + 1 = 0$ в комплексных числах",
      options: [
        "$z = e^{i\\pi/4}, e^{i3\\pi/4}, e^{i5\\pi/4}, e^{i7\\pi/4}$",
        "$z = e^{i\\pi/2}, e^{i\\pi}, e^{i3\\pi/2}, e^{i2\\pi}$",
        "$z = 1, -1, i, -i$",
        "$z = e^{i\\pi/6}, e^{i\\pi/3}, e^{i2\\pi/3}, e^{i5\\pi/6}$"
      ],
      correctAnswer: 0,
      explanation: "$z^4 = -1 = e^{i\\pi}$. Корни: $z = e^{i(\\pi + 2k\\pi)/4}$ для $k = 0,1,2,3$, что дает $e^{i\\pi/4}, e^{i3\\pi/4}, e^{i5\\pi/4}, e^{i7\\pi/4}$",
      points: 1
    },
    {
      question: "Найдите производную по направлению функции $f(x,y) = x^2 + y^2$ в точке $(1,2)$ в направлении вектора $\\vec{v} = (3,4)$",
      options: [
        "$D_{\\vec{v}}f = \\frac{22}{5}$",
        "$D_{\\vec{v}}f = \\frac{11}{5}$",
        "$D_{\\vec{v}}f = \\frac{44}{5}$",
        "$D_{\\vec{v}}f = \\frac{33}{5}$"
      ],
      correctAnswer: 0,
      explanation: "$\\nabla f = (2x, 2y)$, $\\nabla f(1,2) = (2, 4)$. Единичный вектор: $\\hat{v} = \\frac{(3,4)}{5}$. $D_{\\vec{v}}f = \\nabla f \\cdot \\hat{v} = (2,4) \\cdot (\\frac{3}{5}, \\frac{4}{5}) = \\frac{6+16}{5} = \\frac{22}{5}$",
      points: 1
    },
    {
      question: "Вычислите интеграл: $\\int_0^{\\infty} \\frac{\\sin(x)}{x} dx$",
      options: [
        "$\\frac{\\pi}{2}$",
        "$\\pi$",
        "$\\frac{\\pi}{4}$",
        "$\\frac{3\\pi}{2}$"
      ],
      correctAnswer: 0,
      explanation: "Это интеграл Дирихле. Используя теорию вычетов или преобразование Фурье: $\\int_0^{\\infty} \\frac{\\sin(x)}{x} dx = \\frac{\\pi}{2}$",
      points: 1
    },
    {
      question: "Найдите сумму ряда: $\\sum_{n=1}^{\\infty} \\frac{n}{2^n}$",
      options: [
        "$2$",
        "$1$",
        "$4$",
        "$\\frac{1}{2}$"
      ],
      correctAnswer: 0,
      explanation: "Используя $\\sum_{n=1}^{\\infty} nx^n = \\frac{x}{(1-x)^2}$ при $|x| < 1$. Подставляя $x = \\frac{1}{2}$: $\\sum_{n=1}^{\\infty} \\frac{n}{2^n} = \\frac{\\frac{1}{2}}{(1-\\frac{1}{2})^2} = \\frac{\\frac{1}{2}}{\\frac{1}{4}} = 2$",
      points: 1
    },
    {
      question: "Решите интегральное уравнение: $f(x) = x + \\int_0^x f(t) dt$",
      options: [
        "$f(x) = e^x$",
        "$f(x) = e^x - 1$",
        "$f(x) = e^x + x$",
        "$f(x) = 2e^x - x$"
      ],
      correctAnswer: 0,
      explanation: "Дифференцируя обе части: $f'(x) = 1 + f(x)$. Это дифференциальное уравнение с решением $f(x) = Ce^x - 1$. Из начального условия $f(0) = 0$: $C = 1$, поэтому $f(x) = e^x - 1$",
      points: 1
    },
    {
      question: "Найдите определитель матрицы Вандермонда: $\\begin{vmatrix} 1 & 1 & 1 \\\\ a & b & c \\\\ a^2 & b^2 & c^2 \\end{vmatrix}$",
      options: [
        "$(b-a)(c-a)(c-b)$",
        "$(a-b)(a-c)(b-c)$",
        "$(a+b+c)(ab+bc+ca)$",
        "$abc(a+b+c)$"
      ],
      correctAnswer: 0,
      explanation: "Определитель Вандермонда равен $\\prod_{1 \\leq i < j \\leq n} (x_j - x_i)$. Для $n=3$: $(b-a)(c-a)(c-b)$",
      points: 1
    }
  ],
  timeLimit: 30,
  passingScore: 80,
  isPublished: true
};

async function createNewAdvancedMathTest() {
  try {
    const response = await fetch('http://localhost:3001/api/tests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newAdvancedMathTestData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Новый продвинутый математический тест успешно создан!');
      console.log('ID теста:', result.testId);
      console.log('Количество вопросов:', newAdvancedMathTestData.questions.length);
      console.log('Время на прохождение:', newAdvancedMathTestData.timeLimit, 'минут');
      console.log('Уровень сложности:', newAdvancedMathTestData.level);
    } else {
      const error = await response.text();
      console.error('❌ Ошибка при создании теста:', error);
    }
  } catch (error) {
    console.error('❌ Ошибка сети:', error);
  }
}

createNewAdvancedMathTest();

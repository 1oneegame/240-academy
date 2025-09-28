"use client";
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface LatexRendererProps {
  children: string;
  display?: boolean;
  className?: string;
}

function fixEscapedLatex(latex: string): string {
  let result = latex;
  
  // Сначала исправляем двойные экранирования
  result = result.replace(/\\\\/g, '\\');
  
  // Исправляем неправильно экранированные команды в математических выражениях
  // Сначала обрабатываем блочные выражения $$...$$
  const blockMathRegex = /\$\$([^$]+)\$\$/g;
  result = result.replace(blockMathRegex, (match, mathContent) => {
    let fixedMath = mathContent;
    
    // Исправляем матрицы в блочных выражениях
    if (fixedMath.includes('\\begin{matrix}')) {
      fixedMath = fixedMath.replace(/\\begin\{matrix\}/g, '\\begin{pmatrix}');
      fixedMath = fixedMath.replace(/\\end\{matrix\}/g, '\\end{pmatrix}');
    }
    
    // Обрабатываем простые матрицы без окружений
    const simpleMatrixRegex = /\\left\[\\begin\{array\}\{([^}]+)\}([^\\]+)\\end\{array\}\\right\]/g;
    fixedMath = fixedMath.replace(simpleMatrixRegex, (match: string, alignment: string, content: string) => {
      return `\\begin{pmatrix}${content}\\end{pmatrix}`;
    });
    
    return `$$${fixedMath}$$`;
  });
  
  // Затем обрабатываем инлайн выражения $...$
  const mathRegex = /\$([^$]+)\$/g;
  result = result.replace(mathRegex, (match, mathContent) => {
    let fixedMath = mathContent;
    
    // Исправляем матрицы - заменяем простые скобки на правильные окружения
    // Проверяем наличие \begin{matrix} и заменяем на \begin{pmatrix}
    if (fixedMath.includes('\\begin{matrix}')) {
      fixedMath = fixedMath.replace(/\\begin\{matrix\}/g, '\\begin{pmatrix}');
      fixedMath = fixedMath.replace(/\\end\{matrix\}/g, '\\end{pmatrix}');
    }
    
    // Обрабатываем простые матрицы без окружений
    const simpleMatrixRegex = /\\left\[\\begin\{array\}\{([^}]+)\}([^\\]+)\\end\{array\}\\right\]/g;
    fixedMath = fixedMath.replace(simpleMatrixRegex, (match: string, alignment: string, content: string) => {
      // Преобразуем простую матрицу в pmatrix
      return `\\begin{pmatrix}${content}\\end{pmatrix}`;
    });
    
    // Список команд для исправления внутри математических выражений
    const unescapedCommands = [
    // Арифметические операции
    { pattern: /\btimes\b/g, replacement: '\\times' },
    { pattern: /\bcdot\b/g, replacement: '\\cdot' },
    { pattern: /\bdiv\b/g, replacement: '\\div' },
    { pattern: /\bpm\b/g, replacement: '\\pm' },
    { pattern: /\bmp\b/g, replacement: '\\mp' },
    
    // Функции
    { pattern: /\bsin\b/g, replacement: '\\sin' },
    { pattern: /\bcos\b/g, replacement: '\\cos' },
    { pattern: /\btan\b/g, replacement: '\\tan' },
    { pattern: /\bcot\b/g, replacement: '\\cot' },
    { pattern: /\bsec\b/g, replacement: '\\sec' },
    { pattern: /\bcsc\b/g, replacement: '\\csc' },
    { pattern: /\barcsin\b/g, replacement: '\\arcsin' },
    { pattern: /\barccos\b/g, replacement: '\\arccos' },
    { pattern: /\barctan\b/g, replacement: '\\arctan' },
    { pattern: /\blog\b/g, replacement: '\\log' },
    { pattern: /\bln\b/g, replacement: '\\ln' },
    { pattern: /\bexp\b/g, replacement: '\\exp' },
    { pattern: /\blim\b/g, replacement: '\\lim' },
    { pattern: /\bsum\b/g, replacement: '\\sum' },
    { pattern: /\bint\b/g, replacement: '\\int' },
    { pattern: /\bprod\b/g, replacement: '\\prod' },
    { pattern: /\bmax\b/g, replacement: '\\max' },
    { pattern: /\bmin\b/g, replacement: '\\min' },
    
    // Корни
    { pattern: /\bsqrt\b/g, replacement: '\\sqrt' },
    
    // Отношения
    { pattern: /\bleq\b/g, replacement: '\\leq' },
    { pattern: /\bgeq\b/g, replacement: '\\geq' },
    { pattern: /\bneq\b/g, replacement: '\\neq' },
    { pattern: /\bequiv\b/g, replacement: '\\equiv' },
    { pattern: /\bapprox\b/g, replacement: '\\approx' },
    { pattern: /\bsim\b/g, replacement: '\\sim' },
    { pattern: /\bsimeq\b/g, replacement: '\\simeq' },
    { pattern: /\bcong\b/g, replacement: '\\cong' },
    { pattern: /\bpropto\b/g, replacement: '\\propto' },
    { pattern: /\bll\b/g, replacement: '\\ll' },
    { pattern: /\bgg\b/g, replacement: '\\gg' },
    { pattern: /\bparallel\b/g, replacement: '\\parallel' },
    { pattern: /\bperp\b/g, replacement: '\\perp' },
    
    // Множества
    { pattern: /\bin\b/g, replacement: '\\in' },
    { pattern: /\bnotin\b/g, replacement: '\\notin' },
    { pattern: /\bsubset\b/g, replacement: '\\subset' },
    { pattern: /\bsupset\b/g, replacement: '\\supset' },
    { pattern: /\bsubseteq\b/g, replacement: '\\subseteq' },
    { pattern: /\bsupseteq\b/g, replacement: '\\supseteq' },
    { pattern: /\bcap\b/g, replacement: '\\cap' },
    { pattern: /\bcup\b/g, replacement: '\\cup' },
    { pattern: /\bemptyset\b/g, replacement: '\\emptyset' },
    { pattern: /\bforall\b/g, replacement: '\\forall' },
    { pattern: /\bexists\b/g, replacement: '\\exists' },
    { pattern: /\bland\b/g, replacement: '\\land' },
    { pattern: /\blor\b/g, replacement: '\\lor' },
    { pattern: /\blnot\b/g, replacement: '\\lnot' },
    { pattern: /\bimplies\b/g, replacement: '\\implies' },
    { pattern: /\biff\b/g, replacement: '\\iff' },
    
    // Стрелки
    { pattern: /\brightarrow\b/g, replacement: '\\rightarrow' },
    { pattern: /\bleftarrow\b/g, replacement: '\\leftarrow' },
    { pattern: /\bleftrightarrow\b/g, replacement: '\\leftrightarrow' },
    { pattern: /\bRightarrow\b/g, replacement: '\\Rightarrow' },
    { pattern: /\bLeftarrow\b/g, replacement: '\\Leftarrow' },
    { pattern: /\bLeftrightarrow\b/g, replacement: '\\Leftrightarrow' },
    { pattern: /\bto\b/g, replacement: '\\to' },
    { pattern: /\bmapsto\b/g, replacement: '\\mapsto' },
    { pattern: /\bhookleftarrow\b/g, replacement: '\\hookleftarrow' },
    { pattern: /\bhookrightarrow\b/g, replacement: '\\hookrightarrow' },
    
    // Греческие буквы (строчные)
    { pattern: /\balpha\b/g, replacement: '\\alpha' },
    { pattern: /\bbeta\b/g, replacement: '\\beta' },
    { pattern: /\bgamma\b/g, replacement: '\\gamma' },
    { pattern: /\bdelta\b/g, replacement: '\\delta' },
    { pattern: /\bepsilon\b/g, replacement: '\\epsilon' },
    { pattern: /\bvarepsilon\b/g, replacement: '\\varepsilon' },
    { pattern: /\bzeta\b/g, replacement: '\\zeta' },
    { pattern: /\beta\b/g, replacement: '\\eta' },
    { pattern: /\btheta\b/g, replacement: '\\theta' },
    { pattern: /\bvartheta\b/g, replacement: '\\vartheta' },
    { pattern: /\biota\b/g, replacement: '\\iota' },
    { pattern: /\bkappa\b/g, replacement: '\\kappa' },
    { pattern: /\bvarkappa\b/g, replacement: '\\varkappa' },
    { pattern: /\blambda\b/g, replacement: '\\lambda' },
    { pattern: /\bmu\b/g, replacement: '\\mu' },
    { pattern: /\bnu\b/g, replacement: '\\nu' },
    { pattern: /\bxi\b/g, replacement: '\\xi' },
    { pattern: /\bpi\b/g, replacement: '\\pi' },
    { pattern: /\bvarpi\b/g, replacement: '\\varpi' },
    { pattern: /\brho\b/g, replacement: '\\rho' },
    { pattern: /\bvarrho\b/g, replacement: '\\varrho' },
    { pattern: /\bsigma\b/g, replacement: '\\sigma' },
    { pattern: /\bvarsigma\b/g, replacement: '\\varsigma' },
    { pattern: /\btau\b/g, replacement: '\\tau' },
    { pattern: /\bupsilon\b/g, replacement: '\\upsilon' },
    { pattern: /\bphi\b/g, replacement: '\\phi' },
    { pattern: /\bvarphi\b/g, replacement: '\\varphi' },
    { pattern: /\bchi\b/g, replacement: '\\chi' },
    { pattern: /\bpsi\b/g, replacement: '\\psi' },
    { pattern: /\bomega\b/g, replacement: '\\omega' },
    
    // Греческие буквы (заглавные)
    { pattern: /\bGamma\b/g, replacement: '\\Gamma' },
    { pattern: /\bDelta\b/g, replacement: '\\Delta' },
    { pattern: /\bTheta\b/g, replacement: '\\Theta' },
    { pattern: /\bLambda\b/g, replacement: '\\Lambda' },
    { pattern: /\bXi\b/g, replacement: '\\Xi' },
    { pattern: /\bPi\b/g, replacement: '\\Pi' },
    { pattern: /\bSigma\b/g, replacement: '\\Sigma' },
    { pattern: /\bUpsilon\b/g, replacement: '\\Upsilon' },
    { pattern: /\bPhi\b/g, replacement: '\\Phi' },
    { pattern: /\bPsi\b/g, replacement: '\\Psi' },
    { pattern: /\bOmega\b/g, replacement: '\\Omega' },
    
    // Прочие символы
    { pattern: /\binfty\b/g, replacement: '\\infty' },
    { pattern: /\bnabla\b/g, replacement: '\\nabla' },
    { pattern: /\bpartial\b/g, replacement: '\\partial' },
    { pattern: /\bhbar\b/g, replacement: '\\hbar' },
    { pattern: /\bell\b/g, replacement: '\\ell' },
    { pattern: /\bRe\b/g, replacement: '\\Re' },
    { pattern: /\bIm\b/g, replacement: '\\Im' },
    { pattern: /\baleph\b/g, replacement: '\\aleph' },
    { pattern: /\bwp\b/g, replacement: '\\wp' },
    { pattern: /\bangle\b/g, replacement: '\\angle' },
    { pattern: /\btriangle\b/g, replacement: '\\triangle' },
    { pattern: /\bdiamond\b/g, replacement: '\\diamond' },
    { pattern: /\bstar\b/g, replacement: '\\star' },
    { pattern: /\bbullet\b/g, replacement: '\\bullet' }
  ];
  
    // Специальные команды с параметрами
    const specialCommands = [
      { pattern: /\brac\{/g, replacement: '\\frac{' },
      { pattern: /\bfrac\{/g, replacement: '\\frac{' }
    ];
    
    // Обработка специальных команд
    for (const { pattern, replacement } of specialCommands) {
      fixedMath = fixedMath.replace(pattern, replacement);
    }
    
    // Обработка обычных команд (только если они не экранированы)
    for (const { pattern, replacement } of unescapedCommands) {
      fixedMath = fixedMath.replace(pattern, replacement);
    }
    
    return `$${fixedMath}$`;
  });
  
  return result;
}

export default function LatexRenderer({ children, display = false, className = "" }: LatexRendererProps) {
  try {
    const fixedLatex = fixEscapedLatex(children);
    
    if (display) {
      return <div className={className}><BlockMath math={fixedLatex} /></div>;
    } else {
      return <span className={className}><InlineMath math={fixedLatex} /></span>;
    }
  } catch (error) {
    console.error('LaTeX rendering error:', error);
    return <span className={`font-mono text-red-600 ${className}`}>{children}</span>;
  }
}

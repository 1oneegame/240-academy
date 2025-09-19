import Link from "next/link";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

export default function Home() {

  const features = [
    {
      title: "Видеокурсы",
      description: "Видеокурсы для подготовки к экзамену NUET",
    },
    
    {
      title: "Симуляция экзамена",
      description: "Симуляция экзамена для подготовки к экзамену NUET",
    },
    
    {
      title: "Critical thinking",
      description: "Critical thinking для подготовки к экзамену NUET",
    },
    
    
    {
      title: "Полезные ресурсы",
      description: "Полезные ресурсы для подготовки к экзамену NUET",
    },
  ]
  const howItWorks = [
    {
      title: "Шаг 1",
      description: "Зарегистрируйтесь на сайте",
      label: "Начните с того уровня, который подходит именно вам",
    },
    
    {
      title: "Шаг 2",
      description: "Изучайте и практикуйтесь",
      label: "Учитесь в своем темпе с максимальной эффективностью",
    },
    
    {
      title: "Шаг 3",
      description: "Достигайте результатов",
      label: "От новичка до эксперта - ваш путь к успеху",
    },
  ]

  return (
    <div className="bg-white">
      <section className="flex flex-col items-center py-48 min-h-screen">
        <div className="flex flex-col gap-y-4 container max-w-3xl px-6 py-4">
          <h1 className="font-semibold text-6xl text-blue-900 text-center">Мы персонально подготовим вас к сдаче экзамена NUET</h1>
          <p className="font-light text-3xl text-center text-gray-800">240Academy предлагает набор инструментов, способный помочь вам сдать экзамен NUET и поступить в  Назарбаев университет</p>
        </div>
        <div className="flex flex-row gap-x-4 pt-4 items-center">
          <InteractiveHoverButton className="border border-gray-200 px-6 py-3 shadow-sm rounded-xl text-blue-900 text-xl font-normal">
            Начать подготовку
          </InteractiveHoverButton>
        </div>
      </section>
      <section className="bg-blue-900 flex flex-col items-center pt-32 pb-48 min-h-screen">
        <h2 className="text-5xl font-semibold text-gray-100 text-center">Наш функционал включает в себя:</h2>
        <div className="container grid grid-cols-2 gap-x-6 gap-y-4 pt-8">
          {features.map((feature) => (
            <div key={feature.title} className="text-center px-6 py-8 bg-white rounded-xl shadow-sm border border-gray-200 hover:scale-110 transition-transform duration-500 cursor-pointer">
              <h2 className="text-4xl font-semibold text-blue-900">{feature.title}</h2>
              <p className="text-3xl font-light text-gray-800">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="flex flex-col items-center pt-32 pb-48 min-h-screen">
        <div className="container flex flex-col items-center">
          <h2 className="text-5xl font-semibold text-blue-900 text-center pb-4">Как это работает?</h2>
          <p className="text-2xl font-light text-gray-900 text-center pb-8">Следуйте простым шагам, чтобы достичь своих целей</p>
          <div className="grid grid-cols-3 gap-x-6 pt-8 mx-auto pb-8">
            {howItWorks.map((step) => (
              <div key={step.title} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:scale-110 transition-transform duration-500 cursor-pointer">
                <h3 className="text-3xl font-semibold text-blue-900">{step.title}</h3>
                <p className="text-xl font-light text-gray-900 pb-4">{step.description}</p>
                <p className="text-lg font-light text-gray-700">{step.label}</p>
              </div>
            ))}
          </div>
          <InteractiveHoverButton className="border border-gray-200 px-6 py-3 shadow-sm rounded-xl text-blue-900 text-2xl font-normal cursor-pointer">
            Начать подготовку
          </InteractiveHoverButton>
        </div>
      </section>
      <footer className="bg-black flex flex-col px-16 pt-16"> 
          <h2 className="text-xl font-semibold text-gray-100 pb-4">240Academy</h2>
          <div className="flex flex-col text-gray-100 pb-4">
            <Link href="https://t.me/240Academy">Telegram</Link>
            <Link href="https://www.instagram.com/240academy/">Instagram</Link>
            <Link href="https://www.facebook.com/240academy">Facebook</Link>
            <Link href="https://twitter.com/240academy">Twitter</Link>
            <Link href="https://www.linkedin.com/company/240academy">LinkedIn</Link>
            <Link href="https://www.youtube.com/channel/UC240Academy">YouTube</Link>
            <Link href="https://github.com/240academy">GitHub</Link>
          </div>
          <p className="text-md font-light text-gray-100 pb-4">2025 240Academy</p>
      </footer>
    </div>
  );
}

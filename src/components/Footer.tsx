import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black flex flex-col px-16 pt-16"> 
      <h2 className="text-xl font-semibold text-gray-100 pb-4">240Academy</h2>
      <div className="flex flex-col text-gray-100 pb-4 w-fit">
        <Link href="https://github.com/1oneegame/240-academy">GitHub</Link>
      </div>
      <p className="text-md font-light text-gray-100 pb-4">2025 240Academy</p>
    </footer>
  );
}

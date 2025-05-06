import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    const targetDate = new Date("2025-05-25T04:00:00");
    const interval = setInterval(() => {
      const now = new Date();
      const diff = targetDate - now;
      if (diff <= 0) {
        setCountdown("Wesele już się zakończyło 🎊");
        clearInterval(interval);
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      setCountdown(`Do końca wesela zostało: ${days} dni, ${hours} godz., ${minutes} min.`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-beige text-center flex flex-col items-center justify-center p-6 relative z-10">
      <div id="sparkle-bg"></div>
      <h1 className="text-4xl font-bold text-black mb-2">Wesele HEEEEJ!</h1>
      <h2 className="text-2xl text-black mb-2">#24.05.2025</h2>
      <h3 className="text-2xl text-black mb-2">Sylwia & Patryk</h3>
      <p className="text-gold mb-4">{countdown}</p>

      <img
        src="/bride-groom.png"
        alt="Para młoda"
        className="w-60 h-auto mb-6 rounded-lg shadow-lg"
      />

      <Link href="/upload">
        <button className="mb-3 px-6 py-3 bg-gold text-white rounded hover:scale-105 transition-transform text-lg">
          Dodaj zdjęcia/filmy
        </button>
      </Link>

      <Link href="/gra">
        <button className="px-6 py-3 bg-pink-500 text-white rounded hover:scale-105 transition-transform text-lg">
          Zagraj w grę weselną 🎮
        </button>
      </Link>
    </div>
  );
}

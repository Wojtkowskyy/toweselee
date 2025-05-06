import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Gra() {
  const [name, setName] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('gra-wyniki');
    if (saved) setResults(JSON.parse(saved));
  }, []);

  useEffect(() => {
    let timer;
    if (isPlaying && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (isPlaying && timeLeft === 0) {
      setIsPlaying(false);
      const newResult = { name: name || 'Anonim', score };
      const updated = [...results, newResult]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
      setResults(updated);
      localStorage.setItem('gra-wyniki', JSON.stringify(updated));
    }
    return () => clearTimeout(timer);
  }, [isPlaying, timeLeft]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(10);
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen bg-beige text-center p-6">
      <h1 className="text-3xl font-bold mb-4">🎮 Klikaj ile się da w 10 sekund!</h1>

      <input
        type="text"
        placeholder="Twoje imię"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="p-2 border border-gray-400 rounded mb-4 w-full max-w-xs"
        disabled={isPlaying}
      />

      <div className="mb-4 text-xl">Pozostały czas: {timeLeft}s</div>
      <div className="text-2xl font-bold mb-2">Kliknięcia: {score}</div>

      <button
        onClick={startGame}
        disabled={isPlaying}
        className="mb-4 px-6 py-3 bg-gold text-white rounded text-lg disabled:opacity-50"
      >
        Start
      </button>

      <div
        onClick={() => isPlaying && setScore(score + 1)}
        className={`w-32 h-32 mx-auto rounded-full bg-pink-400 flex items-center justify-center text-white text-xl font-bold select-none ${isPlaying ? 'active:scale-105' : 'opacity-50'}`}
      >
        Klikaj!
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-2">🏆 Top 10 wyników</h2>
      <ul className="max-w-md mx-auto text-left">
        {results.map((res, i) => (
          <li key={i} className="border-b py-1">{i + 1}. {res.name} — {res.score} kliknięć</li>
        ))}
      </ul>

      {/* Przycisk do uploadu zdjęć */}
      <Link href="/upload">
        <button className="mt-6 px-6 py-3 bg-gold text-white rounded hover:scale-105 transition-transform text-lg">
          📸 Prześlij zdjęcia
        </button>
      </Link>
    </div>
  );
}

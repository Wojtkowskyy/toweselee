import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function Upload() {
  const [files, setFiles] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.length) {
      setStatus('Wybierz co najmniej jeden plik.');
      return;
    }

    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('name', name);
    formData.append('message', message);

    setStatus('Wysyłanie...');

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      setStatus('Dziękujemy za przesłanie! 🎉');
      confetti({ particleCount: 120, spread: 80 });
      setFiles([]);
      setName('');
      setMessage('');
    } else {
      setStatus('Wystąpił błąd podczas wysyłania.');
    }
  };

  return (
    <div className="min-h-screen bg-beige flex flex-col items-center justify-center text-center p-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-2 animate-slide-in">Mamy nadzieję, ze Twoja galeria jest pełna zdjęć i filmów!</h1>
   <h2 className="text-2xl font-bold mb-2 animate-slide-in">Pamiętaj, aby przesłać również coś nowego, gdy stworzysz nowe kadry :D!</h2>

      <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4 w-full max-w-md">
        <input
          type="text"
          placeholder="Twoje imię (opcjonalnie)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <textarea
          placeholder="Jak tam melanż? (opcjonalnie)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        ></textarea>
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files))}
          className="w-full"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-gold text-white rounded hover:scale-105 transition-transform"
        >
          Wyślij
        </button>
        {status && <p className="text-sm mt-2">{status}</p>}
      </form>
    </div>
  );
}

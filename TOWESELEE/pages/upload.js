import { useState } from 'react';
import confetti from 'canvas-confetti';

export default function Upload() {
  const [files, setFiles] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [progress, setProgress] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!files.length) {
      setStatus('Wybierz co najmniej jeden plik.');
      return;
    }

    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('name', name);
    formData.append('message', message);

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setProgress(percent);
      }
    });

    xhr.onload = () => {
      if (xhr.status === 200) {
        setStatus('Dziękujemy za przesłanie! 🎉');
        confetti({ particleCount: 120, spread: 80 });
        setFiles([]);
        setName('');
        setMessage('');
        setProgress(0);
      } else {
        const response = JSON.parse(xhr.responseText);
        setStatus(`Błąd: ${response.error || 'Upload failed'}`);
      }
    };

    xhr.onerror = () => {
      setStatus('Wystąpił błąd podczas wysyłania.');
    };

    xhr.open('POST', '/api/upload');
    xhr.send(formData);

    setStatus('Wysyłanie...');
  };
  
  return (
    <div className="min-h-screen bg-beige flex flex-col items-center justify-center text-center p-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-2 animate-slide-in">Mamy nadzieję, ze Twoja galeria jest pełna zdjęć i filmów!</h1>
      <h2 className="text-lg font-light italic text-gray-600 mb-4">
  Pamiętaj, aby przesłać również później coś nowego!
</h2>
  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4 w-full max-w-md">
      <input type="file" multiple onChange={(e) => setFiles([...e.target.files])} />
      <input
        type="text"
        placeholder="Twoje imię i nazwisko"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        placeholder="Wiadomość dla Pary Młodej"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit" className="bg-black text-white px-4 py-2 rounded">Wyślij</button>

      {progress > 0 && (
        <div className="w-full bg-gray-200 rounded h-4">
          <div
            className="bg-green-500 h-4 rounded"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <p>{status}</p>
    </form>
  );
}


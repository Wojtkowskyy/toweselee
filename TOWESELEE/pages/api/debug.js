import { Dropbox } from 'dropbox';

export default async function handler(req, res) {
  const dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN });

  try {
    const response = await dbx.filesListFolder({ path: '' }); // katalog główny aplikacji
    const entries = response?.entries || [];

    const items = entries.map((entry) => ({
      name: entry.name,
      path: entry.path_display,
      type: entry[".tag"]
    }));

    res.status(200).json({ items });
  } catch (err) {
    console.error("BŁĄD TESTU:", err?.error || err);
    res.status(500).json({ error: err?.error_summary || 'Błąd testowania folderu' });
  }
}


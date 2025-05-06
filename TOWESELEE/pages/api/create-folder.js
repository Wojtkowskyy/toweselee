import { Dropbox } from 'dropbox';

export default async function handler(req, res) {
  const dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN });

  try {
    const result = await dbx.filesCreateFolderV2({
      path: '/wesele2025',
      autorename: false,
    });

    res.status(200).json({ success: true, result });
  } catch (err) {
    console.error('BŁĄD TWORZENIA FOLDERU:', JSON.stringify(err, null, 2));
res.status(500).json({ error: 'Błąd tworzenia folderu' });
  }
}

import { Dropbox } from 'dropbox';

export default async function handler(req, res) {
  const dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN });

  try {
    const content = Buffer.from('test');
    const result = await dbx.filesUpload({
      path: '/wesele2025/upload-test.txt',
      contents: content,
      mode: 'add',
    });

    res.status(200).json({ success: true, file: result });
  } catch (err) {
    console.error('UPLOAD TEST ERROR:', JSON.stringify(err, null, 2));
    res.status(500).json({ error: 'Błąd uploadu testowego pliku' });
  }
}



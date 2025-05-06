import nextConnect from 'next-connect';
import multer from 'multer';
import { Dropbox } from 'dropbox';

const upload = multer({ storage: multer.memoryStorage() });
const apiRoute = nextConnect();

apiRoute.use(upload.array('files'));

apiRoute.post(async (req, res) => {
  const dbx = new Dropbox({ accessToken: process.env.DROPBOX_TOKEN });

  const namePrefix = req.body.name
    ? req.body.name.trim().replace(/[^a-zA-Z0-9-_]/g, '_') + '_'
    : '';
  const folder = '/wesele2025';
  const messageFolder = '/wesele2025_melanze';
  const message = req.body.message;

  try {
    // Upload zdjęć i filmów
    if (req.files.length > 0) {
      await Promise.all(req.files.map(async (file) => {
        const dropboxPath = `${folder}/${namePrefix}${file.originalname}`;
        await dbx.filesUpload({
          path: dropboxPath,
          contents: file.buffer,
          mode: 'add',
          autorename: true,
        });
      }));
    }

    // Upload wiadomości melanżowej jako plik tekstowy do osobnego folderu
    if (message && message.trim() !== '') {
      const messageContent = `${message.trim()}\n`;
      const messageName = `${namePrefix}melanz.txt`;
      const messagePath = `${messageFolder}/${messageName}`;

      await dbx.filesUpload({
        path: messagePath,
        contents: messageContent,
        mode: 'add',
        autorename: true,
      });
    }

    res.status(200).json({ message: 'Files uploaded' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apiRoute;

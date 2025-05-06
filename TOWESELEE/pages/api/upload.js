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

  const CHUNK_SIZE = 8 * 1024 * 1024; // 8 MB

  try {
    console.log('FILES:', req.files?.map(f => ({
      originalname: f.originalname,
      mimetype: f.mimetype,
      size: f.buffer.length
    })));

    if (req.files.length > 0) {
      await Promise.all(req.files.map(async (file) => {
        const dropboxPath = `${folder}/${namePrefix}${file.originalname}`;
        const buffer = file.buffer;
        const fileSize = buffer.length;

        if (fileSize <= 150 * 1024 * 1024) {
          // Mały plik — standardowy upload
          await dbx.filesUpload({
            path: dropboxPath,
            contents: buffer,
            mode: 'add',
            autorename: true,
          });
        } else {
          // Duży plik — sesyjny upload
          const sessionStart = await dbx.filesUploadSessionStart({
            close: false,
            contents: buffer.slice(0, CHUNK_SIZE),
          });

          let cursor = {
            session_id: sessionStart.result.session_id,
            offset: CHUNK_SIZE,
          };

          while (cursor.offset < fileSize) {
            const chunk = buffer.slice(cursor.offset, cursor.offset + CHUNK_SIZE);

            if ((cursor.offset + CHUNK_SIZE) >= fileSize) {
              await dbx.filesUploadSessionFinish({
                cursor,
                commit: {
                  path: dropboxPath,
                  mode: { '.tag': 'add' },
                  autorename: true,
                },
                contents: chunk,
              });
            } else {
              await dbx.filesUploadSessionAppendV2({
                cursor,
                close: false,
                contents: chunk,
              });
              cursor.offset += CHUNK_SIZE;
            }
          }
        }
      }));
    }

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
    console.error('UPLOAD ERROR:', err);
    res.status(500).json({ error: err.message || 'Upload failed' });
  }
});

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default apiRoute;

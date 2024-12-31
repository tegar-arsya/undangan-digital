import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import fs from 'fs';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = './public/uploads/photo-weddings';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const userId = await verifyToken(token);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.method === 'POST') {
      const form = formidable({
        uploadDir,
        keepExtensions: true,
        maxFileSize: 10 * 1024 * 1024, // 10 MB
        multiples: true, // Allow multiple file uploads
        filename: (originalName, originalExt, part) => {
          return `${Date.now()}_${part.originalFilename}`;
        },
      });

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error('Formidable Error:', err);
          return res.status(500).json({ message: 'Error parsing file upload' });
        }

        const weddingId = Array.isArray(fields.weddingId)
          ? fields.weddingId[0]
          : fields.weddingId;

        const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
        const photoUrls = Array.isArray(files.photoUrl) ? files.photoUrl : [files.photoUrl];

        if (!weddingId || !name || photoUrls.length === 0) {
          return res.status(400).json({ message: 'Invalid input' });
        }

        try {
          const wedding = await prisma.wedding.findFirst({
            where: {
              id: weddingId,
              userId,
            },
          });

          if (!wedding) {
            return res.status(403).json({ message: 'Not authorized to add background to this wedding' });
          }

          const newPhotoWeddings = await Promise.all(
            photoUrls.map(async (photoFile: File) => {
              const relativePath = photoFile?.filepath?.split('public')?.[1]?.replace(/\\/g, '/').replace(/^\/+/, '');
              const urlPath = `/${relativePath}`;

              return prisma.weddingPhoto.create({
                data: {
                  weddingId,
                  name: name ?? '', 
                  photoUrl: urlPath,
                },
              });
            })
          );

          res.status(201).json(newPhotoWeddings);
        } catch (error) {
          console.error('Prisma Error:', error);
          res.status(500).json({ message: 'Internal server error' });
        }
      });
    } else if (req.method === 'GET') {
      const { weddingId } = req.query;
      if (!weddingId || typeof weddingId !== 'string') {
        return res.status(400).json({ message: 'Invalid weddingId' });
      }
      const photoUrls = await prisma.weddingPhoto.findMany({
        where: { weddingId }, // Filter berdasarkan weddingId
      select: {
        id: true,
        photoUrl: true,
      },
      orderBy: { createdAt: 'desc' },
    });

      res.status(200).json(photoUrls);
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Token Verification Error:', error);
    res.status(401).json({ message: 'Unauthorized' });
  }
}

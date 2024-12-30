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

const uploadDir = './public/uploads/background';

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

        const names = Array.isArray(fields.name) ? fields.name : [fields.name];
        const gambars = Array.isArray(files.gambar) ? files.gambar : [files.gambar];

        if (!weddingId || names.length === 0 || gambars.length === 0) {
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

          const newBackgrounds = await Promise.all(
            names.map(async (name, index) => {
              const gambar = gambars[index] as File;
              const relativePath = gambar?.filepath?.split('public')?.[1]?.replace(/\\/g, '/').replace(/^\/+/, '');
              const urlPath = `/${relativePath}`;

              return prisma.background.create({
                data: {
                  weddingId,
                  name,
                  gambar: urlPath,
                },
              });
            })
          );

          res.status(201).json(newBackgrounds);
        } catch (error) {
          console.error('Prisma Error:', error);
          res.status(500).json({ message: 'Internal server error' });
        }
      });
    } else if (req.method === 'GET') {
      const backgrounds = await prisma.background.findMany({
        where: {
          wedding: {
            userId,
          },
        },
        include: {
          wedding: {
            select: {
              brideName: true,
              groomName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      res.status(200).json(backgrounds);
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Token Verification Error:', error);
    res.status(401).json({ message: 'Unauthorized' });
  }
}


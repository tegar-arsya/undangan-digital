
import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
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

    const { id } = req.query;

    if (req.method === 'GET') {
      try {
        const Weddingphoto = await prisma.weddingPhoto.findUnique({
          where: { id: id as string },
          include: { wedding: true },
        });

        if (!Weddingphoto || Weddingphoto.wedding.userId !== userId) {
          return res.status(404).json({ message: 'Background not found' });
        }

        res.status(200).json(Weddingphoto);
      } catch (error) {
        console.error('Prisma Error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else if (req.method === 'PUT') {
      const form = formidable({
        uploadDir,
        keepExtensions: true,
        maxFileSize: 10 * 1024 * 1024, // 10 MB
        filename: (originalName, originalExt, part) => {
          return `${Date.now()}_${part.originalFilename}`;
        },
      });

      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error('Formidable Error:', err);
          return res.status(500).json({ message: 'Error parsing file upload' });
        }

        const name = fields.name as string;
        const photoUrl = files.photoUrl as formidable.File;

        try {
          const Weddingphoto = await prisma.weddingPhoto.findUnique({
            where: { id: id as string },
            include: { wedding: true },
          });

          if (!Weddingphoto || Weddingphoto.wedding.userId !== userId) {
            return res.status(403).json({ message: 'Not authorized to edit this background' });
          }

          const updateData: any = { name };

          if (photoUrl) {
            const relativePath = photoUrl.filepath.split('public')[1].replace(/\\/g, '/').replace(/^\/+/, '');
            const urlPath = `/${relativePath}`;
            updateData.photoUrl = urlPath;

            // Delete old image
            if (Weddingphoto.photoUrl) {
              const oldPath = `./public${Weddingphoto.photoUrl}`;
              fs.unlink(oldPath, (err) => {
                if (err) console.error('Error deleting old file:', err);
              });
            }
          }

          const updatedWeddingphoto = await prisma.weddingPhoto.update({
            where: { id: id as string },
            data: updateData,
          });

          res.status(200).json(updatedWeddingphoto);
        } catch (error) {
          console.error('Prisma Error:', error);
          res.status(500).json({ message: 'Internal server error' });
        }
      });
    } else if (req.method === 'DELETE') {
      try {
        const Weddingphoto = await prisma.weddingPhoto.findUnique({
          where: { id: id as string },
          include: { wedding: true },
        });

        if (!Weddingphoto || Weddingphoto.wedding.userId !== userId) {
          return res.status(403).json({ message: 'Not authorized to delete this background' });
        }

        // Delete the image file
        if (Weddingphoto.photoUrl) {
          const filePath = `./public${Weddingphoto.photoUrl}`;
          fs.unlink(filePath, (err) => {
            if (err) console.error('Error deleting file:', err);
          });
        }

        await prisma.weddingPhoto.delete({
          where: { id: id as string },
        });

        res.status(204).end();
      } catch (error) {
        console.error('Prisma Error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Token Verification Error:', error);
    res.status(401).json({ message: 'Unauthorized' });
  }
}


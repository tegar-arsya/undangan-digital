import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { weddingId, guestSlug, attendance, komentar } = req.body;

  if (!weddingId || !guestSlug || !attendance) {
    return res.status(400).json({ error: 'Required fields are missing' });
  }

  try {
    // First, find the guest to get their name
    const guest = await prisma.guest.findFirst({
      where: {
        weddingId: weddingId,
        slug: guestSlug,
      },
    });

    if (!guest) {
      return res.status(404).json({ error: 'Guest not found' });
    }

    // Check if RSVP already exists
    const existingRSVP = await prisma.rSVP.findUnique({
      where: {
        guestId: guest.id,
      },
    });

    if (existingRSVP) {
      // Update existing RSVP
      const updatedRSVP = await prisma.rSVP.update({
        where: {
          guestId: guest.id,
        },
        data: {
          attendance,
          komentar: komentar || '',
        },
      });
      return res.status(200).json(updatedRSVP);
    }

    // Create new RSVP
    const rsvp = await prisma.rSVP.create({
      data: {
        weddingId,
        guestId: guest.id,
        name: guest.name, // Use the guest's name
        attendance,
        komentar: komentar || '',
      },
    });

    res.status(201).json(rsvp);
  } catch (error) {
    console.error('Error handling RSVP:', error);
    res.status(500).json({ error: 'Failed to process RSVP' });
  }
}
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.token
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const userId = await verifyToken(token)
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const { id } = req.query

    if (req.method === 'GET') {
      try {
        const guests = await prisma.guest.findMany({
          where: {
            wedding: {
              userId: userId
            }
          },
          include: {
            wedding: {
              select: {
                brideName: true,
                groomName: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        })

        if (!guests) {
          return res.status(404).json({ message: 'guests not found' })
        }

        res.status(200).json(guests)
      } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
      }
    }
    else if (req.method === 'PUT') {
      const { weddingId, name, email, slug } = req.body

      // Validasi input
      if (!weddingId || !name || !email || !slug) {
        return res.status(400).json({ message: 'All fields are required' })
      }

      try {
        // Validasi wedding terkait user
        const wedding = await prisma.wedding.findFirst({
          where: {
            id: weddingId,
            userId: userId,
          },
        })

        if (!wedding) {
          return res.status(404).json({ message: 'Wedding not found' })
        }

        // Validasi guest
        const guest = await prisma.guest.findFirst({
          where: {
            id: id as string,
          },
        })
        if (!guest) {
          return res.status(404).json({ message: 'Guest not found' })
        }

        // Update guest
        const updatedGuest = await prisma.guest.update({
          where: { id: id as string },
          data: {
            weddingId,
            name,
            email,
            slug,
          },
        })
        res.status(200).json(updatedGuest)
      } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
      }
    } 
    else if (req.method === 'DELETE') {
      try {
        // Validasi guest
        const guest = await prisma.guest.findFirst({
          where: {
            id: id as string,
          },
        })
        if (!guest) {
          return res.status(404).json({ message: 'Guest not found' })
        }

        // Hapus guest
        await prisma.guest.delete({
          where: { id: id as string },
        })
        res.status(200).json({ message: 'Guest deleted successfully' })
      } catch (error) {
        console.error('Error deleting guest:', error)
        res.status(500).json({ message: 'Internal server error' })
      }
    }
    else {
      res.status(405).json({ message: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Token verification error:', error)
    res.status(401).json({ message: 'Unauthorized' })
  }
}
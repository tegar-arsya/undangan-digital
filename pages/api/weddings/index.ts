import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verify the JWT token
  const token = req.cookies.token
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const userId = await verifyToken(token)
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    if (req.method === 'GET') {
      try {
        const weddings = await prisma.wedding.findMany({
          where: { userId: userId },
          orderBy: { createdAt: 'desc' },
        })
        res.status(200).json(weddings)
      } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
      }
    } else if (req.method === 'POST') {
      const { brideName, groomName, date, time, location, slug } = req.body

      try {
        const newWedding = await prisma.wedding.create({
          data: {
            userId,
            brideName,
            groomName,
            date,
            time,
            location,
            slug,
          },
        })
        res.status(201).json(newWedding)
      } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Token verification error:', error)
    res.status(401).json({ message: 'Unauthorized' })
  }
}


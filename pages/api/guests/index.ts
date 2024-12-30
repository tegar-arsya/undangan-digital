// pages/api/guests/index.ts
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

    if (req.method === 'GET') {
      try {
        // Get all guests for weddings owned by the user
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
        res.status(200).json(guests)
      } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
      }
    } else if (req.method === 'POST') {
      const { weddingId, name, email, slug } = req.body

      try {
        // Verify that the wedding belongs to the user
        const wedding = await prisma.wedding.findFirst({
          where: {
            id: weddingId,
            userId: userId
          }
        })

        if (!wedding) {
          return res.status(403).json({ message: 'Not authorized to add guests to this wedding' })
        }

        const newGuest = await prisma.guest.create({
          data: {
            weddingId,
            name,
            email,
            slug,
          }
        })
        res.status(201).json(newGuest)
      } catch (error: unknown) {
        console.error(error)
        if ((error as { code: string }).code === 'P2002') {
          res.status(400).json({ message: 'A guest with this slug already exists for this wedding' })
        } else {
          res.status(500).json({ message: 'Internal server error' })
        }
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Token verification error:', error)
    res.status(401).json({ message: 'Unauthorized' })
  }
}
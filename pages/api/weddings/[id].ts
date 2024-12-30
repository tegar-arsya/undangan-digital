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
        const wedding = await prisma.wedding.findFirst({
          where: { 
            id: id as string,
            userId: userId
          },
        })
        
        if (!wedding) {
          return res.status(404).json({ message: 'Wedding not found' })
        }
        
        res.status(200).json(wedding)
      } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
      }
    } 
    else if (req.method === 'PUT') {
      const { brideName, groomName, date, time, location, slug } = req.body

      try {
        const wedding = await prisma.wedding.findFirst({
          where: { 
            id: id as string,
            userId: userId
          },
        })

        if (!wedding) {
          return res.status(404).json({ message: 'Wedding not found' })
        }

        const updatedWedding = await prisma.wedding.update({
          where: { id: id as string },
          data: {
            brideName,
            groomName,
            date,
            time,
            location,
            slug,
          },
        })
        res.status(200).json(updatedWedding)
      } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
      }
    }
    else if (req.method === 'DELETE') {
      try {
        const wedding = await prisma.wedding.findFirst({
          where: { 
            id: id as string,
            userId: userId
          },
        })

        if (!wedding) {
          return res.status(404).json({ message: 'Wedding not found' })
        }

        await prisma.wedding.delete({
          where: { id: id as string },
        })
        res.status(200).json({ message: 'Wedding deleted successfully' })
      } catch (error) {
        console.error('Error deleting wedding:', error)
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


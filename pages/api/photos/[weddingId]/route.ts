// app/api/photos/[weddingId]/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { weddingId: string } }
) {
  try {
    const photos = await prisma.weddingPhoto.findMany({
      where: {
        weddingId: params.weddingId,
      },
      select: {
        id: true,
        photoUrl: true,
      },
    })

    return NextResponse.json(photos)
  } catch (error) {
    console.error('Error fetching photos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch photos' },
      { status: 500 }
    )
  }
}
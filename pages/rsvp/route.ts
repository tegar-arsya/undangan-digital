// app/api/rsvp/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { weddingId, name, attendance } = await request.json()

    // Create a slug from the guest name
    const slug = name.toLowerCase().replace(/\s+/g, '-')

    // First, create or find the guest
    const guest = await prisma.guest.upsert({
      where: {
        weddingId_slug: {
          weddingId,
          slug,
        },
      },
      update: {},
      create: {
        weddingId,
        name,
        slug,
      },
    })

    // Then, create or update the RSVP
    const rsvp = await prisma.rSVP.upsert({
      where: {
        guestId: guest.id,
      },
      update: {
        attendance,
      },
      create: {
        weddingId,
        guestId: guest.id,
        attendance,
      },
    })

    return NextResponse.json(rsvp)
  } catch (error) {
    console.error('Error creating RSVP:', error)
    return NextResponse.json(
      { error: 'Failed to create RSVP' },
      { status: 500 }
    )
  }
}
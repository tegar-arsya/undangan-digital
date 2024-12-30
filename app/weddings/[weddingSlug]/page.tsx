// app/weddings/[slug]/page.tsx
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import InvitationDetails from '@/components/InvitationDetails'
import RSVPForm from '@/components/RSVPForm'
import PhotoGallery from '@/components/PhotoGallery'
import CountdownTimer from '@/components/CountdownTimer'
import { Wedding } from '@/types/wedding'

export default async function WeddingPage({ params }: { params: { weddingSlug: string } }) {
  const weddingData = await prisma.wedding.findUnique({
    where: { slug: params.weddingSlug },
    select: {
      id: true,
      brideName: true,
      groomName: true,
      date: true,
      time: true,
      location: true,
      slug: true,
    },
  }) as Wedding | null

  if (!weddingData) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        {weddingData.brideName} & {weddingData.groomName}
      </h1>
      <InvitationDetails weddingData={weddingData} />
      <CountdownTimer weddingDate={weddingData.date} />
      <RSVPForm weddingId={weddingData.id} />
      <PhotoGallery weddingId={weddingData.id} />
    </div>
  )
}

// Optionally, you can add generateStaticParams if you want to statically generate pages
export async function generateStaticParams() {
  const weddings = await prisma.wedding.findMany({
    select: {
      slug: true,
    },
  })

  return weddings.map((wedding) => ({
    slug: wedding.slug,
  }))
}
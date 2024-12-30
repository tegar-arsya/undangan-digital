import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import InvitationDetails from '@/components/InvitationDetails'
// import RSVPForm from '@/components/RSVPForm'
import PhotoGallery from '@/components/PhotoGallery'
import CountdownTimer from '@/components/CountdownTimer'

export default async function GuestPage({ params }: { params: { weddingSlug: string, guestSlug: string } }) {
  const { weddingSlug, guestSlug } = params

  // Fetch wedding data by slug
  const weddingData = await prisma.wedding.findUnique({
    where: { slug: weddingSlug },
  })

  if (!weddingData) {
    notFound()
  }

  // Fetch guest data associated with the wedding
  const guestData = await prisma.guest.findFirst({
    where: {
      weddingId: weddingData.id,
      slug: guestSlug,
    },
  })

  if (!guestData) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        {weddingData.brideName} & {weddingData.groomName}
      </h1>
      <p className="text-2xl text-center mb-8">
        Dear {guestData.name}, you are cordially invited to our wedding celebration!
      </p>
      <InvitationDetails weddingData={weddingData} />
      <CountdownTimer weddingDate={weddingData.date} />
      <PhotoGallery weddingId={weddingData.id} />
    </div>
  )
}

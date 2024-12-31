import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import InvitationDetails from '@/components/InvitationDetails'
import RSVPForm from '@/components/RSVPForm'
import PhotoGallery from '@/components/PhotoGallery'
import CountdownTimer from '@/components/CountdownTimer'
import { RSVPSummaryTable } from '@/components/rsvp/RSVPSummaryTable'
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
      rsvps: {
        orderBy: {
          createdAt: 'desc'
        }
      }
    },
  }) as (Wedding & { rsvps: any[] }) | null

  if (!weddingData) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        {weddingData.brideName} & {weddingData.groomName}
      </h1>
      <InvitationDetails weddingData={weddingData} />
      <CountdownTimer weddingDate={weddingData.date} />
      <RSVPSummaryTable rsvps={weddingData.rsvps} />
      <PhotoGallery weddingId={weddingData.id} />
    </div>
  );
}
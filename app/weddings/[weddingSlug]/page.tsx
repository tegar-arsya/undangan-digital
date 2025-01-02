import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import InvitationDetails from '@/components/InvitationDetails'
import { WeddingHeader } from '@/components/weddings/clientHeader';
import PhotoGallery from '@/components/PhotoGallery'
import CountdownTimer from '@/components/CountdownTimer'
import { RSVPSummaryTable } from '@/components/rsvp/RSVPSummaryTable'
import { Wedding } from '@/types/wedding'
import { RSVP } from '@/types/rsvp'
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
  }) as (Wedding & { rsvps: RSVP[] }) | null

  if (!weddingData) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-rose-50">
      <WeddingHeader
        brideName={weddingData.brideName}
        groomName={weddingData.groomName}
        weddingId={weddingData.id}
      />
      <div className="container mx-auto px-4 py-12 space-y-12 -mt-12 relative z-20">
        <div className="grid gap-8 max-w-4xl mx-auto">
          <InvitationDetails weddingData={weddingData} />
          <CountdownTimer weddingDate={weddingData.date} />
          <PhotoGallery weddingId={weddingData.id} />
          <RSVPSummaryTable rsvps={weddingData.rsvps} />
        </div>
      </div>


    </div>
  );
}
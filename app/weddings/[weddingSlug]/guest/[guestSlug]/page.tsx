import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import InvitationDetails from '@/components/InvitationDetails'
import CountdownTimer from '@/components/CountdownTimer'
import RSVPForm from '@/components/RSVPForm'
import { RSVPSummaryTable } from '@/components/rsvp/RSVPSummaryTable'

export default async function GuestPage({ params }: { params: { weddingSlug: string, guestSlug: string } }) {
  const { weddingSlug, guestSlug } = params

  // Fetch wedding data with RSVPs
  const weddingData = await prisma.wedding.findUnique({
    where: { slug: weddingSlug },
    include: {
      rsvps: {
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
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
    include: {
      rsvp: true,
    },
  })

  if (!guestData) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-rose-50">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-800">
            {weddingData.brideName} & {weddingData.groomName}
          </h1>
          <p className="text-2xl text-gray-600 font-light">
            Dear <span className="font-medium text-rose-600">{guestData.name}</span>,
            <br />you are cordially invited to our wedding celebration!
          </p>
        </div>

        <div className="grid gap-8 max-w-4xl mx-auto">
          <InvitationDetails weddingData={weddingData} />
          <CountdownTimer weddingDate={weddingData.date} />
          
          {!guestData.rsvp && (
            <RSVPForm 
              weddingId={weddingData.id} 
              guestSlug={guestSlug}
            />
          )}

          {guestData.rsvp && (
            <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <p className="text-emerald-800">
                Thank you for your RSVP! Your response has been recorded.
              </p>
            </div>
          )}

          <RSVPSummaryTable rsvps={weddingData.rsvps} />
        </div>
      </div>
    </div>
  )
}
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { WeddingHeader } from '@/components/weddings/WeddingHeader';
import InvitationDetails from '@/components/InvitationDetails';
import CountdownTimer from '@/components/CountdownTimer';
import RSVPForm from '@/components/RSVPForm';
import { RSVPSummaryTable } from '@/components/rsvp/RSVPSummaryTable';
import PhotoGallery from '@/components/PhotoGallery';

export default async function GuestPage({ params }: { params: { weddingSlug: string, guestSlug: string } }) {
  const { weddingSlug, guestSlug } = params;

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
  });

  if (!weddingData) {
    notFound();
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
  });

  if (!guestData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-rose-50">
      <WeddingHeader 
        brideName={weddingData.brideName}
        groomName={weddingData.groomName}
        guestName={guestData.name}
        weddingId={weddingData.id}
      />

      <div className="container mx-auto px-4 py-12 space-y-12 -mt-12 relative z-20">
        <div className="grid gap-8 max-w-4xl mx-auto">
          <InvitationDetails weddingData={weddingData} />
          <CountdownTimer weddingDate={weddingData.date} />
          <PhotoGallery weddingId={weddingData.id} />
          
          {!guestData.rsvp && (
            <RSVPForm 
              weddingId={weddingData.id} 
              guestSlug={guestSlug}
            />
          )}

          {guestData.rsvp && (
            <div className="text-center p-6 bg-emerald-50 rounded-lg border border-emerald-200">
              <p className="text-emerald-800 text-lg">
                Terima kasih atas konfirmasi kehadiran Anda!
              </p>
            </div>
          )}

          <RSVPSummaryTable rsvps={weddingData.rsvps} />
        </div>
      </div>
    </div>
  );
}
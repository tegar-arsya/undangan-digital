// components/InvitationDetails.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Wedding } from '@/types/wedding'

export default function InvitationDetails({ weddingData }: { weddingData: Wedding }) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Wedding Details</CardTitle>
      </CardHeader>
      <CardContent>
        <p><strong>Date:</strong> {new Date(weddingData.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> {weddingData.time}</p>
        <p><strong>Location:</strong> {weddingData.location}</p>
        <div className="mt-4">
          {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
            <iframe
              width="100%"
              height="300"
              frameBorder="0"
              src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(weddingData.location)}`}
              allowFullScreen
            />
          ) : (
            <p className="text-yellow-600">Please configure Google Maps API key in environment variables.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
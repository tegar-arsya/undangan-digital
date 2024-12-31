import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wedding } from '@/types/wedding';
import { MapPin, Clock, Calendar } from 'lucide-react';

export default function InvitationDetails({ weddingData }: { weddingData: Wedding }) {
  return (
    <Card className="relative overflow-hidden border-none shadow-xl bg-white">
      {/* Batik Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url('/batik-pattern.png')`,
          backgroundSize: '200px',
          backgroundRepeat: 'repeat',
        }}
      />
      
      <CardHeader className="relative z-10 bg-gradient-to-r from-amber-50 to-rose-50 border-b border-amber-100">
        <CardTitle className="text-2xl font-serif text-center text-amber-900">
          Wedding Details
        </CardTitle>
      </CardHeader>

      <CardContent className="relative z-10 p-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="flex flex-col items-center p-4 rounded-lg bg-amber-50 border border-amber-100">
            <Calendar className="w-8 h-8 text-amber-700 mb-2" />
            <h3 className="font-medium text-amber-900">Date</h3>
            <p className="text-center text-amber-800">
              {new Date(weddingData.date).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          <div className="flex flex-col items-center p-4 rounded-lg bg-rose-50 border border-rose-100">
            <Clock className="w-8 h-8 text-rose-700 mb-2" />
            <h3 className="font-medium text-rose-900">Time</h3>
            <p className="text-center text-rose-800">{weddingData.time} WIB</p>
          </div>

          <div className="flex flex-col items-center p-4 rounded-lg bg-amber-50 border border-amber-100">
            <MapPin className="w-8 h-8 text-amber-700 mb-2" />
            <h3 className="font-medium text-amber-900">Venue</h3>
            <p className="text-center text-amber-800">{weddingData.location}</p>
          </div>
        </div>

        <div className="mt-6">
          {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
            <div className="rounded-lg overflow-hidden border-4 border-amber-100 shadow-lg">
              <iframe
                width="100%"
                height="300"
                frameBorder="0"
                src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(weddingData.location)}`}
                allowFullScreen
              />
            </div>
          ) : (
            <p className="text-amber-600 text-center p-4 bg-amber-50 rounded-lg">
              Please configure Google Maps API key in environment variables.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
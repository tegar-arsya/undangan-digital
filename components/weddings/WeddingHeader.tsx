import { Wedding } from '@/types/wedding';

interface WeddingHeaderProps {
  wedding: Wedding;
  guestName?: string;
}

export function WeddingHeader({ wedding, guestName }: WeddingHeaderProps) {
  return (
    <div className="text-center space-y-4">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 font-serif">
        {wedding.brideName} & {wedding.groomName}
      </h1>
      {guestName && (
        <p className="text-xl md:text-2xl text-gray-600 font-light">
          Dear <span className="font-medium text-rose-600">{guestName}</span>,
          <br />
          you are cordially invited to our wedding celebration!
        </p>
      )}
    </div>
  );
}
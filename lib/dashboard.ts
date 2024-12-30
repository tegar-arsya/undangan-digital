import prisma from '@/lib/prisma';

export interface DashboardStats {
  weddingsCount: number;
  guestsCount: number;
  rsvpCount: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const weddingsCount = await prisma.wedding.count();
  const guestsCount = await prisma.guest.count();
  const rsvpCount = await prisma.rSVP.count();

  return {
    weddingsCount,
    guestsCount,
    rsvpCount,
  };
}
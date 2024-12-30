import { Calendar, Users, CheckSquare } from 'lucide-react';
import { getDashboardStats } from '@/lib/dashboard';
import { StatCard } from '@/components/dashboard/stat-card';

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
        <p className="text-gray-600 mt-2">Heres whats happening with your weddings today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Weddings"
          value={stats.weddingsCount}
          icon={<Calendar className="size-4" />}
          description="Active wedding events"
          trend={{ value: 12, isPositive: true }}
          className="bg-gradient-to-br from-rose-50 to-pink-50"
        />
        
        <StatCard
          title="Total Guests"
          value={stats.guestsCount}
          icon={<Users className="size-4" />}
          description="Invited guests across all events"
          trend={{ value: 8, isPositive: true }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50"
        />
        
        <StatCard
          title="Total RSVPs"
          value={stats.rsvpCount}
          icon={<CheckSquare className="size-4" />}
          description="Confirmed attendances"
          trend={{ value: 5, isPositive: true }}
          className="bg-gradient-to-br from-green-50 to-emerald-50"
        />
      </div>
    </div>
  );
}
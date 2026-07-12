import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BedDouble, Users, CalendarDays, Clock, CheckCircle2, XCircle, ClipboardList, LayoutDashboard } from 'lucide-react';
import api from '../../api/axios.js';

const StatCard = ({ icon: Icon, label, value, colorClass, iconColor }) => (
  <div className={`bg-white rounded-2xl p-6 shadow-md flex items-center gap-4 border-l-4 ${colorClass}`}>
    <div className={`p-3 rounded-xl ${iconColor}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-stone-500 text-sm font-medium">{label}</p>
      <p className="text-3xl font-bold text-stone-800">{value ?? '—'}</p>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/api/admin/stats');
        setStats(data);
      } catch {
        setError('Failed to load stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-800">Admin Dashboard</h1>
          <p className="text-stone-500 mt-1">Overview of Casa de Matilda operations.</p>
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6">{error}</div>
        )}

        {stats && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              <StatCard icon={BedDouble} label="Total Rooms" value={stats.totalRooms} colorClass="border-teal-500" iconColor="bg-teal-100 text-teal-600" />
              <StatCard icon={Users} label="Total Users" value={stats.totalUsers} colorClass="border-stone-400" iconColor="bg-stone-100 text-stone-600" />
              <StatCard icon={CalendarDays} label="Total Reservations" value={stats.totalReservations} colorClass="border-amber-500" iconColor="bg-amber-100 text-amber-600" />
              <StatCard icon={Clock} label="Pending" value={stats.pendingReservations} colorClass="border-amber-400" iconColor="bg-amber-100 text-amber-500" />
              <StatCard icon={CheckCircle2} label="Confirmed" value={stats.confirmedReservations} colorClass="border-teal-400" iconColor="bg-teal-100 text-teal-500" />
              <StatCard icon={XCircle} label="Cancelled" value={stats.cancelledReservations} colorClass="border-red-400" iconColor="bg-red-100 text-red-500" />
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Link
                to="/admin/rooms"
                className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow flex items-center gap-4 group"
              >
                <div className="bg-teal-100 text-teal-700 w-14 h-14 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform">
                  <BedDouble className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-800 text-lg">Manage Rooms</h3>
                  <p className="text-stone-500 text-sm">Add, edit, or remove rooms</p>
                </div>
              </Link>

              <Link
                to="/admin/reservations"
                className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow flex items-center gap-4 group"
              >
                <div className="bg-amber-100 text-amber-700 w-14 h-14 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform">
                  <ClipboardList className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-800 text-lg">Manage Reservations</h3>
                  <p className="text-stone-500 text-sm">View and update booking statuses</p>
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

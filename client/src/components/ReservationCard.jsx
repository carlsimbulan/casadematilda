import { format } from 'date-fns';
import { Home, CalendarDays, Users, FileText, Clock, CheckCircle2, XCircle, History } from 'lucide-react';
import { isUpcoming } from '../utils/reservationFilters.js';

const STATUS_CONFIG = {
  pending: {
    label: 'Pending Confirmation',
    icon: Clock,
    badge: 'bg-amber-100 text-amber-700 border border-amber-200',
    bar: 'bg-amber-400',
  },
  confirmed: {
    label: 'Confirmed',
    icon: CheckCircle2,
    badge: 'bg-teal-100 text-teal-700 border border-teal-200',
    bar: 'bg-teal-500',
  },
  cancelled: {
    label: 'Cancelled',
    icon: XCircle,
    badge: 'bg-stone-100 text-stone-500 border border-stone-200',
    bar: 'bg-stone-300',
  },
};

export default function ReservationCard({ res, onCancel, cancellingId, showHistoryBadge = false }) {
  const statusKey = res.status || 'pending';
  const config = STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending;
  const StatusIcon = config.icon;

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      <div className={`h-1.5 w-full ${config.bar}`} />

      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <h2 className="text-xl font-bold text-stone-800">Casa de Matilda</h2>
          <div className="flex items-center gap-2 flex-wrap">
            {showHistoryBadge && (
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                <History className="w-4 h-4" />
                Past Stay
              </span>
            )}
            <span className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full ${config.badge}`}>
              <StatusIcon className="w-4 h-4" />
              {config.label}
            </span>
          </div>
        </div>

        <p className="text-stone-400 text-xs mb-4">
          Entire property · 2 rooms · Pool · All amenities
        </p>

        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex gap-4 flex-grow">
            <div className="flex-shrink-0 w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center">
              <Home className="w-6 h-6 text-amber-600" />
            </div>

            <div className="text-stone-500 text-sm space-y-1.5">
              <p className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 flex-shrink-0 text-stone-400" />
                <span className="font-semibold text-stone-700">
                  {format(new Date(res.checkIn), 'MMM d, yyyy')}
                </span>
                <span className="text-stone-400">→</span>
                <span className="font-semibold text-stone-700">
                  {format(new Date(res.checkOut), 'MMM d, yyyy')}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Users className="w-4 h-4 flex-shrink-0 text-stone-400" />
                {res.guests} guest{res.guests !== 1 ? 's' : ''}
              </p>
              {res.specialRequests && (
                <p className="flex items-center gap-2">
                  <FileText className="w-4 h-4 flex-shrink-0 text-stone-400" />
                  {res.specialRequests}
                </p>
              )}
              <p className="text-stone-400 text-xs">
                Booked {format(new Date(res.createdAt), 'MMM d, yyyy')}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3 sm:gap-2">
            <div className="font-bold text-amber-600 text-xl">
              ₱{res.totalPrice?.toLocaleString()}
            </div>
            {onCancel && isUpcoming(res) && statusKey === 'pending' && (
              <button
                onClick={() => onCancel(res._id)}
                disabled={cancellingId === res._id}
                className="border border-red-300 text-red-500 hover:bg-red-50 disabled:opacity-50 font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
              >
                {cancellingId === res._id ? 'Cancelling...' : 'Cancel'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, differenceInCalendarDays } from 'date-fns';
import { Waves, BedDouble, UtensilsCrossed, Wifi, Wind, Music, TreePine, ShowerHead, Tv, Car, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios.js';

const AMENITIES = [
  { icon: Waves, label: 'Swimming Pool' },
  { icon: BedDouble, label: '2 Private Rooms' },
  { icon: UtensilsCrossed, label: 'Full Kitchen' },
  { icon: Wifi, label: 'WiFi' },
  { icon: Wind, label: 'Air Conditioning' },
  { icon: Music, label: 'Sound System' },
  { icon: TreePine, label: 'Garden Area' },
  { icon: ShowerHead, label: 'Hot Shower' },
  { icon: Tv, label: 'Smart TV' },
  { icon: Car, label: 'Private Parking' },
];

export default function BookingPage() {
  const navigate = useNavigate();

  const [nightlyRate, setNightlyRate] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [isAvailable, setIsAvailable] = useState(null);

  const today = format(new Date(), 'yyyy-MM-dd');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');

  // Fetch nightly rate from the API on mount
  useEffect(() => {
    api.get('/api/settings/pricing')
      .then(({ data }) => setNightlyRate(data.nightlyRate))
      .catch(() => setNightlyRate(5000)); // fallback
  }, []);

  const nights =
    checkIn && checkOut
      ? Math.max(0, differenceInCalendarDays(new Date(checkOut), new Date(checkIn)))
      : 0;

  const totalPrice = nightlyRate != null ? nightlyRate * nights : null;

  useEffect(() => {
    if (!checkIn || !checkOut || nights <= 0) {
      setIsAvailable(null);
      return;
    }

    const check = async () => {
      setCheckingAvailability(true);
      try {
        const { data } = await api.get('/api/reservations/availability', {
          params: { checkIn, checkOut },
        });
        setIsAvailable(data.available);
      } catch {
        setIsAvailable(null);
      } finally {
        setCheckingAvailability(false);
      }
    };

    const timeout = setTimeout(check, 400);
    return () => clearTimeout(timeout);
  }, [checkIn, checkOut, nights]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!checkIn || !checkOut) {
      toast.error('Please select check-in and check-out dates');
      return;
    }
    if (nights <= 0) {
      toast.error('Check-out must be after check-in');
      return;
    }
    if (isAvailable === false) {
      toast.error('Those dates are not available. Please choose different dates.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/api/reservations', { checkIn, checkOut, guests, specialRequests });
      toast.success('Reservation created! We will confirm shortly.');
      navigate('/my-reservations');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create reservation');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-stone-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-stone-800 mb-1">Book Casa de Matilda</h1>
        <p className="text-stone-500 mb-8">Reserve the entire property exclusively for your group.</p>

        {/* What's Included */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-stone-800 mb-4">What's Included</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {AMENITIES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="bg-amber-50 text-stone-700 text-sm font-medium px-3 py-2.5 rounded-xl border border-amber-100 flex items-center gap-2"
              >
                <Icon className="w-4 h-4 text-amber-600 flex-shrink-0" />
                {label}
              </div>
            ))}
          </div>
          <p className="mt-4 text-stone-500 text-sm leading-relaxed">
            When you book Casa de Matilda, you get the <strong>entire property</strong> — both
            rooms, the swimming pool, garden, and all amenities. Perfect for families and barkada
            getaways!
          </p>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6 sm:p-8 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-stone-700 font-medium mb-1.5" htmlFor="checkIn">
                Check-in Date
              </label>
              <input
                id="checkIn"
                type="date"
                min={today}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                required
                className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="block text-stone-700 font-medium mb-1.5" htmlFor="checkOut">
                Check-out Date
              </label>
              <input
                id="checkOut"
                type="date"
                min={checkIn || today}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                required
                className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          {/* Availability indicator */}
          {nights > 0 && (
            <div className="flex items-center gap-2 text-sm font-medium">
              {checkingAvailability && (
                <span className="text-stone-400 flex items-center gap-1.5">
                  <Loader2 className="w-4 h-4 animate-spin" /> Checking availability...
                </span>
              )}
              {!checkingAvailability && isAvailable === true && (
                <span className="text-teal-600 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Available for those dates!
                </span>
              )}
              {!checkingAvailability && isAvailable === false && (
                <span className="text-red-500 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" /> Not available — those dates are already booked.
                </span>
              )}
            </div>
          )}

          <div>
            <label className="block text-stone-700 font-medium mb-1.5" htmlFor="guests">
              Number of Guests
            </label>
            <input
              id="guests"
              type="number"
              min={1}
              max={20}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              required
              className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <p className="text-stone-400 text-xs mt-1">Maximum 20 guests for the whole property.</p>
          </div>

          <div>
            <label className="block text-stone-700 font-medium mb-1.5" htmlFor="specialRequests">
              Special Requests <span className="text-stone-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="specialRequests"
              rows={3}
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="e.g. early check-in, extra towels, birthday setup..."
              className="w-full border border-stone-300 rounded-xl px-4 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
            />
          </div>

          {/* Price Summary */}
          {nights > 0 && nightlyRate != null && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-1.5">
              <div className="flex justify-between text-stone-600 text-sm">
                <span>₱{nightlyRate.toLocaleString()} × {nights} night{nights !== 1 ? 's' : ''}</span>
                <span>₱{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-stone-500 text-xs">
                <span>Includes: 2 rooms, pool, all amenities</span>
              </div>
              <div className="flex justify-between text-stone-800 font-bold text-lg border-t border-amber-200 pt-2 mt-2">
                <span>Total</span>
                <span className="text-amber-600">₱{totalPrice.toLocaleString()}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || nights <= 0 || isAvailable === false}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-stone-300 disabled:cursor-not-allowed text-stone-900 font-bold text-lg py-3.5 rounded-2xl transition-colors shadow"
          >
            {submitting ? 'Creating Reservation...' : 'Confirm Reservation'}
          </button>
        </form>
      </div>
    </div>
  );
}

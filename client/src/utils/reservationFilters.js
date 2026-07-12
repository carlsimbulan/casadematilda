function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function isPastStay(reservation) {
  const checkOut = new Date(reservation.checkOut);
  checkOut.setHours(0, 0, 0, 0);
  return checkOut < startOfToday();
}

export function isUpcoming(reservation) {
  return reservation.status !== 'cancelled' && !isPastStay(reservation);
}

export function isHistory(reservation) {
  return reservation.status !== 'cancelled' && isPastStay(reservation);
}

export function isCancelled(reservation) {
  return reservation.status === 'cancelled';
}

export function filterReservations(reservations, filter) {
  switch (filter) {
    case 'upcoming':
      return reservations.filter(isUpcoming);
    case 'history':
      return reservations.filter(isHistory);
    case 'cancelled':
      return reservations.filter(isCancelled);
    case 'pending':
      return reservations.filter((r) => r.status === 'pending');
    case 'confirmed':
      return reservations.filter((r) => r.status === 'confirmed');
    default:
      return reservations;
  }
}

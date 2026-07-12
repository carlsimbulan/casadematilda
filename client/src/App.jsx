import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './layouts/AppShell.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

import HomeEntry from './pages/HomeEntry.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import Rooms from './pages/Rooms.jsx';
import RoomDetail from './pages/RoomDetail.jsx';
import BookingPage from './pages/BookingPage.jsx';
import MyReservations from './pages/MyReservations.jsx';
import ReservationHistory from './pages/ReservationHistory.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminRooms from './pages/admin/AdminRooms.jsx';
import AdminReservations from './pages/admin/AdminReservations.jsx';
import AdminReservationHistory from './pages/admin/AdminReservationHistory.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<HomeEntry />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/rooms/:id" element={<RoomDetail />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/register" element={<Navigate to="/" replace />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <UserDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/book"
          element={
            <PrivateRoute>
              <BookingPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-reservations"
          element={
            <PrivateRoute>
              <MyReservations />
            </PrivateRoute>
          }
        />
        <Route
          path="/reservation-history"
          element={
            <PrivateRoute>
              <ReservationHistory />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute adminOnly>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/rooms"
          element={
            <PrivateRoute adminOnly>
              <AdminRooms />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/reservations"
          element={
            <PrivateRoute adminOnly>
              <AdminReservations />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/reservation-history"
          element={
            <PrivateRoute adminOnly>
              <AdminReservationHistory />
            </PrivateRoute>
          }
        />
      </Route>
    </Routes>
  );
}

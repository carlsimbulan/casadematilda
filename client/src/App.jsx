import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

import Home from './pages/Home.jsx';
import Rooms from './pages/Rooms.jsx';
import RoomDetail from './pages/RoomDetail.jsx';
import BookingPage from './pages/BookingPage.jsx';
import MyReservations from './pages/MyReservations.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminRooms from './pages/admin/AdminRooms.jsx';
import AdminReservations from './pages/admin/AdminReservations.jsx';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<RoomDetail />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<Navigate to="/" replace />} />

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
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

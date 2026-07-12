import { Link } from 'react-router-dom';
import { Home, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-stone-800 text-stone-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xl mb-3">
              <Home className="w-6 h-6" />
              <span>Casa de Matilda</span>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed">
              Your perfect staycation escape. Relax, unwind, and feel at home in our cozy spaces.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-amber-400 font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-amber-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/rooms" className="hover:text-amber-400 transition-colors">Browse Rooms</Link>
              </li>
              <li>
                <Link to="/my-reservations" className="hover:text-amber-400 transition-colors">My Reservations</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-amber-400 font-semibold mb-3">Contact</h3>
            <ul className="space-y-2 text-sm text-stone-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" /> hello@casamatilda.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" /> +63 (912) 345-6789
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0" /> Cavite, Philippines
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-700 mt-8 pt-6 text-center text-stone-500 text-sm">
          &copy; {year} Casa de Matilda. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

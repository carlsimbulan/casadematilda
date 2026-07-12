import { Link } from 'react-router-dom';
import ProtectedLink from './ProtectedLink.jsx';
import { Home, Mail, MapPin, Instagram, Facebook } from 'lucide-react';

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
                <ProtectedLink to="/my-reservations" className="hover:text-amber-400 transition-colors">My Reservations</ProtectedLink>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-amber-400 font-semibold mb-3">Contact</h3>
            <ul className="space-y-3 text-sm text-stone-400">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <a
                  href="mailto:casadematilda.stay@gmail.com"
                  className="hover:text-amber-400 transition-colors"
                >
                  casadematilda.stay@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>015 Purok 1 Biglang Liko Street, Silang, Philippines, 4118</span>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="w-4 h-4 flex-shrink-0" />
                <a
                  href="https://www.instagram.com/casade.matilda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors"
                >
                  @casade.matilda
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Facebook className="w-4 h-4 flex-shrink-0" />
                <a
                  href="https://www.facebook.com/casadematilda.stay"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors"
                >
                  Casa de Matilda
                </a>
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

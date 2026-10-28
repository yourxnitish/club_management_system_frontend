import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, MapPin, ExternalLink, Heart } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer className="bg-navy-900 text-white pt-16 pb-12 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-navy-800/80">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-navy-800 border border-gold/40 flex items-center justify-center text-gold">
                <Shield className="w-5 h-5 text-gold" />
              </div>
              <span className="font-serif text-lg font-bold text-white tracking-tight">
                College Club Portal
              </span>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed">
              The premier collegiate hub for discovering student organizations, RSVPing for university events, and nurturing campus community.
            </p>
            <div className="flex items-center gap-2 text-xs text-ink-muted">
              <MapPin className="w-4 h-4 text-gold shrink-0" />
              <span>University Central Quad, Student Affairs Building</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-ink-muted">
              <Mail className="w-4 h-4 text-gold shrink-0" />
              <span>clubs@collegeclub.edu</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-gold uppercase tracking-wider mb-4">
              Explore Portal
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li>
                <Link to="/clubs" className="hover:text-white transition">Club Directory</Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-white transition">Upcoming Campus Events</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">Platform Overview & Bylaws</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition">Portal Authentication</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-gold uppercase tracking-wider mb-4">
              Societies & Guilds
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li>
                <Link to="/clubs?category=Technology+%26+Engineering" className="hover:text-white transition">Technology & Engineering</Link>
              </li>
              <li>
                <Link to="/clubs?category=Arts+%26+Culture" className="hover:text-white transition">Visual & Performing Arts</Link>
              </li>
              <li>
                <Link to="/clubs?category=Debate+%26+Leadership" className="hover:text-white transition">Debating & Model UN</Link>
              </li>
              <li>
                <Link to="/clubs?category=Sports+%26+Recreation" className="hover:text-white transition">Athletics & Club Sports</Link>
              </li>
              <li>
                <Link to="/clubs?category=Social+%26+Environment" className="hover:text-white transition">EcoAction & Sustainability</Link>
              </li>
            </ul>
          </div>

          {/* Administrative */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-gold uppercase tracking-wider mb-4">
              Student Leadership
            </h4>
            <p className="text-xs text-ink-muted mb-4 leading-relaxed">
              Are you a recognized student leader seeking club administration access or annual campus budget allocation?
            </p>
            <div className="space-y-2">
              <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-gold hover:text-gold-light font-medium">
                Club Administrator Sign In <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <div className="pt-2">
                <span className="inline-block px-2.5 py-1 text-[11px] rounded bg-forest-700/30 text-green-300 border border-forest-600/30">
                  Fall Semester Registrations Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-ink-muted gap-4">
          <p>© {new Date().getFullYear()} University Student Affairs Board. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built for academic excellence & student community</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

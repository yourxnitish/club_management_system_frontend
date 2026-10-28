import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Compass, Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-navy-900/10 text-navy-900 flex items-center justify-center">
          <Compass className="w-10 h-10 animate-spin-slow" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-gold">404 Error</span>
          <h1 className="font-serif text-3xl font-bold text-navy-900 mt-1">Page Not Found</h1>
          <p className="text-sm text-ink-secondary mt-2">
            The university page, club record, or resource you are looking for does not exist or may have been relocated.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link to="/">
            <Button variant="primary">
              <Home className="w-4 h-4 mr-2" /> Return to Campus Home
            </Button>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md border border-border bg-white text-navy-900 hover:bg-ivory transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

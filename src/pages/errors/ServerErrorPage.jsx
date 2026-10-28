import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export default function ServerErrorPage() {
  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-crimson/10 text-crimson flex items-center justify-center">
          <AlertTriangle className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-crimson">500 Server Error</span>
          <h1 className="font-serif text-3xl font-bold text-navy-900 mt-1">Temporary System Interruption</h1>
          <p className="text-sm text-ink-secondary mt-2">
            The university platform encountered an unexpected system error. Our technical staff has been alerted.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button variant="primary" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" /> Reload Application
          </Button>
          <Link to="/">
            <Button variant="secondary">
              <Home className="w-4 h-4 mr-2" /> Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

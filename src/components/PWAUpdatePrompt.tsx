import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Download, RefreshCw } from 'lucide-react';

export function PWAUpdatePrompt() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg);
        
        // Check for updates
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setUpdateAvailable(true);
                toast.info('New version available!', {
                  description: 'Click to update the app',
                  action: {
                    label: 'Update',
                    onClick: () => updateApp()
                  },
                  duration: 10000
                });
              }
            });
          }
        });
      });
    }
  }, []);

  const updateApp = () => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  if (!updateAvailable) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-background border border-border rounded-lg p-4 shadow-lg max-w-sm">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <h4 className="font-semibold text-sm">Update Available</h4>
          <p className="text-xs text-muted-foreground">A new version of BrainLearn is ready</p>
        </div>
        <Button size="sm" onClick={updateApp} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Update
        </Button>
      </div>
    </div>
  );
}

// Install prompt component
export function PWAInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;

    const result = await installPrompt.prompt();
    if (result.outcome === 'accepted') {
      setShowInstall(false);
      toast.success('App installed successfully!');
    }
    setInstallPrompt(null);
  };

  if (!showInstall || !installPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-background border border-border rounded-lg p-4 shadow-lg max-w-sm">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <h4 className="font-semibold text-sm">Install BrainLearn</h4>
          <p className="text-xs text-muted-foreground">Add to your home screen for quick access</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setShowInstall(false)}>
            Later
          </Button>
          <Button size="sm" onClick={handleInstall} className="gap-2">
            <Download className="h-4 w-4" />
            Install
          </Button>
        </div>
      </div>
    </div>
  );
}
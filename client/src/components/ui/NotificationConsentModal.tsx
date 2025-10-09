import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { db, messaging } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { getToken } from "firebase/messaging";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationConsentModal({ isOpen, onClose }: Props) {
  const { user, updateUserState } = useAuth();
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const allow = async () => {
    if (!('Notification' in window)) {
      toast({ title: 'Notifications not supported', description: 'Your browser does not support notifications.', variant: 'destructive' });
      return;
    }
    if (!window.isSecureContext) {
      toast({ title: 'Secure context required', description: 'Enable HTTPS to allow notifications.', variant: 'destructive' });
      return;
    }
    if (!messaging) {
      toast({ title: 'Push not available', description: 'Messaging not initialized. Please refresh the page.', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const permission = await Notification.requestPermission();
      console.log('Notification permission:', permission);
      if (permission !== 'granted') {
        toast({ title: 'Permission needed', description: 'Please allow notifications to receive alerts.' });
        setSaving(false);
        return;
      }
      let registration: ServiceWorkerRegistration | undefined;
      try {
        registration = (await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js')) || (await navigator.serviceWorker.ready);
      } catch {}
      if (!registration) {
        toast({ title: 'Service worker missing', description: 'Reloading to finalize notification setup...' });
      }

      const token = await getToken(messaging, { 
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: registration,
      });
      console.log('FCM token:', token);
      if (token) {
        if (user) {
          await updateDoc(doc(db, 'users', user.uid), {
            notifyEmail: true,
            notifyWhatsapp: true,
            notificationConsentGiven: true,
            fcmToken: token,
          });
          updateUserState({ notifyEmail: true, notifyWhatsapp: true, notificationConsentGiven: true });
        } else {
          try { localStorage.setItem('pendingFcmToken', token); } catch {}
        }
        toast({ title: 'Notifications enabled', description: 'You will receive grant updates.' });
      }
      try { localStorage.setItem('notifyDismissed', '1'); } catch {}
      onClose();
    } catch (e) {
      console.error('Notification allow failed', e);
      toast({ title: 'Failed to enable notifications', description: e instanceof Error ? e.message : String(e), variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const notNow = () => {
    try { localStorage.setItem('notifyDismissed', '1'); } catch {}
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Stay Updated!</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-700">
          Allow notifications to get instant alerts about new grants and upcoming deadlines. Never miss an opportunity!
        </p>
       
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={notNow}>Not now</Button>
          <Button onClick={allow} disabled={saving}>{saving ? 'Saving...' : 'Allow'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}



import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationConsentModal({ isOpen, onClose }: Props) {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  const allow = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.id), { notifyEmail: true, notifyWhatsapp: true });
      localStorage.setItem('grant_notify_consent', 'granted');
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Allow notifications for grant updates</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600">
          We’ll send you important updates on new grants, deadlines, and opportunities via Email and WhatsApp.
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Not now</Button>
          <Button onClick={allow} disabled={saving}>{saving ? 'Saving...' : 'Allow notifications'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}



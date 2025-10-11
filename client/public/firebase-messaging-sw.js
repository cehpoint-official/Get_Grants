// client/public/firebase-messaging-sw.js

importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

importScripts("/firebase-config.js");

// Initialize Firebase with the config
const firebaseConfig = {
  apiKey: "AIzaSyAfgswoA7g4xRIN7KM0Y-stIh7kb7rxtJY",
  authDomain: "getgrants.in",
  projectId: "grant-e982c",
  storageBucket: "grant-e982c.firebasestorage.app",
  messagingSenderId: "800955503496",
  appId: "1:800955503496:web:1674c62b6c2e11edcc203d"
};

if (typeof firebase !== 'undefined') {
  firebase.initializeApp(firebaseConfig);

  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    console.log(
      "[firebase-messaging-sw.js] Received background message ",
      payload
    );
    // Prefer data payload to avoid browser auto-notification duplication
    const data = payload.data || {};
    const notificationTitle = (payload.notification && payload.notification.title) || data.title || 'Update';
    const notificationOptions = {
      body: (payload.notification && payload.notification.body) || data.body || '',
      icon: data.icon || "/logo192.png",
      tag: data.tag || data.notificationId || data.collapse_key || 'get-grants',
      renotify: false,
      data: {
        url: data.url || data.click_action || '/',
        tabId: data.tabId || undefined,
      },
    };

    // Close any existing notification with same tag to dedupe
    self.registration.getNotifications({ tag: notificationOptions.tag }).then((existing) => {
      existing.forEach((n) => n.close());
      self.registration.showNotification(notificationTitle, notificationOptions);
    });
  });

  // Handle clicks: focus existing client or open a new window
  self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const targetUrl = (event.notification && event.notification.data && event.notification.data.url) || '/';

    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          // If any open tab matches our origin, focus it and navigate
          if ('focus' in client) {
            // If it's already at target, just focus
            try {
              const url = new URL(client.url);
              const target = new URL(targetUrl, url.origin).href;
              if (client.url === target) {
                return client.focus();
              }
            } catch (_) {}
          }
        }
        // No focused client matched; open a new one
        if (clients.openWindow) {
          // Ensure absolute URL based on SW scope/origin
          try {
            const origin = self.location.origin || '';
            const absolute = new URL(targetUrl, origin).href;
            return clients.openWindow(absolute);
          } catch (_) {
            return clients.openWindow(targetUrl);
          }
        }
        return undefined;
      })
    );
  });
} else {
  console.error("Firebase config not found. Service worker cannot be initialized.");
}
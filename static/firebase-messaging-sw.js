/* eslint-disable no-undef */
importScripts(
  'https://www.gstatic.com/firebasejs/9.0.1/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/9.0.1/firebase-messaging-compat.js'
);

const firebaseConfig = {
  apiKey: 'AIzaSyDfhi45CK_2WWct5FxrHWPGkPDQH5BWpE0',
  authDomain: 'svelte-kit-a399c.firebaseapp.com',
  projectId: 'svelte-kit-a399c',
  storageBucket: 'svelte-kit-a399c.appspot.com',
  messagingSenderId: '19767501940',
  appId: '1:19767501940:web:491801c204bb11a972dd21'
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body
    // TODO: static icon later
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

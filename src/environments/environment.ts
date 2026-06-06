export const environment = {
  production: false,

  // .NET backend API URL
  apiUrl: 'https://localhost:44384/api',

  // SignalR hub URL (same origin, different path)
  signalrHubUrl: 'https://localhost:44384/hubs/clinic-dashboard',

  // Legacy alias — kept for backward compatibility
  apiBaseUrl: 'https://localhost:44384/api',

  // .NET backend handles auth. Social login via /api/auth/google and /api/auth/facebook.
  // Google OAuth client ID — matches the one validated by the .NET backend
  googleClientId: '506648259313-uk5965cr6lkfhesivnvej5quu6g6hr1o.apps.googleusercontent.com',
  facebookAppId: '904138729352506',
  facebookSdkVersion: 'v25.0',

  useMockData: false,

  // Explicit site URL for OAuth redirects.
  // For local dev, fall back to window.location.origin.
  siteUrl: '',

  // Firebase web app config. These values come from the Firebase console.
  // Leave blank to disable browser push registration while keeping Realtime.
  firebaseApiKey: 'AIzaSyCVm5aOHRMHAdtMmz832xc0z0hhI-Liwzk',
  firebaseAuthDomain: 'clinic-sup.firebaseapp.com',
  firebaseProjectId: 'clinic-sup',
  firebaseStorageBucket: 'clinic-sup.firebasestorage.app',
  firebaseMessagingSenderId: '506032600761',
  firebaseAppId: '1:506032600761:web:98c9a57fe34b4b48f14d68',
  firebaseMeasurementId: '',

  // Firebase Web Push certificate public key from Firebase Console.
  firebaseVapidKey: 'BExXCzlTCn-xp4NBupxcCIpWUroylfgE_Yb3os2MkeZEl2phVDo8HDyx4xQ9pgkxOgGwAsnzVU2c70YiBwkPcqM',
  vapidKey: 'BMJf90oxjKHvMY9J7pRHfpprVCaqoL0few-R-7nWaB6MvUKSFcfqN2e-27U9DHU5LBCeF-EtOMpjZtBT6eEdlwo'
};

export const environment = {
  production: true,

  // .NET backend API URL (production)
  apiUrl: 'https://api.yourclinicdomain.com/api',

  // Legacy alias
  apiBaseUrl: 'https://api.yourclinicdomain.com/api',

  // Social login via .NET backend /api/auth/google and /api/auth/facebook.
  googleClientId: '',
  facebookAppId: '',
  facebookSdkVersion: 'v25.0',

  useMockData: false,

  // Explicit site URL for OAuth redirects.
  // On Vercel this must be the production domain, not localhost.
  siteUrl: 'https://clinic-sup.vercel.app',

  // Firebase web app config. These values come from the Firebase console.
  firebaseApiKey: 'AIzaSyCVm5aOHRMHAdtMmz832xc0z0hhI-Liwzk',
  firebaseAuthDomain: 'clinic-sup.firebaseapp.com',
  firebaseProjectId: 'clinic-sup',
  firebaseStorageBucket: 'clinic-sup.firebasestorage.app',
  firebaseMessagingSenderId: '506032600761',
  firebaseAppId: '1:506032600761:web:98c9a57fe34b4b48f14d68',
  firebaseMeasurementId: '',

  // Firebase Web Push certificate public key.
  firebaseVapidKey: 'BExXCzlTCn-xp4NBupxcCIpWUroylfgE_Yb3os2MkeZEl2phVDo8HDyx4xQ9pgkxOgGwAsnzVU2c70YiBwkPcqM',
  vapidKey: 'BMJf90oxjKHvMY9J7pRHfpprVCaqoL0few-R-7nWaB6MvUKSFcfqN2e-27U9DHU5LBCeF-EtOMpjZtBT6eEdlwo'
};

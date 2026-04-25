import { registerSW } from 'virtual:pwa-register';

// Register service worker
const updateSW = registerSW({
  onNeedRefresh() {
    // Show update available notification
    console.log('PWA update available');
  },
  onOfflineReady() {
    // Show offline ready notification
    console.log('PWA offline ready');
  },
  onRegistered(r) {
    console.log('PWA registered:', r);
  },
  onRegisterError(error) {
    console.log('PWA registration error:', error);
  }
});

// Export for manual updates
export { updateSW };
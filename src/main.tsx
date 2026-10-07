import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Auto-register service worker for complete offline capability
registerSW({
  immediate: true,
  onRegisteredSW(swUrl, r) {
    console.log(`Service Worker registered: ${swUrl}`);
  },
  onRegisterError(error) {
    console.warn('SW registration warning:', error);
  },
});

createRoot(document.getElementById('root')!).render(<App />);

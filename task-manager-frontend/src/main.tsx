import { createRoot } from 'react-dom/client';

import '@/globals.css';
import App from '@/app.tsx';
import { Providers } from '@/components/shared/providers';

createRoot(document.getElementById('root')!).render(
  <Providers>
    <App />
  </Providers>,
);

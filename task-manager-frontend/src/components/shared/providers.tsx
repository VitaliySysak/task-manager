import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { store } from '@/store/store.ts';

export const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      <BrowserRouter>
        <Provider store={store}>{children}</Provider>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 5000,
            success: {
              icon: '✅',
              style: {
                background: 'var(--primary)',
                color: 'white',
              },
            },
            error: {
              icon: '❌',
              style: {
                background: 'var(--primary)',
                color: 'white',
              },
            },
          }}
        />
      </BrowserRouter>
    </>
  );
};

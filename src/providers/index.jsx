import { BrowserRouter } from 'react-router-dom';
import { QueryProvider } from './QueryProvider';
import { HelmetProvider } from 'react-helmet-async';

export const AppProviders = ({ children }) => {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <QueryProvider>
          {children}
        </QueryProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
};

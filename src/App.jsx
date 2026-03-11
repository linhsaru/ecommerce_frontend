import { RouterProvider } from 'react-router-dom';
import './App.css';
import { NavigationProvider } from './navigation/context/NavigationContext';
import { LanguageProvider } from './context/LanguageContext';
import router from './navigation/routes/AppRoutes';

function App() {
  return (
    <LanguageProvider>
      <NavigationProvider>
        <RouterProvider router={router} />
      </NavigationProvider>
    </LanguageProvider>
  );
}

export default App;

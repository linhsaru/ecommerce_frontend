import { RouterProvider } from 'react-router-dom';
import './App.css';
import { LanguageProvider } from './context/LanguageContext';
import router from './navigation/routes/AppRoutes';

function App() {
  return (
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>
  );
}

export default App;

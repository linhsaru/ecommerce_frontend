import { RouterProvider } from 'react-router-dom';
import './App.css';
import { NavigationProvider } from './navigation/context/NavigationContext';
import router from './navigation/routes/AppRoutes';

function App() {
  return (
    <>
      <NavigationProvider>
        <RouterProvider router={router} />
      </NavigationProvider>
    </>
  );
}

export default App;

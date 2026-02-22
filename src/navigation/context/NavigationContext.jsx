import { createContext, useState } from 'react';

export const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  return (
    <NavigationContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </NavigationContext.Provider>
  );
};

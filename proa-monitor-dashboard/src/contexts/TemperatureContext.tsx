import React, { createContext, ReactNode, useContext, useState } from 'react';

type TemperatureUnit = 'celsius' | 'fahrenheit';

interface TemperatureContextType {
  temperatureUnit: TemperatureUnit;
  setTemperatureUnit: (unit: TemperatureUnit) => void;
}

const TemperatureContext = createContext<TemperatureContextType | undefined>(undefined);

export const useTemperatureUnit = () => {
  const context = useContext(TemperatureContext);
  if (context === undefined) {
    throw new Error('useTemperatureUnit must be used within a TemperatureProvider');
  }
  return context;
};

interface TemperatureProviderProps {
  children: ReactNode;
}

export const TemperatureProvider: React.FC<TemperatureProviderProps> = ({ children }) => {
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>('celsius');

  return (
    <TemperatureContext.Provider value={{ temperatureUnit, setTemperatureUnit }}>
      {children}
    </TemperatureContext.Provider>
  );
};

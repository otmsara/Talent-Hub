'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CareerWorkspaceContextProps {
  isCareerWorkspaceVisible: boolean;
  toggleCareerWorkspace: (state?: boolean) => void;
}

const CareerWorkspaceContext = createContext<CareerWorkspaceContextProps | undefined>(undefined);

export const CareerWorkspaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isCareerWorkspaceVisible, setIsCareerWorkspaceVisible] = useState(false);

  const toggleCareerWorkspace = (state?: boolean) => {
    setIsCareerWorkspaceVisible(prevState => state !== undefined ? state : !prevState);
  };

  return (
    <CareerWorkspaceContext.Provider value={{ isCareerWorkspaceVisible, toggleCareerWorkspace }}>
      {children}
    </CareerWorkspaceContext.Provider>
  );
};

export const useCareerWorkspace = (): CareerWorkspaceContextProps => {
  const context = useContext(CareerWorkspaceContext);
  if (!context) {
    throw new Error('useCareerWorkspace must be used within a CareerWorkspaceProvider');
  }
  return context;
};
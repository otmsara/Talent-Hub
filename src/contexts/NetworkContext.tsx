import React, { createContext, useContext, useState, ReactNode } from "react";

interface NetworkContextType {
  networked: { [username: string]: boolean };
  setNetworked: (username: string, value: boolean) => void;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const NetworkProvider = ({ children }: { children: ReactNode }) => {
  const [networked, setNetworkedState] = useState<{ [username: string]: boolean }>({});

  const setNetworked = (username: string, value: boolean) => {
    setNetworkedState((prev) => ({
      ...prev,
      [username]: value,
    }));
  };

  return (
    <NetworkContext.Provider value={{ networked, setNetworked }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error("useNetwork must be used within a NetworkProvider");
  }
  return context;
};

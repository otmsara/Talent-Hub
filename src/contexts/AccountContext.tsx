import React, { createContext, useContext, useState, ReactNode } from "react";
import { User, currentUser as defaultUser, users, findUserById } from "../data/dummyData";

type AccountContextType = {
  currentUser: User;
  switchUser: (userId: string) => void;
};

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider = ({ children }: { children: ReactNode }) => {
  // Start with the default user
  const [currentUser, setCurrentUser] = useState<User>(defaultUser);

  const switchUser = (userId: string) => {
    if (userId === currentUser.id) return;
    const user = users.find(u => u.id === userId);
    if (user) setCurrentUser(user);
  };

  return (
    <AccountContext.Provider value={{ currentUser, switchUser }}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = (): AccountContextType => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccount must be used within an AccountProvider");
  }
  return context;
};

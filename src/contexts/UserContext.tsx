import React, { createContext, useContext, ReactNode } from "react";

export interface User {
  id: string;
  name?: string;
  // add other user fields as needed
}

const UserContext = createContext<User | null>(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({
  user,
  children,
}: {
  user: User;
  children: ReactNode;
}) => <UserContext.Provider value={user}>{children}</UserContext.Provider>;

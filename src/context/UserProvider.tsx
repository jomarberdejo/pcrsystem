"use client";

import React, { createContext, useContext } from "react";
import useSWR from "swr";

interface User {
  id: string;
  username: string;
  role: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  error: any;
}

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  error: null,
});

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data, error, isLoading } = useSWR<User>("/api/auth/me", fetcher);

  return (
    <UserContext.Provider value={{ user: data ?? null, isLoading, error }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

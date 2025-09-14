import { onAuthStateChanged, User } from "firebase/auth";

import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';


const AuthContext = createContext<{user: User | null, loading: boolean }>({
  user: null,
  loading: true
});



const AuthProvider = ({children}: {children: ReactNode}) => {

  const [user, setIsUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsUser(user ?? null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user , loading }}>
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => {
    return useContext(AuthContext);
}

export { AuthProvider, useAuth };
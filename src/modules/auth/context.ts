import { User } from 'shared';
import { createContext, useContext } from 'react';

/**
 * Auth context props.
 */
export type AuthContextProps = {
  user: User | null;
  fetchUser: () => Promise<void>;
  setLoginToken: (token: string) => Promise<void>;
  setPushToken: (pushToken: string) => Promise<void>;
  logout: () => Promise<void>;
};

/**
 * Auth context.
 */
export const AuthContext = createContext<AuthContextProps>({
  user: null,
  fetchUser: () => {
    throw new Error('missing AuthProvider');
  },
  setLoginToken: () => {
    throw new Error('missing AuthProvider');
  },
  setPushToken: () => {
    throw new Error('missing AuthProvider');
  },
  logout: () => {
    throw new Error('missing AuthProvider');
  },
});

/**
 * Use auth hook.
 * 
 * @return  {AuthContextProps} The auth context.
 */
export const useAuth = () => {
  return useContext(AuthContext);
};

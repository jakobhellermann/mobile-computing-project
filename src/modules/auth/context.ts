import { User } from 'shared';
import { createContext, useContext } from 'react';

/**
 * Auth context props.
 */
export type AuthContextProps = {
  user: User | null;
  fetchUser: () => Promise<void>;
  loginToken: (token: string) => Promise<void>;
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
  loginToken: () => {
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

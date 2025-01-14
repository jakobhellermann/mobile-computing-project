import { useState } from 'react';
import { useAuth } from '../modules/auth/context';
import { apiFetchUnauthorized, } from '../api/base';


/**
 * Login hook.
 * 
 * @return {object} The login hook.
 * @return {boolean} return.loading - The loading state.
 * @return {string} return.error - The error message.
 * @return {Function} return.login - The login function.
 */
export const useLogin = () => {
  const { setLoginToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Login function.
   * 
   * @param {string} email - The email.
   * @param {string} password - The password.
   */
  const login = async (email: string, password: string) => {
    setLoading(true);

    apiFetchUnauthorized<{ token: string; }>("/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((login) => setLoginToken(login.token))
      .catch((error) => {
        console.error(`Login error: ${error}`);
        if (error instanceof Response && error.status === 401) {
          setError(
            'E-Mail oder Passwort sind nicht korrekt. Versuche es erneut.'
          );
        } else {
          setError(
            'Ein unerwarteter Fehler ist aufgetreten. Versuche es erneut.'
          );
        }
      })
      .finally(() => setLoading(false));
  };

  return {
    loading,
    error,
    login,
  };
};

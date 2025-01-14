import { useState } from 'react';
import { useAuth } from '../modules/auth/context';
import { BASE_URL } from '../api/constants';


/**
 * Login hook.
 * 
 * @return {object} The login hook.
 * @return {boolean} return.loading - The loading state.
 * @return {string} return.error - The error message.
 * @return {Function} return.login - The login function.
 */
export const useLogin = () => {
  const { fetchUser, loginToken } = useAuth();
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

    fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then(async (res) => {
        console.log(res);
        if (!res.ok) {
          throw res;
        }
        return await res.json() as { token: string; };
      })
      .then((login) => loginToken(login.token))
      .then(fetchUser)
      .catch((error) => {
        console.error("error");
        console.error(error);
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

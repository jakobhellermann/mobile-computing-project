import { useState } from 'react';
import { useNotifications } from './toast';
import { useAuth } from '../modules/auth/context';
import { BASE_URL } from '../api/constants';

/**
 * Register hook.
 * 
 * @return {object} The register hook.
 * @return {boolean} return.loading - The loading state.
 * @return {string} return.error - The error message.
 * @return {Function} return.register - The register function.
 */
export const useRegister = () => {
  const { fetchUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { showError } = useNotifications();

  /**
   * Register function.
   * 
   * @param {string} email - The email.
   * @param {string} password - The password.
   */
  const register = async (
    email: string,
    password: string
  ) => {
    setLoading(true);

    fetch(`${BASE_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        if (!res.ok) {
          throw res;
        }
        return res.json();
      })
      .then(fetchUser)
      .catch(async (error) => {
        if (error instanceof Response && error.status === 409) {
          showError('Ein Benutzer mit dieser E-Mail-Adresse existiert bereits.');
        } else {
          let message = (error instanceof Response) ? await error.text() : "";
          showError(
            'Ein unerwarteter Fehler ist aufgetreten. Versuche es erneut.\n' + message
          );
        };
      })
      .finally(() => setLoading(false));
  };

  return {
    loading,
    error,
    register,
  };
};

import { useState } from 'react';
import { useNotifications } from './toast';
import { useAuth } from '../modules/auth/context';
import { apiFetchUnauthorized } from '../api/base';

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

    apiFetchUnauthorized("/register", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .catch(async (error: Error) => {
        if (error.cause instanceof Response && error.cause.status === 409) {
          return showError('Email-Addresse bereits vergeben.');
        }
        showError(error);
      })
      .then(fetchUser)
      .finally(() => setLoading(false));
  };

  return {
    loading,
    register,
  };
};

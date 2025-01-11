import { Page, User, UserUpdate } from 'shared';
import { useAuth } from '../modules/auth/context';
// import { useNotifications } from '../modules/notification/context';
import useSWR, { useSWRConfig } from 'swr';
import { useNotifications } from './toast';


/**
 * Use user hook for the current user.
 * 
 * Manages the user using the api.
 * 
 * @param {number} id - The user id.
 * @return  {Object} The user.
 * @return  {User} return.user - The user.
 * @return  {boolean} return.isLoading - The loading state.
 * @return  {Error} return.error - The error.
 * @return  {Function} return.deleteUser - The delete user function.
 */
export const useUser = () => {
  const { notify } = useNotifications();
  const { fetchUser } = useAuth();

  /**
   * Update user.
   * 
   * @param update - The user update.
   */
  const updateUser = async (update: UserUpdate) => {
    return await fetch(`/api/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(update),
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 409) {
            return 'Diese E-Mail-Adresse wird bereits verwendet.';
          }

          return 'Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.';
        }

        notify({
          message: 'Deine Benutzerdaten wurde aktualisiert.',
          type: 'success',
        });

        fetchUser();
      })
      .catch((err) => {
        console.error(err);
        return 'Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.';
      });
  };

  /**
   * Update password.
   * 
   * @param password - The new password.
   * @param currentPassword - The current password.
   */
  const updatePassword = async (password: string, currentPassword: string) => {
    return await fetch(`/api/user/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password, currentPassword }),
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 403) {
            return 'Das aktuelle Passwort ist nicht korrekt.';
          }

          return 'Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.';
        }

        notify({
          message: 'Dein Passwort wurde aktualisiert.',
          type: 'success',
        });
      })
      .catch((err) => {
        console.error(err);
        return 'Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.';
      });
  };

  return { updateUser, updatePassword };
};

/**
 * Use user hook for a single user.
 * 
 * Manages the user using the api.
 * 
 * @param {number} id - The user id.
 * @return  {Object} The user.
 * @return  {User} return.user - The user.
 * @return  {boolean} return.isLoading - The loading state.
 * @return  {Error} return.error - The error.
 * @return  {Function} return.deleteUser - The delete user function.
 */
export const useUserById = (id: number): object => {
  const { mutate } = useSWRConfig();
  const { notify } = useNotifications();
  const { data, error, isLoading } = useSWR<User>(`/api/users/${id}`);

  /**
   * Delete user.
   */
  const deleteUser = async () => {
    return await fetch(`/api/users/${id}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) {
          return 'Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.';
        }

        notify({
          message: 'Der Benutzer wurde gelöscht.',
          type: 'success',
        });

        mutate(
          (key) => typeof key === 'string' && key.startsWith('/api/users')
        );
      })
      .catch((err) => {
        console.error(err);
        return 'Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.';
      });
  };

  return {
    user: data,
    isLoading,
    error,
    deleteUser,
  };
};

/**
 * Use users hook.
 * 
 * Manages the users using the api.
 * 
 * @param {string} query - The query.
 * @return  {Object} The users.
 * @return  {User[]} return.users - The users.
 * @return  {boolean} return.isLoading - The loading state.
 * @return  {Error} return.error - The error.
 */
export const useUsers = (query: string = ''): object => {
  const { data, error, isLoading } = useSWR<Page<User>>(
    `/api/users?${new URLSearchParams({
      query,
    }).toString()}`
  );

  return {
    users: data?.data,
    isLoading,
    error,
  };
};

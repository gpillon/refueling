import React, { useEffect, useState } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../services/api';
import { User } from '../types';
import { useTranslation } from 'react-i18next';

const AdminUserComponent: React.FC = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<Partial<User>>({ username: '', role: 'user' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedUser, setEditedUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser(newUser);
      setNewUser({ username: '', role: 'user' });
      fetchUsers();
    } catch (err) {
      setError('Failed to create user. Please try again.');
      console.error('Error creating user:', err);
    }
  };

  const handleUpdateUser = async (id: number, updatedData: Partial<User>) => {
    try {
      await updateUser(id, updatedData);
      fetchUsers();
      setEditingId(null);
      setEditedUser(null);
    } catch (err) {
      setError('Failed to update user. Please try again.');
      console.error('Error updating user:', err);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (window.confirm(t('confirmDeleteUser'))) {
      try {
        await deleteUser(id);
        fetchUsers();
      } catch (err) {
        setError('Failed to delete user. Please try again.');
        console.error('Error deleting user:', err);
      }
    }
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setEditedUser(user);
  };

  const handleSave = () => {
    if (editedUser) {
      handleUpdateUser(editedUser.id, editedUser);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div></div>;
  }

  if (error) {
    return <p className="text-red-500 text-center text-xl mt-8">{error}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">{t('adminUserManagement')}</h1>
      <form onSubmit={handleCreateUser} className="mb-8 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
            {t('username')}:
          </label>
          <input
            id="username"
            type="text"
            placeholder={t('username')}
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">
            {t('role')}:
          </label>
          <select
            id="role"
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="user">{t('user')}</option>
            <option value="admin">{t('admin')}</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
            {t('password')}:
          </label>
          <input
            id="password"
            type="password"
            placeholder={t('password')}
            value={newUser.password}
            minLength={8}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
          {t('addUser')}
        </button>
        
      </form>

      {users.length === 0 ? (
        <p className="text-center text-gray-600 text-xl">{t('noUsersFound')}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <div key={user.id} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              {editingId === user.id ? (
                <>
                  <div className="mb-4">
                    <label htmlFor={`edit-username-${user.id}`} className="block text-gray-700 text-sm font-bold mb-2">
                      {t('username')}:
                    </label>
                    <input
                      id={`edit-username-${user.id}`}
                      type="text"
                      value={editedUser?.username || ''}
                      onChange={(e) => setEditedUser({ ...editedUser!, username: e.target.value })}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor={`edit-role-${user.id}`} className="block text-gray-700 text-sm font-bold mb-2">
                      {t('role')}:
                    </label>
                    <select
                      id={`edit-role-${user.id}`}
                      value={editedUser?.role || ''}
                      onChange={(e) => setEditedUser({ ...editedUser!, role: e.target.value })}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option value="user">{t('user')}</option>
                      <option value="admin">{t('admin')}</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label htmlFor={`edit-password-${user.id}`} className="block text-gray-700 text-sm font-bold mb-2">
                      {t('password')}:
                    </label>
                    <input
                      id={`edit-password-${user.id}`}
                      type="password"
                      value={editedUser?.password || ''}
                      minLength={8}
                      onChange={(e) => setEditedUser({ ...editedUser!, password: e.target.value })}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold mb-2">{user.username}</h2>
                  <p className="text-gray-700 mb-4">{t('role')}: {t(user.role)}</p>
                </>
              )}
              <div className="flex justify-between">
                {editingId === user.id ? (
                  <button
                    onClick={handleSave}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    {t('save')}
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(user)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    {t('edit')}
                  </button>
                )}
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  {t('delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUserComponent;
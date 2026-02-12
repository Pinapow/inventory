import { useState, useEffect } from 'react';
import { Plus, Trash2, Shield, User as UserIcon } from 'lucide-react';
import { User } from '../../types/auth';
import { PageResponse } from '../../types/item';
import { adminApi } from '../../services/authApi';
import { useToast } from '../../components/Toast';

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response: PageResponse<User> = await adminApi.getUsers({ size: 100 });
      setUsers(response.content);
    } catch {
      showToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await adminApi.deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
      showToast('User deleted', 'success');
    } catch {
      showToast('Failed to delete user', 'error');
    }
  };

  const handleToggleRole = async (user: User) => {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    try {
      const updated = await adminApi.updateUserRole(user.id, newRole);
      setUsers(users.map(u => u.id === user.id ? updated : u));
      showToast(`Role changed to ${newRole}`, 'success');
    } catch {
      showToast('Failed to update role', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-stone-100 mb-2">Users</h1>
          <p className="text-stone-400">Manage user accounts and permissions</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-medium rounded-lg transition-all shadow-glow-amber"
        >
          <Plus className="w-5 h-5" />
          Add User
        </button>
      </div>

      <div className="bg-surface-card rounded-2xl border border-white/5 overflow-hidden shadow-premium">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-6 py-4 text-left text-xs font-medium text-stone-400 uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-stone-400 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-stone-400 uppercase tracking-wider">Created</th>
              <th className="px-6 py-4 text-right text-xs font-medium text-stone-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-medium">
                      {user.pictureUrl ? (
                        <img src={user.pictureUrl} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        user.email[0].toUpperCase()
                      )}
                    </div>
                    <span className="text-stone-200">{user.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    user.role === 'ADMIN'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-stone-500/10 text-stone-400 border border-stone-500/20'
                  }`}>
                    {user.role === 'ADMIN' ? <Shield className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-stone-400 text-sm">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleToggleRole(user)}
                      className="p-2 text-stone-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
                      title={user.role === 'ADMIN' ? 'Demote to User' : 'Promote to Admin'}
                    >
                      <Shield className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-2 text-stone-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete user"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="text-center py-12 text-stone-500">
            No users found
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onCreated={(user) => {
            setUsers([...users, user]);
            setShowCreateModal(false);
            showToast('User created', 'success');
          }}
        />
      )}
    </div>
  );
}

function CreateUserModal({ onClose, onCreated }: { onClose: () => void; onCreated: (user: User) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'USER' | 'ADMIN'>('USER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await adminApi.createUser({ email, password, role });
      onCreated(user);
    } catch (err: unknown) {
      const errorMessage = (err as { response?: { status?: number } })?.response?.status === 409
        ? 'A user with this email already exists'
        : 'Failed to create user';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-card rounded-2xl p-6 w-full max-w-md border border-white/5 shadow-premium-hover">
        <h2 className="text-xl font-display text-stone-100 mb-6">Create User</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-stone-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-surface-elevated border border-white/10 rounded-lg text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-accent/50"
              placeholder="user@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2.5 bg-surface-elevated border border-white/10 rounded-lg text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-accent/50"
              placeholder="Minimum 6 characters"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-300 mb-2">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'USER' | 'ADMIN')}
              className="w-full px-4 py-2.5 bg-surface-elevated border border-white/10 rounded-lg text-stone-100 focus:outline-none focus:ring-2 focus:ring-accent/50"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-surface-elevated hover:bg-surface-overlay border border-white/10 text-stone-300 font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-medium rounded-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

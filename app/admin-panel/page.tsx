'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  emailVerified: boolean;
  createdAt: string;
  membership?: {
    id: string;
    active: boolean;
    startDate: string;
    expiresAt: string | null;
  } | null;
}

interface Attendance {
  id: string;
  userId: string;
  checkInTime: string;
  checkOutTime?: string | null;
  qrCode?: string | null;
  user?: {
    name: string | null;
    email: string;
  };
}

export default function AdminPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'checkins'>('overview');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminToken, setAdminToken] = useState('');
  const router = useRouter();

  // Statistics
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    todayCheckIns: 0,
    monthlyCheckIns: 0
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('adminToken');

    if (!token) {
      promptLogin();
    } else {
      // Verify if token is still valid
      try {
        const response = await fetch('/api/auth/session', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.user?.role === 'admin') {
            setAdminToken(token);
            setIsAuthenticated(true);
            fetchData(token);
          } else {
            promptLogin();
          }
        } else {
          promptLogin();
        }
      } catch {
        promptLogin();
      }
    }
  };

  const promptLogin = () => {
    const email = prompt('Admin Email:');
    const password = prompt('Admin Password:');

    if (email && password) {
      loginAdmin(email, password);
    } else {
      router.push('/');
    }
  };

  const loginAdmin = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.user?.role === 'admin') {
        localStorage.setItem('adminToken', data.token);
        setAdminToken(data.token);
        setIsAuthenticated(true);
        fetchData(data.token);
      } else {
        alert('Invalid admin credentials or not an admin account');
        router.push('/');
      }
    } catch (err) {
      alert('Login failed');
      router.push('/');
    }
  };

  const fetchData = async (token: string) => {
    if (activeTab === 'members' || activeTab === 'overview') {
      await fetchUsers(token);
    }
    if (activeTab === 'checkins' || activeTab === 'overview') {
      await fetchAttendances(token);
    }
  };

  const fetchUsers = async (token: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);

        // Calculate stats
        const active = data.users?.filter((u: User) => u.membership?.active).length || 0;
        setStats(prev => ({
          ...prev,
          totalMembers: data.users?.length || 0,
          activeMembers: active
        }));
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendances = async (token: string) => {
    try {
      setLoading(true);
      // For admin, we need to fetch all attendances with user details
      const response = await fetch('/api/checkins', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

        // The checkins route returns different format for admin vs regular user
        // For admin, it should include user details
        if (data.checkins) {
          setAttendances(data.checkins);
        } else if (Array.isArray(data)) {
          // Regular user format - need to enhance for admin view
          setAttendances(data.map((c: {id: string; userId: string; createdAt: string; via?: string}) => ({
            id: c.id,
            userId: c.userId,
            checkInTime: c.createdAt,
            method: c.via === 'QR_SCAN' ? 'QR' : 'MANUAL'
          } as Attendance)));
        }

        // Calculate check-in stats
        const today = new Date().toISOString().split('T')[0];
        const todayCount = (data.checkins || data || []).filter((c: {checkInTime?: string; createdAt?: string}) =>
          (c.checkInTime || c.createdAt || '').split('T')[0] === today
        ).length;

        setStats(prev => ({
          ...prev,
          todayCheckIns: todayCount,
          monthlyCheckIns: (data.checkins || data || []).length
        }));
      }
    } catch (error) {
      console.error('Failed to fetch attendances:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateMembership = async (userId: string, days: number) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + days);

      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          membership: {
            active: days > 0,
            expiresAt: days > 0 ? expiresAt.toISOString() : new Date().toISOString(),
          },
        }),
      });

      if (response.ok) {
        alert(`Membership ${days > 0 ? 'extended' : 'deactivated'} successfully`);
        fetchUsers(token);
      }
    } catch (error) {
      alert('Failed to update membership');
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('User deleted successfully');
        fetchUsers(token);
      }
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    router.push('/');
  };

  useEffect(() => {
    if (isAuthenticated && adminToken) {
      fetchData(adminToken);
    }
  }, [activeTab, selectedDate]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
        <p className="text-xl">Authenticating...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <p className="text-gray-400 mt-1">KBK Princip Management System</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 bg-gray-800/50 p-1 rounded-lg overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 min-w-[120px] px-4 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`flex-1 min-w-[120px] px-4 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'members'
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            Members
          </button>
          <button
            onClick={() => setActiveTab('checkins')}
            className={`flex-1 min-w-[120px] px-4 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'checkins'
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            Check-ins
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">👥</div>
                    <span className="text-3xl font-bold">{stats.totalMembers}</span>
                  </div>
                  <p className="text-gray-400">Total Members</p>
                </div>

                <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">✅</div>
                    <span className="text-3xl font-bold text-green-500">{stats.activeMembers}</span>
                  </div>
                  <p className="text-gray-400">Active Members</p>
                </div>

                <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">📅</div>
                    <span className="text-3xl font-bold text-blue-500">{stats.todayCheckIns}</span>
                  </div>
                  <p className="text-gray-400">Today&apos;s Check-ins</p>
                </div>

                <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">📊</div>
                    <span className="text-3xl font-bold text-purple-500">{stats.monthlyCheckIns}</span>
                  </div>
                  <p className="text-gray-400">Monthly Check-ins</p>
                </div>
              </div>
            )}

            {/* Members Tab */}
            {activeTab === 'members' && (
              <div className="bg-gray-800/50 backdrop-blur rounded-xl overflow-hidden border border-gray-700">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-900/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Member</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Verified</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Membership</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Expires</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-700/30 transition-colors">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm font-medium">{user.name || 'N/A'}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-400">{user.email}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.emailVerified
                                ? 'bg-green-900/50 text-green-400'
                                : 'bg-yellow-900/50 text-yellow-400'
                            }`}>
                              {user.emailVerified ? 'Yes' : 'No'}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.membership?.active
                                ? 'bg-green-900/50 text-green-400'
                                : 'bg-red-900/50 text-red-400'
                            }`}>
                              {user.membership?.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                            {user.membership?.expiresAt
                              ? new Date(user.membership.expiresAt).toLocaleDateString('sr-RS')
                              : 'N/A'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => updateMembership(user.id, 30)}
                                className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-xs transition-colors whitespace-nowrap"
                              >
                                +30 days
                              </button>
                              <button
                                onClick={() => updateMembership(user.id, 0)}
                                className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-xs transition-colors whitespace-nowrap"
                              >
                                Deactivate
                              </button>
                              <button
                                onClick={() => deleteUser(user.id)}
                                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs transition-colors whitespace-nowrap"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Check-ins Tab */}
            {activeTab === 'checkins' && (
              <div>
                <div className="mb-6 bg-gray-800/50 backdrop-blur rounded-xl p-4 border border-gray-700">
                  <label className="block text-sm font-medium mb-2">Select Date:</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div className="bg-gray-800/50 backdrop-blur rounded-xl overflow-hidden border border-gray-700">
                  <div className="p-4 bg-gray-900/50 border-b border-gray-700">
                    <h3 className="text-lg font-semibold">
                      Check-ins for {new Date(selectedDate).toLocaleDateString('sr-RS', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </h3>
                  </div>

                  {attendances.filter(a =>
                    (a.checkInTime || '').split('T')[0] === selectedDate
                  ).length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                      No check-ins recorded for this date
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-900/50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Time</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Member</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Method</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                          {attendances
                            .filter(a => (a.checkInTime || '').split('T')[0] === selectedDate)
                            .sort((a, b) => new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime())
                            .map((attendance) => (
                              <tr key={attendance.id} className="hover:bg-gray-700/30 transition-colors">
                                <td className="px-4 py-3 whitespace-nowrap text-sm">
                                  {new Date(attendance.checkInTime).toLocaleTimeString('sr-RS', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">
                                  {attendance.user?.name || 'N/A'}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">
                                  {attendance.user?.email || 'N/A'}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    attendance.qrCode
                                      ? 'bg-blue-900/50 text-blue-400'
                                      : 'bg-gray-700 text-gray-400'
                                  }`}>
                                    {attendance.qrCode ? 'QR' : 'MANUAL'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="p-4 bg-gray-900/50 border-t border-gray-700">
                    <p className="text-sm text-gray-400">
                      Total check-ins: <span className="font-semibold text-white">
                        {attendances.filter(a => (a.checkInTime || '').split('T')[0] === selectedDate).length}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
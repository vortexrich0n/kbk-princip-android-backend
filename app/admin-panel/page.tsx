'use client';
import { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, parseISO, isToday, differenceInDays } from 'date-fns';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  emailVerified: boolean;
  membership?: {
    id: string;
    type: string;
    active: boolean;
    expiresAt?: string;
    createdAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface CheckIn {
  id: string;
  userId: string;
  user: {
    name: string;
    email: string;
  };
  checkInTime: string;
  createdAt: string;
}

interface Statistics {
  totalUsers: number;
  activeMembers: number;
  expiredMembers: number;
  todayCheckIns: number;
  monthlyRevenue: number;
  weeklyCheckIns: number[];
  membershipDistribution: { name: string; value: number; percentage: number }[];
  revenueHistory: { month: string; revenue: number; members: number }[];
}

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [token, setToken] = useState('');

  // Data states
  const [users, setUsers] = useState<User[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState('7d');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Check for existing token
  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
      fetchAllData(savedToken);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();

        // Verify admin role
        if (data.user?.role !== 'ADMIN') {
          setLoginError('Pristup dozvoljen samo administratorima');
          setIsLoading(false);
          return;
        }

        setToken(data.token);
        localStorage.setItem('adminToken', data.token);
        setIsAuthenticated(true);
        fetchAllData(data.token);
      } else {
        const error = await response.json();
        setLoginError(error.message || 'Neuspešna prijava');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Greška prilikom povezivanja sa serverom');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken('');
    setIsAuthenticated(false);
    setUsers([]);
    setCheckIns([]);
    setStatistics(null);
  };

  const fetchAllData = async (authToken: string) => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchUsers(authToken),
        fetchCheckIns(authToken),
        fetchStatistics(authToken)
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const fetchUsers = async (authToken: string) => {
    try {
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchCheckIns = async (authToken: string) => {
    try {
      const response = await fetch('/api/checkins', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCheckIns(data);
      }
    } catch (error) {
      console.error('Error fetching check-ins:', error);
    }
  };

  const fetchStatistics = async (authToken: string) => {
    try {
      // Calculate statistics from users and check-ins data
      const usersResponse = await fetch('/api/users', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      const checkInsResponse = await fetch('/api/checkins', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      if (usersResponse.ok && checkInsResponse.ok) {
        const usersData: User[] = await usersResponse.json();
        const checkInsData: CheckIn[] = await checkInsResponse.json();

        // Calculate statistics
        const totalUsers = usersData.length;
        const activeMembers = usersData.filter(u => u.membership?.active).length;
        const expiredMembers = usersData.filter(u =>
          u.membership && !u.membership.active
        ).length;

        // Today's check-ins
        const todayCheckIns = checkInsData.filter(c =>
          isToday(parseISO(c.checkInTime))
        ).length;

        // Calculate monthly revenue (assuming 3000 RSD per active member)
        const monthlyRevenue = activeMembers * 3000;

        // Weekly check-ins for the last 7 days
        const weeklyCheckIns: number[] = [];
        for (let i = 6; i >= 0; i--) {
          const date = subDays(new Date(), i);
          const count = checkInsData.filter(c => {
            const checkInDate = parseISO(c.checkInTime);
            return format(checkInDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
          }).length;
          weeklyCheckIns.push(count);
        }

        // Membership distribution
        const membershipTypes: { [key: string]: number } = {
          'Aktivni': activeMembers,
          'Istekli': expiredMembers,
          'Bez članarine': totalUsers - activeMembers - expiredMembers
        };

        const membershipDistribution = Object.entries(membershipTypes).map(([name, value]) => ({
          name,
          value,
          percentage: totalUsers > 0 ? (value / totalUsers) * 100 : 0
        }));

        // Revenue history (last 6 months)
        const revenueHistory = [];
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Avg', 'Sep', 'Okt', 'Nov', 'Dec'];

        for (let i = 5; i >= 0; i--) {
          const date = subDays(new Date(), i * 30);
          const monthIndex = date.getMonth();
          const monthMembers = usersData.filter(u => {
            const createdDate = parseISO(u.createdAt);
            return createdDate <= date && u.membership?.active;
          }).length;

          revenueHistory.push({
            month: monthNames[monthIndex],
            revenue: monthMembers * 3000,
            members: monthMembers
          });
        }

        setStatistics({
          totalUsers,
          activeMembers,
          expiredMembers,
          todayCheckIns,
          monthlyRevenue,
          weeklyCheckIns,
          membershipDistribution,
          revenueHistory
        });
      }
    } catch (error) {
      console.error('Error calculating statistics:', error);
    }
  };

  const toggleMembershipStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          membership: {
            active: !currentStatus,
            expiresAt: !currentStatus
              ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
              : new Date().toISOString()
          }
        })
      });

      if (response.ok) {
        fetchAllData(token);
      }
    } catch (error) {
      console.error('Error updating membership:', error);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Da li ste sigurni da želite obrisati ovog korisnika?')) return;

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchAllData(token);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Filter users based on search
  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Chart colors
  const COLORS = ['#dc2626', '#16a34a', '#6b7280'];
  const CHART_COLORS = {
    primary: '#dc2626',
    secondary: '#fbbf24',
    tertiary: '#16a34a',
    background: 'rgba(220, 38, 38, 0.1)'
  };

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #000000 0%, #1a0000 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '20px',
          padding: '40px',
          maxWidth: '400px',
          width: '100%',
          border: '1px solid rgba(220, 38, 38, 0.3)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{
              color: '#fff',
              fontSize: '2rem',
              fontWeight: 'bold',
              marginBottom: '10px'
            }}>
              KBK PRINCIP
            </h1>
            <p style={{ color: '#999', fontSize: '1rem' }}>Admin Panel</p>
          </div>

          {loginError && (
            <div style={{
              background: 'rgba(220, 38, 38, 0.1)',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              borderRadius: '10px',
              padding: '12px',
              marginBottom: '20px',
              color: '#ef4444',
              fontSize: '0.9rem',
              textAlign: 'center'
            }}>
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                color: '#ccc',
                fontSize: '0.9rem',
                marginBottom: '8px'
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'rgba(220, 38, 38, 0.5)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{
                display: 'block',
                color: '#ccc',
                fontSize: '0.9rem',
                marginBottom: '8px'
              }}>
                Lozinka
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'rgba(220, 38, 38, 0.5)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '14px',
                background: isLoading ? '#666' : 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'transform 0.2s',
                opacity: isLoading ? 0.7 : 1
              }}
              onMouseEnter={e => !isLoading && ((e.target as HTMLButtonElement).style.transform = 'translateY(-2px)')}
              onMouseLeave={e => !isLoading && ((e.target as HTMLButtonElement).style.transform = 'translateY(0)')}
            >
              {isLoading ? 'Prijavljivanje...' : 'Prijavite se'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0000 100%)',
      color: '#fff'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.9)',
        borderBottom: '1px solid rgba(220, 38, 38, 0.3)',
        padding: '20px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h1 style={{
            fontSize: '1.8rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #dc2626 0%, #fbbf24 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            KBK PRINCIP Admin
          </h1>
          <button
            onClick={() => fetchAllData(token)}
            disabled={refreshing}
            style={{
              padding: '8px 16px',
              background: refreshing ? '#333' : 'rgba(220, 38, 38, 0.1)',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              borderRadius: '8px',
              color: refreshing ? '#666' : '#fff',
              cursor: refreshing ? 'not-allowed' : 'pointer',
              fontSize: '0.9rem',
              transition: 'all 0.3s'
            }}
          >
            {refreshing ? 'Osvežavanje...' : '🔄 Osveži'}
          </button>
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            background: 'rgba(220, 38, 38, 0.1)',
            border: '1px solid rgba(220, 38, 38, 0.3)',
            borderRadius: '10px',
            color: '#ef4444',
            cursor: 'pointer',
            fontSize: '0.95rem',
            transition: 'all 0.3s'
          }}
          onMouseEnter={e => {
            (e.target as HTMLElement).style.background = 'rgba(220, 38, 38, 0.2)';
          }}
          onMouseLeave={e => {
            (e.target as HTMLElement).style.background = 'rgba(220, 38, 38, 0.1)';
          }}
        >
          Odjavi se
        </button>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.5)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '0 30px',
        display: 'flex',
        gap: '10px'
      }}>
        {['dashboard', 'users', 'checkins', 'statistics'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '15px 25px',
              background: activeTab === tab ? 'rgba(220, 38, 38, 0.2)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid #dc2626' : '2px solid transparent',
              color: activeTab === tab ? '#fff' : '#999',
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: activeTab === tab ? 'bold' : 'normal',
              transition: 'all 0.3s',
              textTransform: 'capitalize'
            }}
          >
            {tab === 'dashboard' ? 'Kontrolna tabla' :
             tab === 'users' ? 'Korisnici' :
             tab === 'checkins' ? 'Prijave' :
             'Statistika'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: '30px' }}>
        {activeTab === 'dashboard' && statistics && (
          <div>
            {/* Stats Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              marginBottom: '30px'
            }}>
              {[
                { label: 'Ukupno korisnika', value: statistics.totalUsers, icon: '👥', color: '#3b82f6' },
                { label: 'Aktivni članovi', value: statistics.activeMembers, icon: '✅', color: '#16a34a' },
                { label: 'Danas prijavaljeni', value: statistics.todayCheckIns, icon: '📍', color: '#fbbf24' },
                { label: 'Mesečni prihod', value: `${statistics.monthlyRevenue.toLocaleString()} RSD`, icon: '💰', color: '#dc2626' }
              ].map((stat, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(0, 0, 0, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '15px',
                    padding: '25px',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'transform 0.3s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-5px)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  <div style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '-20px',
                    fontSize: '80px',
                    opacity: 0.1
                  }}>
                    {stat.icon}
                  </div>
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <p style={{ color: '#999', fontSize: '0.9rem', marginBottom: '8px' }}>
                      {stat.label}
                    </p>
                    <p style={{
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      color: stat.color,
                      margin: 0
                    }}>
                      {stat.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
              gap: '20px'
            }}>
              {/* Revenue Chart */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '15px',
                padding: '20px'
              }}>
                <h3 style={{ marginBottom: '20px', color: '#fff' }}>Prihodi po mesecima</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={statistics.revenueHistory}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="month" stroke="#999" />
                    <YAxis stroke="#999" />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(0,0,0,0.9)',
                        border: '1px solid rgba(220,38,38,0.3)',
                        borderRadius: '10px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#dc2626"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Membership Distribution */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '15px',
                padding: '20px'
              }}>
                <h3 style={{ marginBottom: '20px', color: '#fff' }}>Distribucija članstva</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statistics.membershipDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      label={({ name, percentage }: any) => `${name}: ${percentage.toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statistics.membershipDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(0,0,0,0.9)',
                        border: '1px solid rgba(220,38,38,0.3)',
                        borderRadius: '10px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            {/* Search and filters */}
            <div style={{
              marginBottom: '20px',
              display: 'flex',
              gap: '20px',
              alignItems: 'center'
            }}>
              <input
                type="text"
                placeholder="Pretraži korisnike..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
              <div style={{ color: '#999' }}>
                Ukupno: {filteredUsers.length} korisnika
              </div>
            </div>

            {/* Users Table */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '15px',
              overflow: 'hidden'
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr style={{
                    background: 'rgba(220, 38, 38, 0.1)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <th style={{ padding: '15px', textAlign: 'left' }}>Ime</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>Email</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>Telefon</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>Status</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>Članarina</th>
                    <th style={{ padding: '15px', textAlign: 'center' }}>Akcije</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user) => (
                    <tr
                      key={user.id}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        transition: 'background 0.3s'
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '15px' }}>
                        <div>
                          <div style={{ fontWeight: 'bold' }}>{user.name || 'N/A'}</div>
                          <div style={{ fontSize: '0.85rem', color: '#999' }}>
                            {user.role === 'ADMIN' ? '👑 Admin' : '👤 Korisnik'}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '15px' }}>
                        <div>
                          {user.email}
                          {user.emailVerified && (
                            <span style={{ color: '#16a34a', marginLeft: '5px' }}>✓</span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '15px' }}>{user.phone || 'N/A'}</td>
                      <td style={{ padding: '15px' }}>
                        <span style={{
                          padding: '5px 10px',
                          borderRadius: '20px',
                          fontSize: '0.85rem',
                          background: user.membership?.active
                            ? 'rgba(16, 163, 74, 0.2)'
                            : 'rgba(239, 68, 68, 0.2)',
                          color: user.membership?.active ? '#16a34a' : '#ef4444',
                          border: `1px solid ${user.membership?.active ? '#16a34a' : '#ef4444'}`
                        }}>
                          {user.membership?.active ? 'Aktivan' : 'Neaktivan'}
                        </span>
                      </td>
                      <td style={{ padding: '15px' }}>
                        {user.membership?.expiresAt ? (
                          <div>
                            <div>Ističe: {format(parseISO(user.membership.expiresAt), 'dd.MM.yyyy')}</div>
                            <div style={{ fontSize: '0.85rem', color: '#999' }}>
                              {differenceInDays(parseISO(user.membership.expiresAt), new Date())} dana
                            </div>
                          </div>
                        ) : (
                          'Nema članarine'
                        )}
                      </td>
                      <td style={{ padding: '15px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                          <button
                            onClick={() => toggleMembershipStatus(user.id, user.membership?.active || false)}
                            style={{
                              padding: '6px 12px',
                              background: 'rgba(251, 191, 36, 0.1)',
                              border: '1px solid rgba(251, 191, 36, 0.3)',
                              borderRadius: '6px',
                              color: '#fbbf24',
                              cursor: 'pointer',
                              fontSize: '0.85rem'
                            }}
                            onMouseEnter={e => {
                              (e.target as HTMLElement).style.background = 'rgba(251, 191, 36, 0.2)';
                            }}
                            onMouseLeave={e => {
                              (e.target as HTMLElement).style.background = 'rgba(251, 191, 36, 0.1)';
                            }}
                          >
                            {user.membership?.active ? 'Deaktiviraj' : 'Aktiviraj'}
                          </button>
                          {user.role !== 'ADMIN' && (
                            <button
                              onClick={() => deleteUser(user.id)}
                              style={{
                                padding: '6px 12px',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: '6px',
                                color: '#ef4444',
                                cursor: 'pointer',
                                fontSize: '0.85rem'
                              }}
                              onMouseEnter={e => {
                                (e.target as HTMLElement).style.background = 'rgba(239, 68, 68, 0.2)';
                              }}
                              onMouseLeave={e => {
                                (e.target as HTMLElement).style.background = 'rgba(239, 68, 68, 0.1)';
                              }}
                            >
                              Obriši
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{
                  padding: '20px',
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '10px'
                }}>
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    style={{
                      padding: '8px 15px',
                      background: currentPage === 1 ? '#333' : 'rgba(220, 38, 38, 0.1)',
                      border: '1px solid rgba(220, 38, 38, 0.3)',
                      borderRadius: '8px',
                      color: currentPage === 1 ? '#666' : '#fff',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Prethodna
                  </button>
                  <span style={{ padding: '8px 15px', color: '#999' }}>
                    Strana {currentPage} od {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: '8px 15px',
                      background: currentPage === totalPages ? '#333' : 'rgba(220, 38, 38, 0.1)',
                      border: '1px solid rgba(220, 38, 38, 0.3)',
                      borderRadius: '8px',
                      color: currentPage === totalPages ? '#666' : '#fff',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Sledeća
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'checkins' && (
          <div>
            <h2 style={{ marginBottom: '20px' }}>Današnje prijave</h2>
            <div style={{
              background: 'rgba(0, 0, 0, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '15px',
              overflow: 'hidden'
            }}>
              {checkIns.filter(c => isToday(parseISO(c.checkInTime))).length === 0 ? (
                <div style={{
                  padding: '40px',
                  textAlign: 'center',
                  color: '#999'
                }}>
                  Nema prijava za danas
                </div>
              ) : (
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse'
                }}>
                  <thead>
                    <tr style={{
                      background: 'rgba(220, 38, 38, 0.1)',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <th style={{ padding: '15px', textAlign: 'left' }}>Vreme</th>
                      <th style={{ padding: '15px', textAlign: 'left' }}>Ime</th>
                      <th style={{ padding: '15px', textAlign: 'left' }}>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {checkIns
                      .filter(c => isToday(parseISO(c.checkInTime)))
                      .sort((a, b) => new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime())
                      .map((checkIn) => (
                        <tr
                          key={checkIn.id}
                          style={{
                            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                            transition: 'background 0.3s'
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          <td style={{ padding: '15px' }}>
                            {format(parseISO(checkIn.checkInTime), 'HH:mm')}
                          </td>
                          <td style={{ padding: '15px' }}>{checkIn.user.name}</td>
                          <td style={{ padding: '15px' }}>{checkIn.user.email}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Weekly Check-ins Chart */}
            <div style={{
              marginTop: '30px',
              background: 'rgba(0, 0, 0, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '15px',
              padding: '20px'
            }}>
              <h3 style={{ marginBottom: '20px' }}>Nedeljne prijave</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statistics?.weeklyCheckIns.map((count, index) => ({
                  day: ['Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub', 'Ned'][new Date(subDays(new Date(), 6 - index)).getDay()],
                  count
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="day" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(0,0,0,0.9)',
                      border: '1px solid rgba(220,38,38,0.3)',
                      borderRadius: '10px'
                    }}
                  />
                  <Bar dataKey="count" fill="#dc2626" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'statistics' && statistics && (
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
              gap: '20px'
            }}>
              {/* Members Growth */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '15px',
                padding: '20px'
              }}>
                <h3 style={{ marginBottom: '20px' }}>Rast članstva</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={statistics.revenueHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="month" stroke="#999" />
                    <YAxis stroke="#999" />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(0,0,0,0.9)',
                        border: '1px solid rgba(220,38,38,0.3)',
                        borderRadius: '10px'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="members"
                      stroke="#fbbf24"
                      strokeWidth={2}
                      dot={{ fill: '#fbbf24', r: 6 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Quick Stats */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '15px',
                padding: '20px'
              }}>
                <h3 style={{ marginBottom: '20px' }}>Brza statistika</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={{
                    padding: '15px',
                    background: 'rgba(220, 38, 38, 0.1)',
                    borderRadius: '10px',
                    border: '1px solid rgba(220, 38, 38, 0.3)'
                  }}>
                    <div style={{ color: '#999', fontSize: '0.9rem' }}>Prosečna dnevna posećenost</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626' }}>
                      {(statistics.weeklyCheckIns.reduce((a, b) => a + b, 0) / 7).toFixed(1)} korisnika
                    </div>
                  </div>
                  <div style={{
                    padding: '15px',
                    background: 'rgba(16, 163, 74, 0.1)',
                    borderRadius: '10px',
                    border: '1px solid rgba(16, 163, 74, 0.3)'
                  }}>
                    <div style={{ color: '#999', fontSize: '0.9rem' }}>Stopa zadržavanja</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#16a34a' }}>
                      {((statistics.activeMembers / statistics.totalUsers) * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div style={{
                    padding: '15px',
                    background: 'rgba(251, 191, 36, 0.1)',
                    borderRadius: '10px',
                    border: '1px solid rgba(251, 191, 36, 0.3)'
                  }}>
                    <div style={{ color: '#999', fontSize: '0.9rem' }}>Prosečna vrednost člana</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fbbf24' }}>
                      3,000 RSD/mesec
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
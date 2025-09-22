'use client';
import { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { format, subDays, parseISO, isToday, differenceInDays, isValid } from 'date-fns';

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
  const [groupedCheckIns, setGroupedCheckIns] = useState<Record<string, {
    user: { id: string; name: string | null; email: string };
    checkins: Array<{ id: string; checkInTime: Date; qrCode: string | null }>;
    count: number;
    firstCheckIn: Date;
    lastCheckIn: Date;
  }>>({});
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Loading states for individual actions
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);
  const [deletingUser, setDeletingUser] = useState<string | null>(null);

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

  const fetchAllData = useCallback(async (authToken: string) => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchUsers(authToken),
        fetchCheckIns(authToken, selectedDate),
        fetchStatistics(authToken)
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setRefreshing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const fetchUsers = async (authToken: string) => {
    try {
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Ensure data is an array
        const usersArray = Array.isArray(data) ? data :
                          (data?.users ? data.users : []);
        setUsers(usersArray);
      } else {
        console.error('Failed to fetch users:', response.status);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  const fetchCheckIns = async (authToken: string, date?: string) => {
    try {
      const url = date
        ? `/api/checkins?admin=true&date=${date}`
        : '/api/checkins?admin=true';

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();

        // Handle admin response format
        if (data?.attendances) {
          setCheckIns(data.attendances);
          setGroupedCheckIns(data.groupedByUser || {});
        }
        // Handle regular user format (fallback)
        else if (Array.isArray(data)) {
          setCheckIns(data);
          setGroupedCheckIns({});
        }
        // Handle old format
        else if (data?.checkIns) {
          setCheckIns(data.checkIns);
          setGroupedCheckIns({});
        } else {
          setCheckIns([]);
          setGroupedCheckIns({});
        }
      } else {
        console.error('Failed to fetch check-ins:', response.status);
        setCheckIns([]);
        setGroupedCheckIns({});
      }
    } catch (error) {
      console.error('Error fetching check-ins:', error);
      setCheckIns([]);
      setGroupedCheckIns({});
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
        const usersRawData = await usersResponse.json();
        const checkInsRawData = await checkInsResponse.json();

        // Ensure data is arrays
        const usersData: User[] = Array.isArray(usersRawData) ? usersRawData :
                                  (usersRawData?.users ? usersRawData.users : []);
        const checkInsData: CheckIn[] = Array.isArray(checkInsRawData) ? checkInsRawData :
                                        (checkInsRawData?.checkIns ? checkInsRawData.checkIns : []);

        // Validate arrays before using
        if (!Array.isArray(usersData) || !Array.isArray(checkInsData)) {
          console.error('Invalid data format received from API');
          setStatistics({
            totalUsers: 0,
            activeMembers: 0,
            expiredMembers: 0,
            todayCheckIns: 0,
            monthlyRevenue: 0,
            weeklyCheckIns: [0, 0, 0, 0, 0, 0, 0],
            membershipDistribution: [],
            revenueHistory: []
          });
          return;
        }

        // Calculate statistics
        const totalUsers = usersData.length;
        const activeMembers = usersData.filter(u => u.membership?.active).length;
        const expiredMembers = usersData.filter(u =>
          u.membership && !u.membership.active
        ).length;

        // Today's check-ins with safe date parsing
        const todayCheckIns = checkInsData.filter(c => {
          try {
            if (!c.checkInTime) return false;
            const date = parseISO(c.checkInTime);
            return isValid(date) && isToday(date);
          } catch {
            return false;
          }
        }).length;

        // Calculate monthly revenue (assuming 3000 RSD per active member)
        const monthlyRevenue = activeMembers * 3000;

        // Weekly check-ins for the last 7 days
        const weeklyCheckIns: number[] = [];
        for (let i = 6; i >= 0; i--) {
          const date = subDays(new Date(), i);
          const count = checkInsData.filter(c => {
            try {
              if (!c.checkInTime) return false;
              const checkInDate = parseISO(c.checkInTime);
              return isValid(checkInDate) && format(checkInDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
            } catch {
              return false;
            }
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
            try {
              if (!u.createdAt) return false;
              const createdDate = parseISO(u.createdAt);
              return isValid(createdDate) && createdDate <= date && u.membership?.active;
            } catch {
              return false;
            }
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
    setUpdatingUser(userId);
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          active: !currentStatus,
          expiresAt: !currentStatus
            ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            : new Date().toISOString(),
          type: 'STANDARD'
        })
      });

      if (response.ok) {
        await fetchAllData(token);
      } else {
        const error = await response.json();
        console.error('Error updating membership:', error);
        alert('Greška pri ažuriranju članarine: ' + (error.error || 'Nepoznata greška'));
      }
    } catch (error) {
      console.error('Error updating membership:', error);
      alert('Greška pri ažuriranju članarine');
    } finally {
      setUpdatingUser(null);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Da li ste sigurni da želite obrisati ovog korisnika?')) return;

    setDeletingUser(userId);
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchAllData(token);
      } else {
        const error = await response.json();
        alert('Greška pri brisanju korisnika: ' + (error.error || 'Nepoznata greška'));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Greška pri brisanju korisnika');
    } finally {
      setDeletingUser(null);
    }
  };

  // Safe date formatting function
  const safeFormatDate = (dateString: string | undefined, formatStr: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) return 'N/A';
      return format(date, formatStr);
    } catch {
      return 'N/A';
    }
  };


  // Filter users based on search (with safety check)
  const filteredUsers = Array.isArray(users) ? users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Chart colors
  const COLORS = ['#dc2626', '#16a34a', '#6b7280'];

  // Styles
  const styles = {
    fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
    mobileBreakpoint: '@media (max-width: 768px)'
  };

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #000000 0%, #1a0000 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: styles.fontFamily
      }}>
        <div style={{
          background: 'rgba(0, 0, 0, 0.9)',
          borderRadius: '24px',
          padding: '40px',
          maxWidth: '420px',
          width: '100%',
          border: '1px solid rgba(220, 38, 38, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '35px' }}>
            <h1 style={{
              color: '#fff',
              fontSize: '2.25rem',
              fontWeight: '700',
              marginBottom: '8px',
              letterSpacing: '-0.025em'
            }}>
              KBK PRINCIP
            </h1>
            <p style={{ color: '#9ca3af', fontSize: '1rem', fontWeight: '500' }}>Admin Panel</p>
          </div>

          {loginError && (
            <div style={{
              background: 'rgba(220, 38, 38, 0.1)',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              borderRadius: '12px',
              padding: '14px',
              marginBottom: '24px',
              color: '#ef4444',
              fontSize: '0.9rem',
              textAlign: 'center',
              fontWeight: '500'
            }}>
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                color: '#d1d5db',
                fontSize: '0.875rem',
                marginBottom: '8px',
                fontWeight: '500'
              }}>
                Email adresa
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.3s',
                  fontFamily: styles.fontFamily
                }}
                onFocus={(e) => e.target.style.borderColor = 'rgba(220, 38, 38, 0.5)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
              />
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                color: '#d1d5db',
                fontSize: '0.875rem',
                marginBottom: '8px',
                fontWeight: '500'
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
                  padding: '12px 16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.3s',
                  fontFamily: styles.fontFamily
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
                background: isLoading ? '#4b5563' : 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                opacity: isLoading ? 0.7 : 1,
                transform: 'translateY(0)',
                letterSpacing: '-0.01em'
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
      color: '#fff',
      fontFamily: styles.fontFamily
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.95)',
        borderBottom: '1px solid rgba(220, 38, 38, 0.3)',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #dc2626 0%, #fbbf24 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.025em'
          }}>
            KBK PRINCIP Admin
          </h1>
          <button
            onClick={() => fetchAllData(token)}
            disabled={refreshing}
            style={{
              padding: '8px 16px',
              background: refreshing ? '#374151' : 'rgba(220, 38, 38, 0.1)',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              borderRadius: '8px',
              color: refreshing ? '#6b7280' : '#fff',
              cursor: refreshing ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'all 0.3s'
            }}
          >
            {refreshing ? 'Osvežavanje...' : '↻ Osveži'}
          </button>
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: '8px 16px',
            background: 'rgba(220, 38, 38, 0.1)',
            border: '1px solid rgba(220, 38, 38, 0.3)',
            borderRadius: '8px',
            color: '#ef4444',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500',
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
        background: 'rgba(0, 0, 0, 0.6)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '0 24px',
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}>
        {['dashboard', 'users', 'checkins', 'statistics'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '14px 24px',
              background: activeTab === tab ? 'rgba(220, 38, 38, 0.2)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid #dc2626' : '2px solid transparent',
              color: activeTab === tab ? '#fff' : '#9ca3af',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: activeTab === tab ? '600' : '500',
              transition: 'all 0.3s',
              whiteSpace: 'nowrap',
              letterSpacing: '-0.01em'
            }}
          >
            {tab === 'dashboard' ? '📊 Kontrolna tabla' :
             tab === 'users' ? '👥 Korisnici' :
             tab === 'checkins' ? '📍 Prijave' :
             '📈 Statistika'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: '24px' }}>
        {activeTab === 'dashboard' && statistics && (
          <div>
            {/* Stats Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
              marginBottom: '32px'
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
                    background: 'rgba(0, 0, 0, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '24px',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s',
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
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
                    <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '8px', fontWeight: '500' }}>
                      {stat.label}
                    </p>
                    <p style={{
                      fontSize: '2rem',
                      fontWeight: '700',
                      color: stat.color,
                      margin: 0,
                      letterSpacing: '-0.025em'
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
              gridTemplateColumns: window.innerWidth > 768 ? 'repeat(2, 1fr)' : '1fr',
              gap: '20px'
            }}>
              {/* Revenue Chart */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '24px',
                backdropFilter: 'blur(10px)'
              }}>
                <h3 style={{ marginBottom: '20px', fontSize: '1.125rem', fontWeight: '600' }}>Prihodi po mesecima</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={statistics.revenueHistory}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(0,0,0,0.9)',
                        border: '1px solid rgba(220,38,38,0.3)',
                        borderRadius: '12px',
                        padding: '12px'
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
                background: 'rgba(0, 0, 0, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '24px',
                backdropFilter: 'blur(10px)'
              }}>
                <h3 style={{ marginBottom: '20px', fontSize: '1.125rem', fontWeight: '600' }}>Distribucija članstva</h3>
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
                      {statistics.membershipDistribution && Array.isArray(statistics.membershipDistribution) &&
                       statistics.membershipDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(0,0,0,0.9)',
                        border: '1px solid rgba(220,38,38,0.3)',
                        borderRadius: '12px',
                        padding: '12px'
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
              marginBottom: '24px',
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              <input
                type="text"
                placeholder="Pretraži korisnike..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: '200px',
                  padding: '12px 16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '0.875rem',
                  outline: 'none',
                  fontFamily: styles.fontFamily
                }}
              />
              <div style={{ color: '#9ca3af', fontSize: '0.875rem', fontWeight: '500' }}>
                Ukupno: {filteredUsers.length} korisnika
              </div>
            </div>

            {/* Users Table */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              overflow: 'auto',
              backdropFilter: 'blur(10px)'
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                minWidth: '700px'
              }}>
                <thead>
                  <tr style={{
                    background: 'rgba(220, 38, 38, 0.1)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600' }}>Ime</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600' }}>Email</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600' }}>Telefon</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600' }}>Status</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600' }}>Članarina</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600' }}>Akcije</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(currentUsers) && currentUsers.map((user) => (
                    <tr
                      key={user.id}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        transition: 'background 0.3s'
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '16px' }}>
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{user.name || 'N/A'}</div>
                          <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '2px' }}>
                            {user.role === 'ADMIN' ? '👑 Admin' : '👤 Korisnik'}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px', fontSize: '0.875rem' }}>
                        <div>
                          {user.email}
                          {user.emailVerified && (
                            <span style={{ color: '#16a34a', marginLeft: '6px' }}>✓</span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '16px', fontSize: '0.875rem' }}>{user.phone || 'N/A'}</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          background: user.membership?.active
                            ? 'rgba(16, 163, 74, 0.2)'
                            : 'rgba(239, 68, 68, 0.2)',
                          color: user.membership?.active ? '#16a34a' : '#ef4444',
                          border: `1px solid ${user.membership?.active ? '#16a34a' : '#ef4444'}`
                        }}>
                          {user.membership?.active ? 'Aktivan' : 'Neaktivan'}
                        </span>
                      </td>
                      <td style={{ padding: '16px', fontSize: '0.875rem' }}>
                        {user.membership?.expiresAt ? (
                          <div>
                            <div>Ističe: {safeFormatDate(user.membership.expiresAt, 'dd.MM.yyyy')}</div>
                            <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                              {(() => {
                                try {
                                  const days = differenceInDays(parseISO(user.membership.expiresAt), new Date());
                                  return `${days} dana`;
                                } catch {
                                  return 'N/A';
                                }
                              })()}
                            </div>
                          </div>
                        ) : (
                          'Nema članarine'
                        )}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button
                            onClick={() => toggleMembershipStatus(user.id, user.membership?.active || false)}
                            disabled={updatingUser === user.id}
                            style={{
                              padding: '6px 12px',
                              background: updatingUser === user.id ? '#374151' : 'rgba(251, 191, 36, 0.1)',
                              border: '1px solid rgba(251, 191, 36, 0.3)',
                              borderRadius: '8px',
                              color: updatingUser === user.id ? '#6b7280' : '#fbbf24',
                              cursor: updatingUser === user.id ? 'not-allowed' : 'pointer',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              transition: 'all 0.3s'
                            }}
                            onMouseEnter={e => {
                              if (updatingUser !== user.id) {
                                (e.target as HTMLElement).style.background = 'rgba(251, 191, 36, 0.2)';
                              }
                            }}
                            onMouseLeave={e => {
                              if (updatingUser !== user.id) {
                                (e.target as HTMLElement).style.background = 'rgba(251, 191, 36, 0.1)';
                              }
                            }}
                          >
                            {updatingUser === user.id ? '...' : (user.membership?.active ? 'Deaktiviraj' : 'Aktiviraj')}
                          </button>
                          {user.role !== 'ADMIN' && (
                            <button
                              onClick={() => deleteUser(user.id)}
                              disabled={deletingUser === user.id}
                              style={{
                                padding: '6px 12px',
                                background: deletingUser === user.id ? '#374151' : 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: '8px',
                                color: deletingUser === user.id ? '#6b7280' : '#ef4444',
                                cursor: deletingUser === user.id ? 'not-allowed' : 'pointer',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                transition: 'all 0.3s'
                              }}
                              onMouseEnter={e => {
                                if (deletingUser !== user.id) {
                                  (e.target as HTMLElement).style.background = 'rgba(239, 68, 68, 0.2)';
                                }
                              }}
                              onMouseLeave={e => {
                                if (deletingUser !== user.id) {
                                  (e.target as HTMLElement).style.background = 'rgba(239, 68, 68, 0.1)';
                                }
                              }}
                            >
                              {deletingUser === user.id ? '...' : 'Obriši'}
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
                  gap: '8px',
                  flexWrap: 'wrap'
                }}>
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    style={{
                      padding: '8px 16px',
                      background: currentPage === 1 ? '#374151' : 'rgba(220, 38, 38, 0.1)',
                      border: '1px solid rgba(220, 38, 38, 0.3)',
                      borderRadius: '8px',
                      color: currentPage === 1 ? '#6b7280' : '#fff',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}
                  >
                    Prethodna
                  </button>
                  <span style={{ padding: '8px 16px', color: '#9ca3af', fontSize: '0.875rem' }}>
                    Strana {currentPage} od {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: '8px 16px',
                      background: currentPage === totalPages ? '#374151' : 'rgba(220, 38, 38, 0.1)',
                      border: '1px solid rgba(220, 38, 38, 0.3)',
                      borderRadius: '8px',
                      color: currentPage === totalPages ? '#6b7280' : '#fff',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500'
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
            {/* Date Selector */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                color: '#9ca3af',
                fontSize: '0.875rem',
                marginBottom: '8px',
                fontWeight: '500'
              }}>
                Izaberite datum
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={async (e) => {
                  setSelectedDate(e.target.value);
                  const token = localStorage.getItem('adminToken');
                  if (token) {
                    await fetchCheckIns(token, e.target.value);
                  }
                }}
                max={format(new Date(), 'yyyy-MM-dd')}
                style={{
                  padding: '12px 16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '0.875rem',
                  outline: 'none',
                  fontFamily: styles.fontFamily
                }}
              />
            </div>

            <h2 style={{ marginBottom: '20px', fontSize: '1.25rem', fontWeight: '600' }}>
              Prijave za {safeFormatDate(selectedDate, 'dd.MM.yyyy')}
            </h2>

            {/* Summary Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: window.innerWidth > 768 ? 'repeat(3, 1fr)' : '1fr',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div style={{
                background: 'rgba(0, 0, 0, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '20px',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '8px' }}>
                  Ukupno prijava
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#dc2626' }}>
                  {checkIns.length}
                </div>
              </div>
              <div style={{
                background: 'rgba(0, 0, 0, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '20px',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '8px' }}>
                  Jedinstvenih korisnika
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#dc2626' }}>
                  {Object.keys(groupedCheckIns).length}
                </div>
              </div>
              <div style={{
                background: 'rgba(0, 0, 0, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '20px',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '8px' }}>
                  Prosek po korisniku
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#dc2626' }}>
                  {Object.keys(groupedCheckIns).length > 0
                    ? (checkIns.length / Object.keys(groupedCheckIns).length).toFixed(1)
                    : '0'}
                </div>
              </div>
            </div>

            {/* Grouped Check-ins by User */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              overflow: 'hidden',
              backdropFilter: 'blur(10px)',
              marginBottom: '24px'
            }}>
              <div style={{
                background: 'rgba(220, 38, 38, 0.1)',
                padding: '16px 24px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                  Prijave po korisniku
                </h3>
              </div>
              {Object.keys(groupedCheckIns).length === 0 ? (
                <div style={{
                  padding: '48px',
                  textAlign: 'center',
                  color: '#9ca3af',
                  fontSize: '0.875rem'
                }}>
                  Nema prijava za izabrani datum
                </div>
              ) : (
                <div style={{ padding: '16px' }}>
                  {Object.values(groupedCheckIns)
                    .sort((a, b) => b.count - a.count)
                    .map((group) => (
                      <div
                        key={group.user.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '16px',
                          marginBottom: '12px',
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          borderRadius: '12px',
                          transition: 'all 0.3s'
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget.style.background = 'rgba(255,255,255,0.05)');
                          (e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.3)');
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget.style.background = 'rgba(255,255,255,0.02)');
                          (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)');
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '4px' }}>
                            {group.user.name || 'N/A'}
                          </div>
                          <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                            {group.user.email}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '8px' }}>
                            Prvi check-in: {safeFormatDate(group.firstCheckIn.toString(), 'HH:mm')} |
                            Poslednji: {safeFormatDate(group.lastCheckIn.toString(), 'HH:mm')}
                          </div>
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px'
                        }}>
                          <div style={{
                            padding: '8px 16px',
                            background: 'rgba(220, 38, 38, 0.1)',
                            border: '1px solid rgba(220, 38, 38, 0.3)',
                            borderRadius: '8px',
                            fontSize: '1.25rem',
                            fontWeight: '700',
                            color: '#dc2626'
                          }}>
                            {group.count}
                          </div>
                          <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                            check-in{group.count > 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Weekly Check-ins Chart */}
            <div style={{
              marginTop: '32px',
              background: 'rgba(0, 0, 0, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '24px',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{ marginBottom: '20px', fontSize: '1.125rem', fontWeight: '600' }}>Nedeljne prijave</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statistics?.weeklyCheckIns && Array.isArray(statistics.weeklyCheckIns) ?
                  statistics.weeklyCheckIns.map((count, index) => ({
                    day: ['Ned', 'Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub'][new Date(subDays(new Date(), 6 - index)).getDay()],
                    count
                  })) : []
                }>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="day" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(0,0,0,0.9)',
                      border: '1px solid rgba(220,38,38,0.3)',
                      borderRadius: '12px',
                      padding: '12px'
                    }}
                  />
                  <Bar dataKey="count" fill="#dc2626" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'statistics' && statistics && (
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: window.innerWidth > 768 ? 'repeat(2, 1fr)' : '1fr',
              gap: '20px'
            }}>
              {/* Members Growth */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '24px',
                backdropFilter: 'blur(10px)'
              }}>
                <h3 style={{ marginBottom: '20px', fontSize: '1.125rem', fontWeight: '600' }}>Rast članstva</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={statistics.revenueHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(0,0,0,0.9)',
                        border: '1px solid rgba(220,38,38,0.3)',
                        borderRadius: '12px',
                        padding: '12px'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="members"
                      stroke="#fbbf24"
                      strokeWidth={3}
                      dot={{ fill: '#fbbf24', r: 6 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Quick Stats */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '24px',
                backdropFilter: 'blur(10px)'
              }}>
                <h3 style={{ marginBottom: '20px', fontSize: '1.125rem', fontWeight: '600' }}>Brza statistika</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{
                    padding: '16px',
                    background: 'rgba(220, 38, 38, 0.1)',
                    borderRadius: '12px',
                    border: '1px solid rgba(220, 38, 38, 0.3)'
                  }}>
                    <div style={{ color: '#9ca3af', fontSize: '0.875rem', fontWeight: '500' }}>Prosečna dnevna posećenost</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#dc2626', letterSpacing: '-0.025em' }}>
                      {Array.isArray(statistics.weeklyCheckIns) ? (statistics.weeklyCheckIns.reduce((a, b) => a + b, 0) / 7).toFixed(1) : '0'} korisnika
                    </div>
                  </div>
                  <div style={{
                    padding: '16px',
                    background: 'rgba(16, 163, 74, 0.1)',
                    borderRadius: '12px',
                    border: '1px solid rgba(16, 163, 74, 0.3)'
                  }}>
                    <div style={{ color: '#9ca3af', fontSize: '0.875rem', fontWeight: '500' }}>Stopa zadržavanja</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#16a34a', letterSpacing: '-0.025em' }}>
                      {statistics.totalUsers > 0 ? ((statistics.activeMembers / statistics.totalUsers) * 100).toFixed(0) : '0'}%
                    </div>
                  </div>
                  <div style={{
                    padding: '16px',
                    background: 'rgba(251, 191, 36, 0.1)',
                    borderRadius: '12px',
                    border: '1px solid rgba(251, 191, 36, 0.3)'
                  }}>
                    <div style={{ color: '#9ca3af', fontSize: '0.875rem', fontWeight: '500' }}>Prosečna vrednost člana</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fbbf24', letterSpacing: '-0.025em' }}>
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
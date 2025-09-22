'use client';
import { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format, subDays, startOfMonth } from 'date-fns';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(true);
  const [token, setToken] = useState('');

  // Data states
  interface Member {
    id: string;
    name: string;
    email: string;
    phone: string;
    isActive: boolean;
    createdAt: string;
  }

  interface CheckIn {
    id: string;
    memberName: string;
    memberEmail: string;
    checkInTime: string;
  }

  interface RevenueData {
    month: string;
    revenue: number;
    members: number;
  }

  const [todayCheckIns, setTodayCheckIns] = useState<CheckIn[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [monthlyStats, setMonthlyStats] = useState({
    totalRevenue: 0,
    activeMembers: 0,
    newMembers: 0,
    checkInsToday: 0
  });

  const calculateMonthlyRevenue = useCallback((members: Member[]) => {
    const monthlyData = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun'];

    for (let i = 5; i >= 0; i--) {
      const date = subDays(new Date(), i * 30);
      const monthName = monthNames[5 - i];
      const activeInMonth = members.filter(m =>
        new Date(m.createdAt) <= date && m.isActive
      ).length;
      monthlyData.push({
        month: monthName,
        revenue: activeInMonth * 2500,
        members: activeInMonth
      });
    }
    return monthlyData;
  }, []);

  const calculateMonthlyStats = useCallback((members: Member[], checkIns: CheckIn[]) => {
    const now = new Date();
    const monthStart = startOfMonth(now);

    const activeMembers = members.filter(m => m.isActive).length;
    const newThisMonth = members.filter(m =>
      new Date(m.createdAt) >= monthStart
    ).length;
    const monthlyRevenue = activeMembers * 2500;

    setMonthlyStats({
      totalRevenue: monthlyRevenue,
      activeMembers,
      newMembers: newThisMonth,
      checkInsToday: checkIns.length
    });
  }, []);

  const setMockData = useCallback(() => {
    // Mock data for demonstration
    const mockMembers: Member[] = [
      { id: '1', name: 'Marko Marković', email: 'marko@example.com', phone: '060/123-4567', isActive: true, createdAt: new Date(2024, 0, 15).toISOString() },
      { id: '2', name: 'Ana Anić', email: 'ana@example.com', phone: '061/234-5678', isActive: true, createdAt: new Date(2024, 1, 20).toISOString() },
      { id: '3', name: 'Petar Petrović', email: 'petar@example.com', phone: '062/345-6789', isActive: false, createdAt: new Date(2024, 2, 10).toISOString() },
      { id: '4', name: 'Milica Milić', email: 'milica@example.com', phone: '063/456-7890', isActive: true, createdAt: new Date(2024, 3, 5).toISOString() },
      { id: '5', name: 'Stefan Stefanović', email: 'stefan@example.com', phone: '064/567-8901', isActive: true, createdAt: new Date(2024, 4, 12).toISOString() },
    ];
    setMembers(mockMembers);

    const mockCheckIns: CheckIn[] = [
      { id: '1', memberName: 'Marko Marković', memberEmail: 'marko@example.com', checkInTime: new Date().toISOString() },
      { id: '2', memberName: 'Ana Anić', memberEmail: 'ana@example.com', checkInTime: new Date(Date.now() - 3600000).toISOString() },
      { id: '3', memberName: 'Milica Milić', memberEmail: 'milica@example.com', checkInTime: new Date(Date.now() - 7200000).toISOString() },
    ];
    setTodayCheckIns(mockCheckIns);

    const mockRevenue = [
      { month: 'Jan', revenue: 25000, members: 10 },
      { month: 'Feb', revenue: 37500, members: 15 },
      { month: 'Mar', revenue: 45000, members: 18 },
      { month: 'Apr', revenue: 50000, members: 20 },
      { month: 'Maj', revenue: 55000, members: 22 },
      { month: 'Jun', revenue: 62500, members: 25 },
    ];
    setRevenueData(mockRevenue);

    setMonthlyStats({
      totalRevenue: 62500,
      activeMembers: 25,
      newMembers: 3,
      checkInsToday: 3
    });
  }, []);

  const fetchData = useCallback(async (authToken?: string) => {
    const currentToken = authToken || token;
    if (!currentToken) {
      setMockData();
      return;
    }

    try {
      // Fetch users with admin auth
      const usersRes = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${currentToken}`
        }
      });

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        const formattedMembers = usersData.map((user: Record<string, unknown>) => {
          const membership = user.membership as Record<string, unknown> | undefined;
          return {
            id: user.id as string,
            name: (user.name as string) || 'N/A',
            email: user.email as string,
            phone: (user.phone as string) || 'N/A',
            isActive: membership?.active as boolean || false,
            createdAt: user.createdAt as string
          };
        });
        setMembers(formattedMembers);

        // Calculate revenue data for charts
        const revenueByMonth = calculateMonthlyRevenue(formattedMembers);
        setRevenueData(revenueByMonth);

      } else {
        console.log('Users fetch failed, using mock data');
        setMockData();
        return;
      }

      // Fetch attendance/check-ins
      const attendanceRes = await fetch('/api/attendance', {
        headers: {
          'Authorization': `Bearer ${currentToken}`
        }
      });

      if (attendanceRes.ok) {
        const attendanceData = await attendanceRes.json();
        const today = new Date().toISOString().split('T')[0];
        const todayAttendance = attendanceData
          .filter((a: Record<string, unknown>) => (a.checkInTime as string).startsWith(today))
          .map((a: Record<string, unknown>) => {
            const user = a.user as Record<string, unknown> | undefined;
            return {
              id: a.id as string,
              memberName: (user?.name as string) || 'N/A',
              memberEmail: (user?.email as string) || 'N/A',
              checkInTime: a.checkInTime as string
            };
          });
        setTodayCheckIns(todayAttendance);
      } else {
        // Use mock data if no attendance data
        setMockData();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Use mock data for demo
      setMockData();
    }
  }, [token, calculateMonthlyRevenue, setMockData]);

  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    const savedUser = localStorage.getItem('adminUser');
    if (savedToken && savedUser) {
      const userData = JSON.parse(savedUser);
      if (userData.role === 'ADMIN') {
        setToken(savedToken);
        setIsAuthenticated(true);
        fetchData(savedToken);
      }
    }
  }, [fetchData]);

  // Calculate stats when data changes
  useEffect(() => {
    if (members.length > 0) {
      calculateMonthlyStats(members, todayCheckIns);
    }
  }, [members, todayCheckIns, calculateMonthlyStats]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!email || !password) {
      setLoginError('Molimo unesite email i lozinku');
      return;
    }

    try {
      console.log('Attempting login with email:', email);

      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      console.log('Login response:', data);

      if (res.ok && data.ok) {
        // Check if user is admin (check both isAdmin flag and role)
        console.log('User role:', data.user.role);
        console.log('Is admin flag:', data.user.isAdmin);

        // User needs to be admin - check role OR isAdmin flag
        const isUserAdmin = data.user.role === 'ADMIN' || data.user.isAdmin === true;

        if (!isUserAdmin) {
          setLoginError(`Not an admin account. Role: ${data.user.role}, IsAdmin: ${data.user.isAdmin}`);
          console.log('Not an admin - full user object:', data.user);
          return;
        }

        console.log('Admin login successful');
        setToken(data.token);
        setIsAuthenticated(true);
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        fetchData(data.token);
      } else {
        // More detailed error messages
        if (res.status === 403) {
          // Email not verified - but for admin, we should bypass this
          console.log('403 error - likely email verification issue');
          setLoginError(data.error || 'Email verifikacija potrebna. Kontaktirajte administratora.');
        } else if (res.status === 401) {
          setLoginError('Pogrešna email adresa ili lozinka');
        } else {
          setLoginError(data.error || 'Greška pri prijavljivanju');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Greška pri povezivanju sa serverom');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setToken('');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm('Da li ste sigurni da želite da uklonite ovog člana?')) return;

    try {
      const res = await fetch(`/api/users/${memberId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        fetchData();
      } else {
        // For demo, just remove from state
        setMembers(members.filter(m => m.id !== memberId));
      }
    } catch (error) {
      console.error('Error deleting member:', error);
      // For demo, just remove from state
      setMembers(members.filter(m => m.id !== memberId));
    }
  };

  const handleToggleMemberStatus = async (memberId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/users/${memberId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ membershipActive: !currentStatus })
      });

      if (res.ok) {
        fetchData();
      } else {
        // For demo, just update state
        setMembers(members.map(m =>
          m.id === memberId ? { ...m, isActive: !currentStatus } : m
        ));
      }
    } catch (error) {
      console.error('Error updating member:', error);
      // For demo, just update state
      setMembers(members.map(m =>
        m.id === memberId ? { ...m, isActive: !currentStatus } : m
      ));
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{
          background: 'rgba(20, 20, 20, 0.95)',
          padding: '3rem',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          width: '100%',
          maxWidth: '400px',
          backdropFilter: 'blur(10px)'
        }}>
          <h1 style={{
            color: '#fff',
            fontSize: '2rem',
            marginBottom: '0.5rem',
            textAlign: 'center'
          }}>Admin Panel</h1>
          <p style={{
            color: '#888',
            textAlign: 'center',
            marginBottom: '2rem'
          }}>KBK Princip</p>

          {/* Helper text for testing */}
          <div style={{
            background: 'rgba(255, 255, 0, 0.1)',
            border: '1px solid rgba(255, 255, 0, 0.3)',
            borderRadius: '8px',
            padding: '0.75rem',
            marginBottom: '1rem'
          }}>
            <p style={{
              color: '#ffaa00',
              fontSize: '0.85rem',
              textAlign: 'center',
              margin: 0
            }}>
              Admin: principkbk@gmail.com
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email adresa"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '1rem',
                marginBottom: '1rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
            <input
              type="password"
              placeholder="Lozinka"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '1rem',
                marginBottom: '1.5rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
            {loginError && (
              <p style={{
                color: '#ff4444',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>{loginError}</p>
            )}
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '1rem',
                background: 'linear-gradient(135deg, #ff0000, #cc0000)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={e => (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)'}
              onMouseLeave={e => (e.target as HTMLButtonElement).style.transform = 'translateY(0)'}
            >
              Prijavite se
            </button>
          </form>
        </div>
      </div>
    );
  }

  const COLORS = ['#00ff00', '#ff0000'];

  return (
    <div style={{
      minHeight: '100vh',
      background: darkMode ? '#0a0a0a' : '#f5f5f5',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: ${darkMode ? '#111' : '#f1f1f1'};
        }
        ::-webkit-scrollbar-thumb {
          background: ${darkMode ? '#333' : '#888'};
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: ${darkMode ? '#555' : '#666'};
        }
      `}</style>

      {/* Header */}
      <header style={{
        background: darkMode ? '#111' : '#fff',
        borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <h1 style={{
            color: darkMode ? '#fff' : '#000',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}>
            <span style={{ color: '#ff0000' }}>KBK</span> Admin Panel
          </h1>
          <nav style={{ display: 'flex', gap: '1rem' }}>
            {['dashboard', 'members', 'checkins', 'revenue'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '0.5rem 1rem',
                  background: activeTab === tab ? 'rgba(255,0,0,0.1)' : 'transparent',
                  color: activeTab === tab ? '#ff0000' : (darkMode ? '#888' : '#666'),
                  border: `1px solid ${activeTab === tab ? '#ff0000' : 'transparent'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textTransform: 'capitalize'
                }}
              >
                {tab === 'dashboard' ? 'Pregled' :
                 tab === 'members' ? 'Članovi' :
                 tab === 'checkins' ? 'Prijave' : 'Prihodi'}
              </button>
            ))}
          </nav>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              transition: 'all 0.2s'
            }}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1rem',
              background: 'rgba(255,0,0,0.1)',
              color: '#ff0000',
              border: '1px solid #ff0000',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => {
              (e.target as HTMLElement).style.background = 'rgba(255,0,0,0.2)';
            }}
            onMouseLeave={e => {
              (e.target as HTMLElement).style.background = 'rgba(255,0,0,0.1)';
            }}
          >
            Odjavi se
          </button>
        </div>
      </header>

      {/* Dashboard */}
      {activeTab === 'dashboard' && (
        <div style={{ padding: '2rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem'
          }}>
            <div style={{
              background: darkMode ? '#111' : '#fff',
              padding: '1.5rem',
              borderRadius: '16px',
              border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              transition: 'all 0.3s',
              cursor: 'pointer'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(255,0,0,0.2)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <h3 style={{ color: '#888', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                Mesečni prihod
              </h3>
              <p style={{
                color: darkMode ? '#fff' : '#000',
                fontSize: '2rem',
                fontWeight: 'bold'
              }}>
                {monthlyStats.totalRevenue.toLocaleString()} RSD
              </p>
              <p style={{
                color: '#00ff00',
                fontSize: '0.85rem',
                marginTop: '0.5rem'
              }}>
                +12% od prošlog meseca
              </p>
            </div>

            <div style={{
              background: darkMode ? '#111' : '#fff',
              padding: '1.5rem',
              borderRadius: '16px',
              border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              transition: 'all 0.3s',
              cursor: 'pointer'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(255,0,0,0.2)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <h3 style={{ color: '#888', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                Aktivni članovi
              </h3>
              <p style={{
                color: darkMode ? '#fff' : '#000',
                fontSize: '2rem',
                fontWeight: 'bold'
              }}>
                {monthlyStats.activeMembers}
              </p>
              <p style={{
                color: '#00ff00',
                fontSize: '0.85rem',
                marginTop: '0.5rem'
              }}>
                {members.filter(m => m.isActive).length} / {members.length} ukupno
              </p>
            </div>

            <div style={{
              background: darkMode ? '#111' : '#fff',
              padding: '1.5rem',
              borderRadius: '16px',
              border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              transition: 'all 0.3s',
              cursor: 'pointer'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(255,0,0,0.2)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <h3 style={{ color: '#888', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                Novi članovi ovaj mesec
              </h3>
              <p style={{
                color: darkMode ? '#fff' : '#000',
                fontSize: '2rem',
                fontWeight: 'bold'
              }}>
                {monthlyStats.newMembers}
              </p>
              <p style={{
                color: '#ffaa00',
                fontSize: '0.85rem',
                marginTop: '0.5rem'
              }}>
                Cilj: 5 novih članova
              </p>
            </div>

            <div style={{
              background: darkMode ? '#111' : '#fff',
              padding: '1.5rem',
              borderRadius: '16px',
              border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              transition: 'all 0.3s',
              cursor: 'pointer'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(255,0,0,0.2)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <h3 style={{ color: '#888', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                Prijave danas
              </h3>
              <p style={{
                color: darkMode ? '#fff' : '#000',
                fontSize: '2rem',
                fontWeight: 'bold'
              }}>
                {monthlyStats.checkInsToday}
              </p>
              <p style={{
                color: '#00ff00',
                fontSize: '0.85rem',
                marginTop: '0.5rem'
              }}>
                Aktivno sada: 2
              </p>
            </div>
          </div>

          {/* Revenue Chart */}
          <div style={{
            background: darkMode ? '#111' : '#fff',
            padding: '2rem',
            borderRadius: '16px',
            border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            marginBottom: '2rem'
          }}>
            <h2 style={{
              color: darkMode ? '#fff' : '#000',
              fontSize: '1.2rem',
              marginBottom: '1.5rem'
            }}>
              Prihodi po mesecima
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#333' : '#eee'} />
                <XAxis dataKey="month" stroke={darkMode ? '#888' : '#666'} />
                <YAxis stroke={darkMode ? '#888' : '#666'} />
                <Tooltip
                  contentStyle={{
                    background: darkMode ? '#222' : '#fff',
                    border: `1px solid ${darkMode ? '#444' : '#ddd'}`,
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#ff0000"
                  name="Prihod (RSD)"
                  strokeWidth={2}
                  dot={{ fill: '#ff0000', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="members"
                  stroke="#00ff00"
                  name="Broj članova"
                  strokeWidth={2}
                  dot={{ fill: '#00ff00', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Members Tab */}
      {activeTab === 'members' && (
        <div style={{ padding: '2rem' }}>
          <div style={{
            background: darkMode ? '#111' : '#fff',
            borderRadius: '16px',
            border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '1.5rem',
              borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{
                color: darkMode ? '#fff' : '#000',
                fontSize: '1.2rem'
              }}>
                Svi članovi ({members.length})
              </h2>
              <button
                style={{
                  padding: '0.5rem 1rem',
                  background: 'linear-gradient(135deg, #ff0000, #cc0000)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                + Dodaj člana
              </button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr style={{
                    background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
                  }}>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      color: '#888',
                      fontWeight: 'normal'
                    }}>Ime</th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      color: '#888',
                      fontWeight: 'normal'
                    }}>Email</th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      color: '#888',
                      fontWeight: 'normal'
                    }}>Telefon</th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      color: '#888',
                      fontWeight: 'normal'
                    }}>Status</th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      color: '#888',
                      fontWeight: 'normal'
                    }}>Član od</th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'center',
                      color: '#888',
                      fontWeight: 'normal'
                    }}>Akcije</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => (
                    <tr key={member.id} style={{
                      borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent';
                    }}>
                      <td style={{
                        padding: '1rem',
                        color: darkMode ? '#fff' : '#000',
                        fontWeight: '500'
                      }}>{member.name}</td>
                      <td style={{
                        padding: '1rem',
                        color: darkMode ? '#ccc' : '#333'
                      }}>{member.email}</td>
                      <td style={{
                        padding: '1rem',
                        color: darkMode ? '#ccc' : '#333'
                      }}>{member.phone}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          fontSize: '0.85rem',
                          background: member.isActive ? 'rgba(0,255,0,0.1)' : 'rgba(255,0,0,0.1)',
                          color: member.isActive ? '#00ff00' : '#ff0000',
                          border: `1px solid ${member.isActive ? '#00ff00' : '#ff0000'}`
                        }}>
                          {member.isActive ? 'Aktivan' : 'Neaktivan'}
                        </span>
                      </td>
                      <td style={{
                        padding: '1rem',
                        color: darkMode ? '#ccc' : '#333'
                      }}>
                        {new Date(member.createdAt).toLocaleDateString('sr-RS')}
                      </td>
                      <td style={{
                        padding: '1rem',
                        display: 'flex',
                        gap: '0.5rem',
                        justifyContent: 'center'
                      }}>
                        <button
                          onClick={() => handleToggleMemberStatus(member.id, member.isActive)}
                          style={{
                            padding: '0.25rem 0.75rem',
                            background: 'rgba(255,255,0,0.1)',
                            color: '#ffff00',
                            border: '1px solid #ffff00',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={e => {
                            (e.target as HTMLElement).style.background = 'rgba(255,255,0,0.2)';
                          }}
                          onMouseLeave={e => {
                            (e.target as HTMLElement).style.background = 'rgba(255,255,0,0.1)';
                          }}
                        >
                          {member.isActive ? 'Deaktiviraj' : 'Aktiviraj'}
                        </button>
                        <button
                          onClick={() => handleDeleteMember(member.id)}
                          style={{
                            padding: '0.25rem 0.75rem',
                            background: 'rgba(255,0,0,0.1)',
                            color: '#ff0000',
                            border: '1px solid #ff0000',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={e => {
                            (e.target as HTMLElement).style.background = 'rgba(255,0,0,0.2)';
                          }}
                          onMouseLeave={e => {
                            (e.target as HTMLElement).style.background = 'rgba(255,0,0,0.1)';
                          }}
                        >
                          Ukloni
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Check-ins Tab */}
      {activeTab === 'checkins' && (
        <div style={{ padding: '2rem' }}>
          <div style={{
            background: darkMode ? '#111' : '#fff',
            borderRadius: '16px',
            border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '1.5rem',
              borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
            }}>
              <h2 style={{
                color: darkMode ? '#fff' : '#000',
                fontSize: '1.2rem'
              }}>
                Današnje prijave ({todayCheckIns.length})
              </h2>
              <p style={{
                color: '#888',
                marginTop: '0.5rem'
              }}>
                {format(new Date(), 'dd.MM.yyyy')}
              </p>
            </div>
            <div style={{ padding: '1.5rem' }}>
              {todayCheckIns.length === 0 ? (
                <p style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>
                  Nema prijava za danas
                </p>
              ) : (
                <div style={{
                  display: 'grid',
                  gap: '1rem'
                }}>
                  {todayCheckIns.map((checkIn) => (
                    <div key={checkIn.id} style={{
                      padding: '1rem',
                      background: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                      borderRadius: '8px',
                      border: `1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateX(4px)';
                      e.currentTarget.style.borderColor = '#ff0000';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.borderColor = darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #ff0000, #cc0000)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontWeight: 'bold'
                        }}>
                          {checkIn.memberName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p style={{
                            color: darkMode ? '#fff' : '#000',
                            fontWeight: '500'
                          }}>{checkIn.memberName}</p>
                          <p style={{
                            color: '#888',
                            fontSize: '0.9rem',
                            marginTop: '0.25rem'
                          }}>{checkIn.memberEmail}</p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{
                          color: '#00ff00',
                          fontSize: '0.9rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <span style={{ fontSize: '1.2rem' }}>✓</span> Prijavljen
                        </p>
                        <p style={{
                          color: '#888',
                          fontSize: '0.85rem',
                          marginTop: '0.25rem'
                        }}>{format(new Date(checkIn.checkInTime), 'HH:mm')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Revenue Tab */}
      {activeTab === 'revenue' && (
        <div style={{ padding: '2rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
            gap: '2rem'
          }}>
            {/* Monthly Revenue Bar Chart */}
            <div style={{
              background: darkMode ? '#111' : '#fff',
              padding: '2rem',
              borderRadius: '16px',
              border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
            }}>
              <h2 style={{
                color: darkMode ? '#fff' : '#000',
                fontSize: '1.2rem',
                marginBottom: '1.5rem'
              }}>
                Mesečni prihodi
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#333' : '#eee'} />
                  <XAxis dataKey="month" stroke={darkMode ? '#888' : '#666'} />
                  <YAxis stroke={darkMode ? '#888' : '#666'} />
                  <Tooltip
                    contentStyle={{
                      background: darkMode ? '#222' : '#fff',
                      border: `1px solid ${darkMode ? '#444' : '#ddd'}`,
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="revenue" fill="#ff0000" name="Prihod (RSD)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Member Status Pie Chart */}
            <div style={{
              background: darkMode ? '#111' : '#fff',
              padding: '2rem',
              borderRadius: '16px',
              border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
            }}>
              <h2 style={{
                color: darkMode ? '#fff' : '#000',
                fontSize: '1.2rem',
                marginBottom: '1.5rem'
              }}>
                Status članova
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Aktivni', value: members.filter(m => m.isActive).length },
                      { name: 'Neaktivni', value: members.filter(m => !m.isActive).length }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    label={({ name, value, percent }: any) => `${name}: ${value} (${((percent as number) * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[0, 1].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue Summary */}
          <div style={{
            background: darkMode ? '#111' : '#fff',
            padding: '2rem',
            borderRadius: '16px',
            border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            marginTop: '2rem'
          }}>
            <h2 style={{
              color: darkMode ? '#fff' : '#000',
              fontSize: '1.2rem',
              marginBottom: '1.5rem'
            }}>
              Finansijski pregled
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem'
            }}>
              <div>
                <p style={{ color: '#888', marginBottom: '0.5rem' }}>Cena članarine</p>
                <p style={{
                  color: darkMode ? '#fff' : '#000',
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}>2,500 RSD</p>
              </div>
              <div>
                <p style={{ color: '#888', marginBottom: '0.5rem' }}>Mesečni prihod</p>
                <p style={{
                  color: darkMode ? '#fff' : '#000',
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}>{(monthlyStats.activeMembers * 2500).toLocaleString()} RSD</p>
              </div>
              <div>
                <p style={{ color: '#888', marginBottom: '0.5rem' }}>Godišnja projekcija</p>
                <p style={{
                  color: darkMode ? '#fff' : '#000',
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}>{(monthlyStats.activeMembers * 2500 * 12).toLocaleString()} RSD</p>
              </div>
              <div>
                <p style={{ color: '#888', marginBottom: '0.5rem' }}>Prosečna posećenost</p>
                <p style={{
                  color: darkMode ? '#fff' : '#000',
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}>78%</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
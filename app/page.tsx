export default function Home() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>KBK Princip Backend API</h1>
      <p>Backend service for KBK Princip Android application</p>
      <h2>API Endpoints:</h2>
      <ul>
        <li>POST /api/login - User login</li>
        <li>POST /api/register - User registration</li>
        <li>GET /api/users - Get all users (admin only)</li>
        <li>PATCH /api/users/[userId] - Update user membership</li>
        <li>DELETE /api/users/[userId] - Delete user</li>
        <li>GET /api/auth/session - Get current session</li>
      </ul>
    </div>
  );
}
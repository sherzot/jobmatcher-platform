import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Agents from './pages/Agents';
import Companies from './pages/Companies';
import Jobs from './pages/Jobs';
import Settings from './pages/Settings';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/agents" element={<Agents />} />
        <Route path="/admin/companies" element={<Companies />} />
        <Route path="/admin/jobs" element={<Jobs />} />
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Router>
  );
}

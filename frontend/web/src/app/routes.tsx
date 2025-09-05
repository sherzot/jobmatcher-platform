import { createBrowserRouter } from "react-router-dom";
import UnifiedHome from "../pages/UnifiedHome";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Jobs from "../pages/Jobs";
import Resume from "../pages/Resume";
import Offers from "../pages/Offers";
import Companies from "../pages/Companies";
import Agents from "../pages/Agents";
import Admin from "../pages/Admin";
import AgentLogin from "../pages/AgentLogin";
import AdminLogin from "../pages/AdminLogin";
import MyPage from "../pages/MyPage";
import UserDashboard from "../pages/UserDashboard";
import AgentDashboard from "../pages/AgentDashboard";
import CompanyDashboard from "../pages/CompanyDashboard";
import ProtectedRoute from "../components/ProtectedRoute";

export const router = createBrowserRouter([
  { path: "/", element: <UnifiedHome /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/agent/login", element: <AgentLogin /> },
  { path: "/admin/login", element: <AdminLogin /> },
  // public
  { path: "/jobs", element: <Jobs /> },
  // user dashboard
  { path: "/user", element: <UserDashboard /> },
  { path: "/user/*", element: <UserDashboard /> },
  // agent dashboard
  { path: "/agent", element: <AgentDashboard /> },
  { path: "/agent/*", element: <AgentDashboard /> },
  // company dashboard
  { path: "/company", element: <CompanyDashboard /> },
  { path: "/company/*", element: <CompanyDashboard /> },
  // protected:
  {
    element: <ProtectedRoute />,
    children: [
      { path: "/mypage", element: <MyPage /> },
      { path: "/resume", element: <Resume /> },
      { path: "/offers", element: <Offers /> },
      { path: "/companies", element: <Companies /> },
      { path: "/agents", element: <Agents /> },
      { path: "/admin", element: <Admin /> }, // agar admin/agent uchun alohida layout bo'lsa keyin ajratamiz
    ],
  },
]);

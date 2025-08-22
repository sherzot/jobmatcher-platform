import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
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

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/jobs", element: <Jobs /> },
  { path: "/resume", element: <Resume /> },
  { path: "/offers", element: <Offers /> },
  { path: "/companies", element: <Companies /> },
  { path: "/agents", element: <Agents /> },
  { path: "/admin", element: <Admin /> },
  { path: "/agent/login", element: <AgentLogin /> },
  { path: "/admin/login", element: <AdminLogin /> },
  { path: "/mypage", element: <MyPage /> },
]);

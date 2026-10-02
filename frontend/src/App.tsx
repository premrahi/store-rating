import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { fetchMe } from "./store/authSlice";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ChangePassword from "./pages/ChangePassword";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminUserDetail from "./pages/AdminUserDetail";
import AdminStores from "./pages/AdminStores";
import AddUser from "./pages/AddUser";
import AddStore from "./pages/AddStore";
import UserStores from "./pages/UserStores";
import OwnerDashboard from "./pages/OwnerDashboard";

const homeFor = { ADMIN: "/admin", USER: "/stores", OWNER: "/owner" } as const;

function Home() {
  const { user, checking } = useAppSelector((state) => state.auth);
  if (checking) return <PageLoading />;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={homeFor[user.role]} replace />;
}

export default function App() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => { if (token) void dispatch(fetchMe()); }, [dispatch, token]);

  return <div className="min-h-screen bg-base-200/50 text-base-content"><Navbar /><main><Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
    <Route path="/admin" element={<ProtectedRoute roles={["ADMIN"]}><AdminDashboard /></ProtectedRoute>} />
    <Route path="/admin/users" element={<ProtectedRoute roles={["ADMIN"]}><AdminUsers /></ProtectedRoute>} />
    <Route path="/admin/users/:id" element={<ProtectedRoute roles={["ADMIN"]}><AdminUserDetail /></ProtectedRoute>} />
    <Route path="/admin/stores" element={<ProtectedRoute roles={["ADMIN"]}><AdminStores /></ProtectedRoute>} />
    <Route path="/admin/add-user" element={<ProtectedRoute roles={["ADMIN"]}><AddUser /></ProtectedRoute>} />
    <Route path="/admin/add-store" element={<ProtectedRoute roles={["ADMIN"]}><AddStore /></ProtectedRoute>} />
    <Route path="/stores" element={<ProtectedRoute roles={["USER"]}><UserStores /></ProtectedRoute>} />
    <Route path="/owner" element={<ProtectedRoute roles={["OWNER"]}><OwnerDashboard /></ProtectedRoute>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></main></div>;
}

export function PageLoading() { return <div className="min-h-[60vh] grid place-items-center"><span className="loading loading-spinner loading-lg text-primary" /></div>; }

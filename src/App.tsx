import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./auth/ProtectedRoute";
import PublicRoute from "./auth/PublicRoute";
import Home from "./pages/Home";
import Admin from "./pages/admin/Admin";
import AdminSweets from "./pages/admin/AdminSweets";
import AdminTransactions from "./pages/admin/AdminTransactions";





function App() {
  return (
    <Routes>
      {/* unauthenticated */}
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />

      {/* for normal users */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* only for admins */}
      <Route path="/admin" element={<Admin />}>
        <Route index element={<AdminSweets />} />
        <Route
          path="transactions"
          element={<AdminTransactions />}
        />
      </Route>

      {/* idk chatgpt */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;

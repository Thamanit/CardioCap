import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useContext } from "react";
import { AuthContext, AuthContextProvider } from "../src/context/AuthContext";
import Layout from './layout/Layout';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import UploadImage from './pages/UploadImage';
// import Results from './pages/Results';
// import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user === undefined) {
      return <div>Loading...</div>
    }

    if (!user) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  const OutletProtectedRoute = () => {
    const { user } = useContext(AuthContext);

    if (user === undefined) {
      return <div>Loading...</div>
    }

    if (!user) {
      return <Navigate to="/login" />;
    }

    return <Outlet />;
  }

  const AdminProtectedRoute = () => {
    const { user } = useContext(AuthContext);

    if (user === undefined) {
      return <div>Loading...</div>
    }

    if (!user?.isAdmin) {
      return (
        <div>
          Admin Only
        </div>
      )
    }

    return <Outlet />;
  };

  const LoginProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user === undefined) {
      return <div>Loading...</div>
    }

    if (user) {
      return <Navigate to="/" />;
    }

    return children;
  }

  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/login" element={<LoginProtectedRoute><Login /></LoginProtectedRoute>} />
            <Route path="/register" element={<LoginProtectedRoute><Register /></LoginProtectedRoute>} />
            <Route path='/admin' element={<AdminProtectedRoute />}>
              {/* <Route index element={<AdminDashboard />} /> */}
            </Route>
            <Route path='*' element={<h1>Not Found</h1>} />
            <Route path="/upload" element={<ProtectedRoute><UploadImage /></ProtectedRoute>} />
            {/* <Route path="/results" element={<Results />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  )
}

export default App
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import studentLogo from '../assets/student-logo.jpeg';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const appRole = (process.env.REACT_APP_APP_ROLE || 'combined').toLowerCase();
  const allowStudentView = appRole === 'student' || appRole === 'combined';
  const allowAdminView = appRole === 'admin' || appRole === 'combined';

  // Don't show navbar on admin-only build
  if (!allowStudentView && allowAdminView) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <img src={studentLogo} alt="School Logo" className="nav-logo-img" />
          <span className="nav-logo-text">NUESA Portal</span>
        </Link>

        <div className="nav-menu">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          
          {user ? (
            <>
              <Link 
                to="/pay" 
                className={`nav-link ${location.pathname === '/pay' ? 'active' : ''}`}
              >
                Make Payment
              </Link>
              <div className="nav-user">
                <span className="nav-user-name">Hi, {user.name}</span>
                <button onClick={handleLogout} className="nav-logout-btn">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="nav-auth">
              <Link 
                to="/login" 
                className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="nav-btn nav-btn-primary"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

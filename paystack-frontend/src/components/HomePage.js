import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './HomePage.css';
import presidentImg from '../assets/president.png';
import vpImg from '../assets/vp.png';
import finSecImg from '../assets/fin sec.png';
import genSecImg from '../assets/gen sec.png';
const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Our Faculty of Engineering</h1>
          <p className="hero-subtitle">Bringing ideas and innovations to life</p>
          <div className="hero-buttons">
            {!user ? (
              <>
                <Link to="/login" className="btn btn-primary">Student Login</Link>
                <Link to="/signup" className="btn btn-secondary">Sign Up</Link>
              </>
            ) : (
              <Link to="/pay" className="btn btn-primary">Make Payment</Link>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <h2>About NUESA ACU</h2>
          <div className="about-grid">
            <div className="about-card">
              <h3>Our Mission</h3>
              <p>
              To advance studiousness, maximize performance, and develop valuable skills among all engineering students at the university.

              </p>
            </div>
            <div className="about-card">
              <h3>Overview </h3>
              <p>
              NUESA ACU operates under the umbrella of the national NUESA body, which is a prominent student organization affiliated with the Nigerian Society of Engineers (NSE). 

              </p>
            </div>
            <div className="about-card">
              <h3>Student Support</h3>
              <p>
                We provide comprehensive support services to ensure every student 
                achieves their full potential and succeeds in their academic journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Authorities Section */}
      <section className="authorities-section">
        <div className="container">
          <h2>NUESA ACU Leadership</h2>
          <div className="authorities-grid">
            <div className="authority-card">
              <img src={presidentImg} alt="Dean" className="authority-img" />
              <div className="authority-info">
                <h3>Prof. John Doe</h3>
                <p className="title">President</p>
                <p className="description">
                  Leading the faculty with over 20 years of experience in academic 
                  administration and research excellence.
                </p>
              </div>
            </div>
            <div className="authority-card">
              <img src={vpImg} alt="Deputy Dean Academic" className="authority-img" />
              <div className="authority-info">
                <h3>Dr. Jane Smith</h3>
                <p className="title">Vice President</p>
                <p className="description">
                  Overseeing academic programs and ensuring quality education 
                  delivery across all departments.
                </p>
              </div>
            </div>
            <div className="authority-card">
              <img src={finSecImg} alt="Deputy Dean Admin" className="authority-img" />
              <div className="authority-info">
                <h3>Prof. Michael Johnson</h3>
                <p className="title">Financial Secretary</p>
                <p className="description">
                  Managing administrative affairs and student services to create 
                  an optimal learning environment.
                </p>
              </div>
            </div>
            <div className="authority-card">
              <img src={genSecImg} alt="Head of Student Affairs" className="authority-img" />
              <div className="authority-info">
                <h3>Dr. Sarah Wilson</h3>
                <p className="title">General Secretary</p>
                <p className="description">
                  Dedicated to student welfare, extracurricular activities, 
                  and overall student experience enhancement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      {user && (
        <section className="quick-actions">
          <div className="container">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              <Link to="/pay" className="action-card">
                <h3>Make Payment</h3>
                <p>Pay your fees securely online</p>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 shadow-4-strong" style={{ backgroundColor: '#374955' }}>
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            <Link to="/" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
              <img className="rounded-circle shadow-4-strong" alt="Me!" src="./assets/professional_photo.jpg" width="100%" />
            </Link>
            <span className="fs-5 d-none d-sm-inline" style={{ fontSize: 'xx-large', justifyContent: 'center' }}>David Gorden</span>
            <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
              <li className="nav-item" style={{ width: 'fit-content' }}>
                <Link to="/" className={`nav-link align-middle ${location.pathname === '/' ? 'active' : ''}`}>
                  <i className="fs-4 bi-house"></i>
                  <span className="ms-1 d-none d-sm-inline">About Me</span>
                </Link>
              </li>
              <li>
                <Link to="/experience" className={`nav-link align-middle ${location.pathname === '/experience' ? 'active' : ''}`}>
                  <i className="fs-4 bi-people"></i>
                  <span className="ms-1 d-none d-sm-inline">Experience</span>
                </Link>
              </li>
              <li>
                <Link to="/coding-reference" className={`nav-link align-middle ${location.pathname === '/coding-reference' ? 'active' : ''}`}>
                  <i className="fs-4 bi-people"></i>
                  <span className="ms-1 d-none d-sm-inline">Coding Reference</span>
                </Link>
              </li>
              <li>
                <Link to="/dogs" className={`nav-link align-middle ${location.pathname === '/dogs' ? 'active' : ''}`}>
                  <i className="fs-4 bi-people"></i>
                  <span className="ms-1 d-none d-sm-inline">Dogs!</span>
                </Link>
              </li>
              <li>
                <Link to="/hobbies" className={`nav-link align-middle ${location.pathname === '/hobbies' ? 'active' : ''}`}>
                  <i className="fs-4 bi-people"></i>
                  <span className="ms-1 d-none d-sm-inline">Hobbies</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className={`nav-link align-middle ${location.pathname === '/contact' ? 'active' : ''}`}>
                  <i className="fs-4 bi-people"></i>
                  <span className="ms-1 d-none d-sm-inline">Contact Me</span>
                </Link>
              </li>
            </ul>
            <hr />
          </div>
        </div>
        <div className="col py-3" style={{
          backgroundImage: "url('./assets/beach.jpg')",
          backgroundSize: '100% 100%',
          backgroundAttachment: 'fixed'
        }}>
          <div id="Content_Body">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;

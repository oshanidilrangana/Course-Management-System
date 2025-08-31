import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Students from "./pages/Students";
import Registrations from "./pages/Registrations";
import Results from "./pages/Results";
import styled from 'styled-components';

const StyledNavbar = styled(Navbar)`
  background: linear-gradient(135deg, #1572fe 0%, #c08cee 50%, #eeac5c 100%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 0.8rem 0;
  
  .navbar-brand {
    font-weight: 700;
    color: #fff !important;
    font-size: 1.5rem;
    transition: all 0.3s ease;
    
    &:hover {
      color: #e2e6ee !important;
      transform: scale(1.02);
    }
  }
  
  .nav-link {
    color: #fff !important;
    font-weight: 500;
    margin: 0 0.5rem;
    padding: 0.5rem 1rem !important;
    border-radius: 4px;
    transition: all 0.3s ease;
    
    &:hover, &.active {
      background-color: rgba(255, 255, 255, 0.2);
      color: #e2e6ee !important;
      transform: translateY(-2px);
    }
  }
  
  .navbar-toggler {
    border-color: rgba(255, 255, 255, 0.5);
    
    .navbar-toggler-icon {
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28255, 255, 255, 0.8%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
    }
  }
`;

function App() {
  return (
    <Router>
      <StyledNavbar expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand style={{
            background: 'linear-gradient(135deg, #fff 0%, #e2e6ee 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '800',
            fontSize: '1.8rem',
            letterSpacing: '1px',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            display: 'inline-block',
            padding: '0.2rem 0.5rem',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
              textShadow: '0 4px 15px rgba(255, 255, 255, 0.3)'
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: '2px',
              left: '0',
              width: '100%',
              height: '3px',
              background: 'linear-gradient(90deg, #3498db, #2ecc71)',
              transform: 'scaleX(0)',
              transformOrigin: 'right',
              transition: 'transform 0.3s ease',
              borderRadius: '2px'
            },
            '&:hover::after': {
              transform: 'scaleX(1)',
              transformOrigin: 'left'
            }
          }}>Edu UOK</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/students">Students</Nav.Link>
              <Nav.Link href="/courses">Courses</Nav.Link>
              <Nav.Link href="/registrations">Registrations</Nav.Link>
              <Nav.Link href="/results">Results</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </StyledNavbar>
      
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/students" element={<Students />} />
          <Route path="/registrations" element={<Registrations />} />
          <Route path="/results" element={<Results />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;

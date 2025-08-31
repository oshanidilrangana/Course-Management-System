import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Container, Row, Col } from 'react-bootstrap';

const Home = () => {
  const cardStyle = {
    width: '18rem',
    margin: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    color: '#292940',
    border: 'none',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
    backgroundColor: '#e2e6ee',
    '&:hover': {
      backgroundColor: '#e2e6ee'
    }
  };

  const cardHover = {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 25px rgba(21, 114, 254, 0.2)'
  };

  return (
    <Container className="py-5" style={{ 
      backgroundColor: '#f0f4f8',
      minHeight: 'calc(100vh - 56px)'
    }}>
      <div className="text-center mb-5">
        <h1 style={{
          color: '#2c3e50',
          fontWeight: '800',
          fontSize: '2.8rem',
          marginBottom: '1rem',
          background: 'linear-gradient(90deg, #3498db, #2ecc71)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'inline-block',
          position: 'relative',
          padding: '0 1rem',
        }}>
          Course Management System
          <div style={{
            content: '""',
            position: 'absolute',
            bottom: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80px',
            height: '4px',
            background: 'linear-gradient(90deg, #3498db, #2ecc71)',
            borderRadius: '2px',
          }} />
        </h1>

      </div>
      <Row className="justify-content-center">
        <Col md={3} className="text-center">
          <Link to="/students" style={cardStyle} className="card-link">
            <Card className="h-100" style={cardStyle} 
              onMouseEnter={e => e.currentTarget.style.transform = cardHover.transform}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              <div style={{
                height: '8px',
                background: '#eeac5c',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }} />
              <Card.Body>
                <Card.Title style={{ color: '#1572fe' }}>Students</Card.Title>
                <Card.Text style={{ 
                  color: '#4a5568',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  padding: '10px',
                  borderRadius: '8px',
                  marginTop: '10px'
                }}>
                  Manage student records and information.
                </Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>
        
        <Col md={3} className="text-center">
          <Link to="/courses" style={cardStyle} className="card-link">
            <Card className="h-100" style={cardStyle} 
              onMouseEnter={e => e.currentTarget.style.transform = cardHover.transform}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              <div style={{
                height: '8px',
                background: '#eeac5c',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }} />
              <Card.Body>
                <Card.Title style={{ color: '#eeac5c' }}>Courses</Card.Title>
                <Card.Text style={{ 
                  color: '#4a5568',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  padding: '10px',
                  borderRadius: '8px',
                  marginTop: '10px'
                }}>
                  View and manage course offerings.
                </Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>
        
        <Col md={3} className="text-center">
          <Link to="/registrations" style={cardStyle} className="card-link">
            <Card className="h-100" style={cardStyle} 
              onMouseEnter={e => e.currentTarget.style.transform = cardHover.transform}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              <div style={{
                height: '8px',
                background: '#eeac5c',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }} />
              <Card.Body>
                <Card.Title style={{ color: '#c08cee' }}>Registrations</Card.Title>
                <Card.Text style={{ 
                  color: '#4a5568',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  padding: '10px',
                  borderRadius: '8px',
                  marginTop: '10px'
                }}>
                  Handle course registrations and enrollments.
                </Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>
        
        <Col md={3} className="text-center">
          <Link to="/results" style={cardStyle} className="card-link">
            <Card className="h-100" style={cardStyle} 
              onMouseEnter={e => e.currentTarget.style.transform = cardHover.transform}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              <div style={{
                height: '8px',
                background: '#eeac5c',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }} />
              <Card.Body>
                <Card.Title style={{ color: '#292940' }}>Results</Card.Title>
                <Card.Text style={{ 
                  color: '#4a5568',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  padding: '10px',
                  borderRadius: '8px',
                  marginTop: '10px'
                }}>
                  View and manage student results.
                </Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;

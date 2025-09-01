import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Table, Spinner, Alert, Form, Row, Col } from 'react-bootstrap';
import { theme, pageContainerStyle, pageHeaderStyle } from '../theme/styles';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    credits: "",
    instructor: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch courses from backend
  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5001/api/courses");
      const data = await response.json();
      setCourses(data);
      setError("");
    } catch (err) {
      setError("Failed to fetch courses. Please try again later.");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'credits' ? parseInt(value) || '' : value
    }));
  };

  const resetForm = () => {
    setFormData({ name: "", credits: "", instructor: "" });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      const url = editingId 
        ? `http://localhost:5001/api/courses/${editingId}`
        : 'http://localhost:5001/api/courses';
      
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save course');
      }

      await fetchCourses();
      resetForm();
    } catch (err) {
      setError("Failed to save course. Please try again.");
      console.error("Error:", err);
    }
  };

  const handleEdit = (course) => {
    setFormData({
      name: course.name,
      credits: course.credits,
      instructor: course.instructor,
    });
    setEditingId(course._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    
    try {
      const response = await fetch(`http://localhost:5001/api/courses/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error('Failed to delete course');
      }

      await fetchCourses();
      if (editingId === id) resetForm();
    } catch (err) {
      setError("Failed to delete course. Please try again.");
      console.error("Error:", err);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <Container style={pageContainerStyle}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <Spinner animation="border" variant="primary" />
          <p style={{ marginTop: '1rem', color: theme.colors.textSecondary }}>Loading courses...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container style={pageContainerStyle}>
      <h2 style={pageHeaderStyle}>Course Management</h2>
      
      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

      <Card className="mb-4" style={{ border: 'none', borderRadius: '12px', overflow: 'hidden', boxShadow: theme.shadows.card }}>
        <Card.Header style={{ 
          backgroundColor: theme.colors.primary, 
          color: 'white',
          border: 'none',
          padding: '1rem 1.5rem'
        }}>
          <h5 style={{ margin: 0 }}>{editingId ? 'Edit Course' : 'Add New Course'}</h5>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={5}>
                <Form.Group controlId="name">
                  <Form.Label style={{ color: theme.colors.text, fontWeight: '500' }}>Course Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    style={{ borderRadius: '8px', borderColor: theme.colors.border }}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="credits">
                  <Form.Label style={{ color: theme.colors.text, fontWeight: '500' }}>Credits</Form.Label>
                  <Form.Control
                    type="number"
                    name="credits"
                    value={formData.credits}
                    onChange={handleInputChange}
                    min="1"
                    required
                    style={{ borderRadius: '8px', borderColor: theme.colors.border }}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="instructor">
                  <Form.Label style={{ color: theme.colors.text, fontWeight: '500' }}>Instructor</Form.Label>
                  <Form.Control
                    type="text"
                    name="instructor"
                    value={formData.instructor}
                    onChange={handleInputChange}
                    required
                    style={{ borderRadius: '8px', borderColor: theme.colors.border }}
                  />
                </Form.Group>
              </Col>
              <Col md={12} className="d-flex justify-content-end mt-2">
                <Button 
                  type="submit" 
                  style={{
                    ...theme.button.primary,
                    padding: '0.5rem 1.5rem',
                    fontWeight: '500',
                    marginRight: '0.75rem'
                  }}
                >
                  {editingId ? 'Update Course' : 'Add Course'}
                </Button>
                {editingId && (
                  <Button 
                    type="button" 
                    onClick={resetForm}
                    style={{
                      ...theme.button.secondary,
                      padding: '0.5rem 1.5rem',
                      fontWeight: '500'
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <Card style={{ border: 'none', borderRadius: '12px', overflow: 'hidden', boxShadow: theme.shadows.card }}>
        <Card.Header style={{ 
          backgroundColor: theme.colors.primary, 
          color: 'white',
          border: 'none',
          padding: '1rem 1.5rem'
        }}>
          <h5 style={{ margin: 0 }}>Course List</h5>
        </Card.Header>
        <Card.Body style={{ padding: 0 }}>
          {courses.length === 0 ? (
            <p style={{ color: theme.colors.textSecondary, textAlign: 'center', padding: '2rem' }}>
              No courses found. Add a course to get started.
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <Table hover style={{ margin: 0 }}>
                <thead style={{ backgroundColor: theme.colors.background }}>
                  <tr>
                    <th style={{ color: theme.colors.text, fontWeight: '600' }}>Name</th>
                    <th style={{ color: theme.colors.text, fontWeight: '600' }}>Credits</th>
                    <th style={{ color: theme.colors.text, fontWeight: '600' }}>Instructor</th>
                    <th style={{ color: theme.colors.text, fontWeight: '600', width: '200px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course._id} style={{ verticalAlign: 'middle' }}>
                      <td style={{ color: theme.colors.text, fontWeight: '500' }}>{course.name}</td>
                      <td style={{ color: theme.colors.textSecondary }}>{course.credits}</td>
                      <td style={{ color: theme.colors.text }}>{course.instructor}</td>
                      <td>
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => handleEdit(course)}
                          style={{
                            borderColor: theme.colors.primary,
                            color: theme.colors.primary,
                            borderRadius: '6px',
                            padding: '0.25rem 0.75rem',
                            fontWeight: '500',
                            marginRight: '0.5rem',
                            '&:hover': {
                              backgroundColor: 'rgba(21, 114, 254, 0.1)'
                            }
                          }}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDelete(course._id)}
                          style={{
                            borderColor: '#dc3545',
                            color: '#dc3545',
                            borderRadius: '6px',
                            padding: '0.25rem 0.75rem',
                            fontWeight: '500',
                            '&:hover': {
                              backgroundColor: 'rgba(220, 53, 69, 0.1)'
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Courses;

import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Table, Spinner, Alert, Badge, Form } from 'react-bootstrap';
import { theme, pageContainerStyle, pageHeaderStyle } from '../theme/styles';

const API = 'http://localhost:5000/api/students';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: ''
  });
  const [studentId, setStudentId] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all students
  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API);
      if (!response.ok) throw new Error('Failed to fetch students');
      const data = await response.json();
      setStudents(data);
      setError('');
    } catch (err) {
      setError('Failed to load students. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', department: '' });
    setStudentId('');
    setEditingId(null);
  };

  // Handle form submission (create/update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const url = editingId ? `${API}/${editingId}` : API;
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save student');
      }

      await fetchStudents();
      resetForm();
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    }
  };

  // Handle edit action
  const handleEdit = (student) => {
    setFormData({
      name: student.name,
      email: student.email,
      department: student.department
    });
    setStudentId(student.studentId || '');
    setEditingId(student._id);
  };

  // Handle delete action
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    
    try {
      const response = await fetch(`${API}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete student');
      }

      await fetchStudents();
      if (editingId === id) resetForm();
    } catch (err) {
      setError('Failed to delete student. Please try again.');
    }
  };

  return (
    <Container style={pageContainerStyle}>
      <h2 style={pageHeaderStyle}>Students Management</h2>
      
      {/* Error Message */}
      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

      {/* Add/Edit Student Form */}
      <Card className="mb-4" style={{ border: 'none', borderRadius: '12px', overflow: 'hidden', boxShadow: theme.shadows.card }}>
        <Card.Header style={{ 
          backgroundColor: theme.colors.primary, 
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          border: 'none',
          padding: '1rem 1.5rem'
        }}>
          <h5 className="mb-0">{editingId ? 'Edit Student' : 'Add New Student'}</h5>
          {editingId && studentId && (
            <Badge bg="light" text="primary">ID: {studentId}</Badge>
          )}
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <Form.Group controlId="name">
                <Form.Label style={{ color: theme.colors.text, fontWeight: '500' }}>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={{ borderRadius: '8px', borderColor: theme.colors.border }}
                />
              </Form.Group>
              
              <Form.Group controlId="email">
                <Form.Label style={{ color: theme.colors.text, fontWeight: '500' }}>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={{ borderRadius: '8px', borderColor: theme.colors.border }}
                />
              </Form.Group>
              
              <Form.Group controlId="department">
                <Form.Label style={{ color: theme.colors.text, fontWeight: '500' }}>Department</Form.Label>
                <Form.Control
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                  style={{ borderRadius: '8px', borderColor: theme.colors.border }}
                />
              </Form.Group>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
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
              <Button 
                type="submit" 
                style={{
                  ...theme.button.primary,
                  padding: '0.5rem 1.5rem',
                  fontWeight: '500',
                  marginLeft: editingId ? '0' : 'auto'
                }}
              >
                {editingId ? 'Update Student' : 'Add Student'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Students List */}
      <Card style={{ border: 'none', borderRadius: '12px', overflow: 'hidden', boxShadow: theme.shadows.card }}>
        <Card.Header style={{ 
          backgroundColor: theme.colors.primary, 
          color: 'white',
          border: 'none',
          padding: '1rem 1.5rem'
        }}>
          <h5 style={{ margin: 0 }}>Students List</h5>
        </Card.Header>
        <Card.Body>
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : students.length === 0 ? (
            <p style={{ color: theme.colors.textSecondary, textAlign: 'center', padding: '2rem' }}>
              No students found. Add a new student to get started.
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <Table hover style={{ margin: 0 }}>
                <thead style={{ backgroundColor: theme.colors.background }}>
                  <tr>
                    <th style={{ color: theme.colors.text, fontWeight: '600' }}>#</th>
                    <th style={{ color: theme.colors.text, fontWeight: '600' }}>Student ID</th>
                    <th style={{ color: theme.colors.text, fontWeight: '600' }}>Name</th>
                    <th style={{ color: theme.colors.text, fontWeight: '600' }}>Email</th>
                    <th style={{ color: theme.colors.text, fontWeight: '600' }}>Department</th>
                    <th style={{ color: theme.colors.text, fontWeight: '600' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <tr key={student._id} style={{ verticalAlign: 'middle' }}>
                      <td style={{ color: theme.colors.textSecondary }}>{index + 1}</td>
                      <td style={{ color: theme.colors.text, fontWeight: '500' }}>{student.studentId || 'N/A'}</td>
                      <td style={{ color: theme.colors.text, fontWeight: '500' }}>{student.name}</td>
                      <td style={{ color: theme.colors.textSecondary }}>{student.email}</td>
                      <td style={{ color: theme.colors.textSecondary }}>{student.department || 'N/A'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => handleEdit(student)}
                            style={{
                              borderColor: theme.colors.primary,
                              color: theme.colors.primary,
                              borderRadius: '6px',
                              padding: '0.25rem 0.75rem',
                              fontWeight: '500',
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
                            onClick={() => handleDelete(student._id)}
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
                        </div>
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
};

export default Students;

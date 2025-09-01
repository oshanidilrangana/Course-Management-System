import { useEffect, useState } from 'react';
import { Container, Card, Button, Table, Spinner, Alert, Form, Row, Col } from 'react-bootstrap';
import { theme, pageContainerStyle, pageHeaderStyle } from '../theme/styles';

const API_BASE = "http://localhost:5001/api";
const API_STUDENTS = `${API_BASE}/students`;
const API_COURSES = `${API_BASE}/courses`;
const API_RESULTS = `${API_BASE}/results`;

// Helper function to get color based on grade
const getGradeColor = (grade) => {
  if (!grade) return theme.colors.textSecondary;
  
  const gradeMap = {
    'A+': '#28a745',
    'A': '#28a745',
    'A-': '#5cb85c',
    'B+': '#5bc0de',
    'B': '#5bc0de',
    'B-': '#5bc0de',
    'C+': '#ffc107',
    'C': '#ffc107',
    'C-': '#ff9800',
    'D+': '#fd7e14',
    'D': '#dc3545',
    'F': '#dc3545',
  };

  return gradeMap[grade] || theme.colors.primary;
};

export default function Results() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [results, setResults] = useState([]);
  const [form, setForm] = useState({ studentId: "", courseId: "", marks: "", grade: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  // Load data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch students
        const studentsRes = await fetch(API_STUDENTS);
        if (!studentsRes.ok) throw new Error('Failed to fetch students');
        const studentsData = await studentsRes.json();
        console.log('Fetched students:', studentsData);
        setStudents(studentsData);

        // Fetch courses
        const coursesRes = await fetch(API_COURSES);
        if (!coursesRes.ok) throw new Error('Failed to fetch courses');
        const coursesData = await coursesRes.json();
        console.log('Fetched courses:', coursesData);
        setCourses(coursesData);

        // Fetch results
        const resultsRes = await fetch(API_RESULTS);
        if (!resultsRes.ok) throw new Error('Failed to fetch results');
        const resultsData = await resultsRes.json();
        console.log('Fetched results:', resultsData);
        setResults(resultsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(`Error loading data: ${err.message}`);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ studentId: "", courseId: "", marks: "", grade: "" });
    setEditingId(null);
    setError("");
  };

  // Add or Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check for existing result for this student and course
      if (!editingId) {
        const exists = results.some(
          r => r.student._id === form.studentId && 
               r.course._id === form.courseId &&
               r._id !== editingId
        );
        
        if (exists) {
          throw new Error('This student already has a grade for the selected course');
        }
      }

      const res = await fetch(
        editingId ? `${API_RESULTS}/${editingId}` : API_RESULTS,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Action failed");

      // Update table
      if (editingId) {
        setResults(results.map((r) => (r._id === editingId ? data.result : r)));
      } else {
        setResults([...results, data.result]);
      }
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (result) => {
    setEditingId(result._id);
    setForm({
      studentId: result.student._id,
      courseId: result.course._id,
      marks: result.marks,
      grade: result.grade,
    });
  };

  // Show loading state
  if (students.length === 0 || courses.length === 0) {
    return (
      <Container style={pageContainerStyle}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <Spinner animation="border" variant="primary" />
          <p style={{ marginTop: '1rem', color: theme.colors.textSecondary }}>Loading data...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container style={pageContainerStyle}>
      <h2 style={pageHeaderStyle}>Student Results</h2>
      
      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

      <Card className="mb-4" style={{ border: 'none', borderRadius: '12px', overflow: 'hidden', boxShadow: theme.shadows.card }}>
        <Card.Header style={{ 
          backgroundColor: theme.colors.primary, 
          color: 'white',
          border: 'none',
          padding: '1rem 1.5rem'
        }}>
          <h5 style={{ margin: 0 }}>{editingId ? 'Update Result' : 'Add New Result'}</h5>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={4}>
                <Form.Group controlId="studentId">
                  <Form.Label style={{ color: theme.colors.text, fontWeight: '500' }}>Student</Form.Label>
                  <Form.Select
                    name="studentId"
                    value={form.studentId}
                    onChange={handleChange}
                    required
                    style={{ borderRadius: '8px', borderColor: theme.colors.border }}
                  >
                    <option value="">Select Student</option>
                    {students.map((s) => (
                      <option key={s._id} value={s._id}>{s.name} ({s.studentId || 'N/A'})</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId="courseId">
                  <Form.Label style={{ color: theme.colors.text, fontWeight: '500' }}>Course</Form.Label>
                  <Form.Select
                    name="courseId"
                    value={form.courseId}
                    onChange={handleChange}
                    required
                    style={{ borderRadius: '8px', borderColor: theme.colors.border }}
                  >
                    <option value="">Select Course</option>
                    {courses.map((c) => (
                      <option key={c._id} value={c._id}>{c.code} - {c.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={2}>
                <Form.Group controlId="marks">
                  <Form.Label style={{ color: theme.colors.text, fontWeight: '500' }}>Marks</Form.Label>
                  <Form.Control
                    type="number"
                    name="marks"
                    placeholder="Enter marks"
                    value={form.marks}
                    onChange={handleChange}
                    required
                    style={{ borderRadius: '8px', borderColor: theme.colors.border }}
                  />
                </Form.Group>
              </Col>

              <Col md={2}>
                <Form.Group controlId="grade">
                  <Form.Label style={{ color: theme.colors.text, fontWeight: '500' }}>Grade</Form.Label>
                  <Form.Control
                    type="text"
                    name="grade"
                    placeholder="Enter grade"
                    value={form.grade}
                    onChange={handleChange}
                    required
                    style={{ borderRadius: '8px', borderColor: theme.colors.border }}
                  />
                </Form.Group>
              </Col>

              <Col md={12} className="d-flex justify-content-end mt-3">
                <Button 
                  type="submit" 
                  style={{
                    ...theme.button.primary,
                    padding: '0.5rem 1.5rem',
                    fontWeight: '500'
                  }}
                >
                  {editingId ? 'Update Result' : 'Add Result'}
                </Button>
                {editingId && (
                  <Button 
                    type="button" 
                    onClick={resetForm}
                    style={{
                      ...theme.button.secondary,
                      padding: '0.5rem 1.5rem',
                      fontWeight: '500',
                      marginLeft: '0.75rem'
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
          <h5 style={{ margin: 0 }}>Results List</h5>
        </Card.Header>
        <Card.Body>
          {results.length === 0 ? (
            <p style={{ color: theme.colors.textSecondary, textAlign: 'center', padding: '2rem' }}>
              No results found. Add a result to get started.
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <Table hover style={{ margin: 0 }}>
                <thead style={{ backgroundColor: theme.colors.background }}>
                  <tr>
                    <th style={{ color: theme.colors.text, fontWeight: '600' }}>#</th>
                    <th style={{ color: theme.colors.text, fontWeight: '600' }}>Student Name</th>
                    <th style={{ color: theme.colors.text, fontWeight: '600' }}>Course</th>
                    <th style={{ color: theme.colors.text, fontWeight: '600' }}>Marks</th>
                    <th style={{ color: theme.colors.text, fontWeight: '600' }}>Grade</th>
                    <th style={{ color: theme.colors.text, fontWeight: '600' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, idx) => (
                    <tr key={r._id} style={{ verticalAlign: 'middle' }}>
                      <td style={{ color: theme.colors.textSecondary }}>{idx + 1}</td>
                      <td style={{ color: theme.colors.text, fontWeight: '500' }}>{r.student?.name || 'N/A'}</td>
                      <td style={{ color: theme.colors.text }}>
                        <div style={{ fontWeight: '500' }}>{r.course?.code || 'N/A'}</div>
                        <div style={{ color: theme.colors.textSecondary, fontSize: '0.875rem' }}>
                          {r.course?.name || ''}
                        </div>
                      </td>
                      <td style={{ color: theme.colors.text, fontWeight: '500' }}>{r.marks || 'N/A'}</td>
                      <td>
                        <span style={{
                          backgroundColor: getGradeColor(r.grade),
                          color: 'white',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          fontWeight: '500',
                          fontSize: '0.875rem'
                        }}>
                          {r.grade || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => startEdit(r)}
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

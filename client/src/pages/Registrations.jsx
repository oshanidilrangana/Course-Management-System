import { useEffect, useState } from 'react';
import { Container, Card, Button, Table, Spinner, Alert, Form, Row, Col } from 'react-bootstrap';
import { theme, pageContainerStyle, pageHeaderStyle } from '../theme/styles';

const API_BASE = "http://localhost:5000/api";
const API_STUDENTS = `${API_BASE}/students`;
const API_COURSES = `${API_BASE}/courses`;
const API_REGISTRATIONS = `${API_BASE}/registrations`;

export default function Registrations() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [form, setForm] = useState({ 
    studentId: "", 
    courseId: "", 
    semester: "" 
  });
  
  const [isLoading, setIsLoading] = useState({
    students: true,
    courses: true,
    registrations: true
  });
  const [error, setError] = useState("");

  // Fetch all data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch students
        const studentsRes = await fetch(API_STUDENTS);
        if (!studentsRes.ok) throw new Error('Failed to fetch students');
        const studentsData = await studentsRes.json();
        setStudents(Array.isArray(studentsData) ? studentsData : []);
        
        // Fetch courses
        const coursesRes = await fetch(API_COURSES);
        if (!coursesRes.ok) throw new Error('Failed to fetch courses');
        const coursesData = await coursesRes.json();
        setCourses(Array.isArray(coursesData) ? coursesData : []);
        
        // Fetch registrations
        console.log('Fetching registrations from:', API_REGISTRATIONS);
        const registrationsRes = await fetch(API_REGISTRATIONS);
        if (!registrationsRes.ok) {
          const errorText = await registrationsRes.text();
          console.error('Failed to fetch registrations:', registrationsRes.status, errorText);
          throw new Error('Failed to fetch registrations');
        }
        const registrationsData = await registrationsRes.json();
        console.log('Registrations data:', JSON.stringify(registrationsData, null, 2));
        
        // Log first registration details if available
        if (registrationsData.length > 0) {
          console.log('First registration student data:', {
            student: registrationsData[0].student,
            hasStudentId: registrationsData[0].student?.studentId !== undefined
          });
        }
        
        setRegistrations(Array.isArray(registrationsData) ? registrationsData : []);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading({ students: false, courses: false, registrations: false });
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear any previous errors when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validate form
    if (!form.studentId || !form.courseId || !form.semester.trim()) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch(API_REGISTRATIONS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: form.studentId,
          courseId: form.courseId,
          semester: form.semester.trim()
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to register student");
      }

      const data = await response.json();
      setRegistrations([...registrations, data]);
      setForm({ studentId: "", courseId: "", semester: "" });
      
    } catch (err) {
      setError(err.message);
    }
  };

  // Show loading state
  if (isLoading.students || isLoading.courses || isLoading.registrations) {
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
      <h2 style={pageHeaderStyle}>Course Registrations</h2>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Registration Form */}
      <Card className="mb-4" style={{ border: 'none', borderRadius: '12px', overflow: 'hidden', boxShadow: theme.shadows.card }}>
        <Card.Header style={{ 
          backgroundColor: theme.colors.primary, 
          color: 'white',
          border: 'none',
          padding: '1rem 1.5rem'
        }}>
          <h5 style={{ margin: 0 }}>Register Student for Course</h5>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={5}>
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
                    {students.map((student) => (
                      <option key={student._id} value={student._id}>
                        {student.name} ({student.studentId || 'N/A'})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={5}>
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
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.code} - {course.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={2}>
                <Form.Group controlId="semester">
                  <Form.Label style={{ color: theme.colors.text, fontWeight: '500' }}>Semester/Year</Form.Label>
                  <Form.Control
                    type="text"
                    name="semester"
                    placeholder="e.g., 2023/1"
                    value={form.semester}
                    onChange={handleChange}
                    required
                    style={{ borderRadius: '8px', borderColor: theme.colors.border }}
                  />
                </Form.Group>
              </Col>

              <Col md={12} className="d-flex justify-content-end">
                <Button 
                  type="submit"
                  style={{
                    ...theme.button.primary,
                    padding: '0.5rem 1.5rem',
                    fontWeight: '500',
                    marginTop: '1.5rem'
                  }}
                  disabled={!form.studentId || !form.courseId || !form.semester.trim()}
                >
                  Register
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Registrations Table */}
      <Card style={{ border: 'none', borderRadius: '12px', overflow: 'hidden', boxShadow: theme.shadows.card }}>
        <Card.Header style={{ 
          backgroundColor: theme.colors.primary, 
          color: 'white',
          border: 'none',
          padding: '1rem 1.5rem'
        }}>
          <h5 style={{ margin: 0 }}>Current Registrations</h5>
        </Card.Header>
        <Card.Body>
          {registrations.length === 0 ? (
            <p style={{ color: theme.colors.textSecondary, textAlign: 'center', padding: '2rem' }}>
              No registrations found.
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <Table hover style={{ margin: 0 }}>
                <thead style={{ backgroundColor: theme.colors.background }}>
                  <tr>
                    <th style={{ color: theme.colors.text, fontWeight: '600' }}>Student ID</th>
                    <th style={{ color: theme.colors.text, fontWeight: '600' }}>Student Name</th>
                    <th style={{ color: theme.colors.text, fontWeight: '600' }}>Course Name</th>
                    <th style={{ color: theme.colors.text, fontWeight: '600' }}>Semester</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg) => {
                    // Use nested student/course data if available, otherwise fall back to lookup
                    const student = reg.student || students.find(s => s._id === reg.studentId) || {};
                    const course = reg.course || courses.find(c => c._id === reg.courseId) || {};
                    
                    // Debug log for registration data
                    console.log('Rendering registration:', { 
                      regId: reg._id, 
                      student, 
                      course,
                      hasStudent: !!student,
                      hasCourse: !!course
                    });
                    
                    return (
                      <tr key={reg._id} style={{ verticalAlign: 'middle' }}>
                        <td style={{ color: theme.colors.text, fontWeight: '500' }}>
                          {student?.studentId || 'N/A'}
                        </td>
                        <td style={{ color: theme.colors.text }}>
                          {student?.name || 'N/A'}
                        </td>
                        <td style={{ color: theme.colors.textSecondary }}>
                          {course?.name || 'N/A'}
                        </td>
                        <td style={{ color: theme.colors.textSecondary }}>
                          {reg.semester || 'N/A'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

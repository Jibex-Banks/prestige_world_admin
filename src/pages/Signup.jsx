import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    setIsLoading(true);

    try {
      // API call to register new admin would go here
      // Replace formData with specific payload without confirmPassword
      // const payload = { username, firstname, lastname, email, phoneNumber, password } = formData
      // const response = await api.post('/register', payload);
      
      // Simulate API call for now
      setTimeout(() => {
        setSuccess('Admin user registered successfully!');
        setFormData({
          username: '',
          firstname: '',
          lastname: '',
          email: '',
          phoneNumber: '',
          password: '',
          confirmPassword: ''
        });
        setIsLoading(false);
      }, 1000);
      
    } catch (err) {
      setError(err.message || 'Failed to register admin. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="section-header d-flex justify-between align-center mb-4">
        <div>
          <h2>Register New Admin</h2>
          <p className="text-secondary mt-1">Create a new administrator account for Prestige World.</p>
        </div>
      </div>
      
      <div className="card shadow-sm p-4" style={{ maxWidth: '600px', margin: '0 auto' }}>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-input"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="e.g. admin_johndoe"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="firstname">First Name</label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                className="form-input"
                value={formData.firstname}
                onChange={handleChange}
                required
                placeholder="John"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="lastname">Last Name</label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                className="form-input"
                value={formData.lastname}
                onChange={handleChange}
                required
                placeholder="Doe"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="john.doe@prestige.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              className="form-input"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              placeholder="+1 (555) 000-0000"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
              <button 
                type="button" 
                className="password-toggle-btn"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                className="form-input"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
              <button 
                type="button" 
                className="password-toggle-btn"
                onClick={toggleConfirmPasswordVisibility}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
            style={{ marginTop: '2rem' }}
          >
            {isLoading ? 'Registering...' : 'Register New Admin'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;

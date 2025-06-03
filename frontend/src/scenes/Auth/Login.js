import { useState } from 'react';
import './Login.css';

// AuditCloud Logo Component
const AuditCloudLogo = ({ size = "large" }) => {
  const dimensions = size === "large" ? { width: 200, height: 60 } : { width: 150, height: 45 };
  
  return (
    <div className="logo-container">
      <svg width={dimensions.width} height={dimensions.height} viewBox="0 0 200 60">
        {/* Cloud shape */}
        <path
          d="M45 25c0-8.284-6.716-15-15-15-6.34 0-11.756 3.933-13.97 9.472C14.78 18.832 13.18 18.5 11.5 18.5 6.806 18.5 3 22.306 3 27s3.806 8.5 8.5 8.5h33c5.523 0 10-4.477 10-10s-4.477-10-10-10z"
          fill="#3498db"
          opacity="0.8"
        />
        
        {/* Checkmark inside cloud */}
        <path
          d="M20 27l4 4 8-8"
          stroke="white"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Magnifying glass */}
        <circle
          cx="42"
          cy="22"
          r="4"
          stroke="#2980b9"
          strokeWidth="2"
          fill="none"
        />
        <line
          x1="45"
          y1="25"
          x2="47"
          y2="27"
          stroke="#2980b9"
          strokeWidth="2"
          strokeLinecap="round"
        />
        
        {/* Text */}
        <text x="65" y="25" fontSize="18" fontWeight="700" fill="#2c3e50" fontFamily="system-ui, -apple-system, sans-serif">
          Audit
        </text>
        <text x="65" y="42" fontSize="18" fontWeight="400" fill="#3498db" fontFamily="system-ui, -apple-system, sans-serif">
          Cloud
        </text>
        
        {/* Decorative dots */}
        <circle cx="170" cy="15" r="2" fill="#3498db" opacity="0.6" />
        <circle cx="180" cy="20" r="1.5" fill="#3498db" opacity="0.4" />
        <circle cx="175" cy="30" r="1" fill="#3498db" opacity="0.3" />
      </svg>
    </div>
  );
};

export default function Login({ onSwitchToSignup, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      setLoading(false);
      onLogin(); // Simulate successful login
    }, 1000);
  };

  return (
    <div className="login-scene">
      <AuditCloudLogo />
      
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading} className="primary-button">
          {loading ? 'Connexion en cours...' : 'Se connecter'}
        </button>
      </form>

      <div className="auth-switch">
        Pas de compte ?{' '}
        <button onClick={onSwitchToSignup} className="text-button">
          Créer un compte
        </button>
      </div>
    </div>
  );
}
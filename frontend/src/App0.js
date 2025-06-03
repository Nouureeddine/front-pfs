import { useState } from 'react';
import './App.css';
import Login from './scenes/Auth/Login';
import Signup from './scenes/Auth/Signup';

function App() {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div className="App">
    

    <header>
        <h1>Welcome to AuditCloud – Moteur Hybride d’Audit de Conformité Cloud ISO/RGPD</h1>
      </header>

      <main className="auth-container">
        {activeTab === 'login' 
          ? <Login onSwitchToSignup={() => setActiveTab('signup')} />
          : <Signup onSwitchToLogin={() => setActiveTab('login')} />
        }
      </main>

      
    </div>


  );
}

export default App;
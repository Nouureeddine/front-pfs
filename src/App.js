import { useState } from 'react';
import './App.css';

import Nav from './Components/Nav/Nav';
import Docs from './Components/Docs/Docs';
import RecentAudits from './Components/RecentAudits/RecentAudits';
import Dashboard from './scenes/Dashboard/Dashboard';
import Login from './scenes/Auth/Login';
import Signup from './scenes/Auth/Signup';
import RuleManagement from './Components/RulesManagement/RulesManagement';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'recentAudits':
        return <RecentAudits />;
      case 'docs':
        return <Docs />;
      case 'rulesMg':
        return <RuleManagement />;
      default:
        return <Dashboard />;
    }
  };

  if (!isLoggedIn) {
    return showSignup ? (
      <Signup 
        onSwitchToLogin={() => setShowSignup(false)}
        onSignupSuccess={() => {
          alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
          setShowSignup(false);
        }}
      />
    ) : (
      <Login 
        onLogin={() => setIsLoggedIn(true)}
        onSwitchToSignup={() => setShowSignup(true)}
      />
    );
  }

  return (
    <div className="App" style={{ display: 'flex' }}>
      <div className="leftContainer">
        <Nav setActiveTab={setActiveTab} activeTab={activeTab} />
      </div>
      <div className="rightContainer" style={{ flex: 1, padding: '2rem' }}>
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
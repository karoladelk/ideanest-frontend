import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './components/SignIn';
import OrganizationDashboard from './components/Organization';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/dashboard" element={<OrganizationDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

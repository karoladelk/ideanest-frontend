import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './components/SignUp';
import OrganizationDashboard from './components/Organization';
import SignIn from './components/SignIn';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />         
        <Route path="/signin" element={<SignIn />} />   
        <Route path="/dashboard" element={<OrganizationDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
"use client"
import { useState } from 'react';
import HomePage from './pages/HomePage';
import InsuranceForm from './pages/InsuranceForm';

function App() {
  const [showForm, setShowForm] = useState(false);

  if (!showForm) {
    return <HomePage onStart={() => setShowForm(true)} />;
  }

  return <InsuranceForm onBack={() => setShowForm(false)} />;
}

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import EventDetailPage from './pages/EventDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyTicketsPage from './pages/MyTicketsPage';

import OrganizerDashboardPage from './pages/OrganizerDashboardPage';
import ManageEventPage from './pages/ManageEventPage';
import CreateEventPage from './pages/CreateEventPage';
import EditEventPage from './pages/EditEventPage';

import OrganizerRoute from './components/OrganizerRoute';

import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/event/:id" element={<EventDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="/my-tickets" element={<MyTicketsPage />} />

            <Route element={<OrganizerRoute />}>
              <Route path="/organizer/dashboard" element={<OrganizerDashboardPage />} />
              <Route path="/organizer/event/:eventId/manage" element={<ManageEventPage />} />
              <Route path="/organizer/event/create" element={<CreateEventPage />} />
              <Route path="/organizer/event/:eventId/edit" element={<EditEventPage />} />
            </Route>

            <Route path="*" element={<h2>Page Not Found</h2>} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;

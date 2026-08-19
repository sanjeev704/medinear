import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import Home from './pages/Home.jsx'
import FindMedicine from './pages/FindMedicine.jsx'
import PharmacyProfile from './pages/PharmacyProfile.jsx'
import SignIn from './pages/SignIn.jsx'
import RegisterPharmacy from './pages/RegisterPharmacy.jsx'
import OwnerDashboard from './pages/OwnerDashboard.jsx'
import Inventory from './pages/Inventory.jsx'
import AdminConsole from './pages/AdminConsole.jsx'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/find-medicine" element={<FindMedicine />} />
        <Route path="/pharmacy/:id" element={<PharmacyProfile />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/register-pharmacy" element={<RegisterPharmacy />} />
        <Route
          path="/owner"
          element={
            <ProtectedRoute role="owner">
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/inventory"
          element={
            <ProtectedRoute role="owner">
              <Inventory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminConsole />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </>
  )
}

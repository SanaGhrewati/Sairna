import "./App.css"
import { Routes, Route } from "react-router-dom"

import MainLayout from "./layouts/MainLayout"
import HomePage from "./pages/homepage/homepage"
import ResultsPage from "./pages/results/resultspage"
import LoginPage from "./pages/auth/loginpage"
import RegisterPage from "./pages/auth/registerpage"
import BookingPage from "./pages/booking/bookingpage"
import SuccessPage from "./pages/success/successpage"
import AccountPage from "./pages/account/accountpage"
import TripsPage from "./pages/trips/tripspage"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import HelpPage from "./pages/help/helppage"
import AboutPage from "./pages/about/aboutpage"
import CompaniesPage from "./pages/companies/companiespage"
import TrackingPage from "./pages/tracking/trackingpage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>

        <Route index element={<HomePage />} />

        <Route path="results" element={<ResultsPage />} />

        <Route
          path="booking/:tripId"
          element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="account"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="trips"
          element={
            <ProtectedRoute>
              <TripsPage />
            </ProtectedRoute>
          }
        />

        <Route path="success" element={<SuccessPage />} />
        
        <Route path="/help" element={<HelpPage />} />

        <Route path="/about" element={<AboutPage/>}/>

        <Route path="/companies" element={<CompaniesPage/>} />
        
        <Route path="/tracking" element={<TrackingPage/>} />
        
      </Route>

      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />

    </Routes>
  )
}

export default App
import "./App.css"
import { Routes, Route } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import HomePage from "./pages/homepage/homepage"
import ResultsPage from "./pages/results/resultspage"
import BookingPage from "./pages/booking/bookingpage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="results" element={<ResultsPage />} />
        <Route path="booking/:tripId" element={<BookingPage />} />
      </Route>
    </Routes>
  )
}

export default App
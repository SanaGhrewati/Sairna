import { Navigate, useLocation } from "react-router-dom"
import { useCurrentPassenger } from "../../hooks/use-auth"

function ProtectedRoute({ children }) {
  const location = useLocation()
  const token = localStorage.getItem("passengerToken")

  const {
    data: user,
    isLoading,
    isError,
  } = useCurrentPassenger()

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  if (isLoading) {
    return (
      <div
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-bg"
      >
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />

          <p className="text-sm font-bold text-muted">
            جاري التحقق من تسجيل الدخول...
          </p>
        </div>
      </div>
    )
  }

  if (isError || !user) {
    localStorage.removeItem("passengerToken")

    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    )
  }
  return children
}

export default ProtectedRoute
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getMyBookings, getBooking, cancelBooking } from "../api/bookings-api"

export const useMyBookings = () => {
  const token =
    localStorage.getItem("passengerToken") ||
    sessionStorage.getItem("passengerToken")

  return useQuery({
    queryKey: ["my-bookings"],
    queryFn: getMyBookings,
    enabled: !!token,
    retry: false,
  })
}

export const useBooking = (id) => {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: () => getBooking(id),
    enabled: !!id,
    retry: false,
  })
}

export const useCancelBooking = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] })
    },
  })
}
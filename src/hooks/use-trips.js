import { useQuery } from "@tanstack/react-query"
import { getTrips, getTrip, getTripSeats } from "../api/trips-api"

export const useGetTrips = (filters) => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["trips", filters],
    queryFn: () => getTrips(filters),
    enabled: !!filters?.date,
  })

  return { data, isError, isLoading }
}

export const useGetTrip = (id) => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["trip", id],
    queryFn: () => getTrip(id),
    enabled: !!id,
  })

  return { data, isError, isLoading }
}

export const useGetTripSeats = (id) => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["trip-seats", id],
    queryFn: () => getTripSeats(id),
    enabled: !!id,
  })

  return { data, isError, isLoading }
}
import sairnaApi from "./axios"

export const getMyBookings = async () => {
  const response = await sairnaApi.get("/bookings/me")
  return response.data
}

export const getBooking = async (id) => {
  const response = await sairnaApi.get(`/bookings/${id}`)
  return response.data
}

export const cancelBooking = async (id) => {
  const response = await sairnaApi.post(`/bookings/${id}/cancel`)
  return response.data
}
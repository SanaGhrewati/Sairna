import sairnaApi from "./axios"

export const getTrips = async ({
  originId,
  destinationId,
  companyId,
  date,
}) => {
  const response = await sairnaApi.get("/trips", {
    params: {
      originId,
      destinationId,
      companyId,
      date,
    },
  })

  return response.data
}

export const getTrip = async (id) => {
  const response = await sairnaApi.get(`/trips/${id}`)

  return response.data
}

export const getTripSeats = async (id) => {
  const response = await sairnaApi.get(`/trips/${id}/seats`)

  return response.data
}
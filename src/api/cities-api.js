import sairnaApi from "./axios"

export const getCities = async () => {
  const response = await sairnaApi.get("/cities")
  return response.data
}
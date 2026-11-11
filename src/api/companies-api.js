import sairnaApi from "./axios"

export const getCompanies = async () => {
  const response = await sairnaApi.get("/companies")
  return response.data
}

export const getCompany = async (id) => {
  const response = await sairnaApi.get(`/companies/${id}`)
  return response.data
}
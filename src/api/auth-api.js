import sairnaApi from "./axios"

export const registerPassenger = async ({
  name,
  email,
  password,
}) => {
  const response = await sairnaApi.post("/auth/register", {
    name,
    email,
    password,
  })

  return response.data
}

export const loginPassenger = async ({
  email,
  password,
}) => {
  const response = await sairnaApi.post("/auth/login", {
    email,
    password,
  })

  return response.data
}

export const getCurrentPassenger = async () => {
  const response = await sairnaApi.get("/auth/me")

  return response.data
}
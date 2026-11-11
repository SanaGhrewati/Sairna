import { useMutation, useQuery } from "@tanstack/react-query"

import {
  registerPassenger,
  loginPassenger,
  getCurrentPassenger,
} from "../api/auth-api"


export const useRegisterPassenger = () => {
  return useMutation({
    mutationFn: registerPassenger,
  })
}


export const useLoginPassenger = () => {
  return useMutation({
    mutationFn: loginPassenger,
  })
}


export const useCurrentPassenger = () => {
  const token = localStorage.getItem("passengerToken")

  return useQuery({
    queryKey: ["current-passenger"],
    queryFn: getCurrentPassenger,
    enabled: !!token,
    retry: false,
  })
}
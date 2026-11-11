import { useQuery } from "@tanstack/react-query"
import { getCompanies, getCompany } from "../api/companies-api"

export const useGetCompanies = () => {
  return useQuery({
    queryKey: ["companies"],
    queryFn: getCompanies,
    staleTime: 1000 * 60 * 30,
  })
}

export const useGetCompany = (id) => {
  return useQuery({
    queryKey: ["company", id],
    queryFn: () => getCompany(id),
    enabled: !!id,
  })
}
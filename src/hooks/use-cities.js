import { useQuery } from "@tanstack/react-query"
import { getCities } from "../api/cities-api"

export const useGetCities = () => {
  return useQuery({
    queryKey: ["cities"],
    queryFn: getCities,
    staleTime: 1000 * 60 * 30,
  })
}
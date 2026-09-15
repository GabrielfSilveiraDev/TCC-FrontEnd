import axios from "axios"
import { API_BASE_URL } from "@/lib/constants"

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor de resposta para tratamento global de erros
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.detail ?? error.message ?? "Erro desconhecido"
    console.error("[API Error]", message)
    return Promise.reject(new Error(message))
  }
)

export default apiClient


"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  image?: string
  role: "student" | "investor"
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: Partial<User> & { password: string }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Simular verificação de autenticação no carregamento inicial
  useEffect(() => {
    const checkAuth = () => {
      // Em uma aplicação real, verificaríamos um token JWT ou sessão
      const storedUser = localStorage.getItem("user")

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
        } catch (e) {
          localStorage.removeItem("user")
          setUser(null)
        }
      } else {
        setUser(null)
      }

      // Sempre definir isLoading como false no final da verificação
      setIsLoading(false)
    }

    // Pequeno atraso para simular verificação de autenticação
    setTimeout(checkAuth, 500)
  }, [])

  // Redirecionar usuários não autenticados apenas de páginas protegidas específicas
  useEffect(() => {
    const protectedRoutes = [
      "/projects/new",
      "/projects/edit",
      "/projects/my-projects",
      "/profile",
      "/messages",
      "/favorites",
      "/notifications",
    ]

    if (!isLoading && !user && protectedRoutes.some((route) => pathname.startsWith(route))) {
      router.push("/login")
    }
  }, [user, isLoading, pathname, router])

  const login = async (email: string, password: string) => {
    setIsLoading(true)

    try {
      // Simulação de login - em uma aplicação real, isso seria uma chamada API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Usuário simulado
      const mockUser: User = {
        id: "user-1",
        name: "Vitilio Sousa",
        email: email,
        role: "student",
        image: "/project/4.jpg",
      }

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))

      // Redirecionar para a página de projetos
      router.push("/projects")
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: Partial<User> & { password: string }) => {
    setIsLoading(true)

    try {
      // Simulação de registro - em uma aplicação real, isso seria uma chamada API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Usuário simulado
      const mockUser: User = {
        id: "user-1", // Usando o mesmo ID para garantir acesso aos projetos mockados
        name: `${userData.name || "Novo"}`,
        email: userData.email || "usuario@exemplo.com",
        role: userData.role || "student",
        image: userData.image,
      }

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
      router.push("/projects")
    } catch (error) {
      console.error("Erro ao registrar:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/projects")
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}

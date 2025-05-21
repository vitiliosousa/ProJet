"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { LogIn, UserPlus } from "lucide-react"
import Link from "next/link"

interface AuthCheckProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  showDialog?: boolean
  action?: string
}

export default function AuthCheck({
  children,
  fallback,
  showDialog = true,
  action = "realizar esta ação",
}: AuthCheckProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false) // Simulação - em produção, isso viria de um hook de autenticação
  const [open, setOpen] = useState(false)
  const router = useRouter()

  // Simulação - em produção, isso seria verificado através de um hook de autenticação
  if (isAuthenticated) {
    return <>{children}</>
  }

  if (!showDialog) {
    return <>{fallback || null}</>
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{fallback || <Button>{children}</Button>}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Autenticação necessária</DialogTitle>
          <DialogDescription>Você precisa estar logado para {action}.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center gap-4">
            <p className="text-center text-sm text-muted-foreground">Faça login ou crie uma conta para continuar</p>
            <div className="flex gap-4 w-full">
              <Link href="/login" className="w-full">
                <Button className="w-full" onClick={() => setOpen(false)}>
                  <LogIn className="mr-2 h-4 w-4" />
                  Entrar
                </Button>
              </Link>
              <Link href="/register" className="w-full">
                <Button variant="outline" className="w-full" onClick={() => setOpen(false)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Cadastrar
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

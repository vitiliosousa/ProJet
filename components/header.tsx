"use client"

import Image from "next/image"
import projet from "@/public/projet.svg"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./mode-toggle"
import { usePathname } from "next/navigation"
import { Menu, X, Lightbulb, Bell, User, FileText, MessageSquare, Heart, LogOut } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useAuth } from "@/components/auth-provider"
import { UserAccountNav } from "@/components/user-account-nav"

import NotificationsIcon from "./NotificationsIcon"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [scrolled, setScrolled] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

  // Close mobile menu when switching to desktop
  useEffect(() => {
    if (isDesktop) {
      setIsOpen(false)
    }
  }, [isDesktop])

  // Close mobile menu when navigating
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Detect scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 px-6 pt-2 w-full transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-md border-b shadow-sm" : "bg-transparent border-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
            <Image src={projet} alt="" className="size-28" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-4 items-center">
          {isAuthenticated && user ? (
            <>
              {isAuthenticated && (
                <NotificationsIcon/>
              )}
              <UserAccountNav user={user} />
            </>
          ) : (
            <>
              <Link href="/login" passHref>
                <Button variant="outline" size="sm" className="button-hover-effect">
                  Entrar
                </Button>
              </Link>
              <Link href="/register" passHref>
                <Button size="sm" className="button-hover-effect">
                  Cadastrar
                </Button>
              </Link>
            </>
          )}
          <ModeToggle />
        </nav>

        {/* Mobile Navigation Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle Menu"
            onClick={() => setIsOpen(!isOpen)}
            className="transition-transform active:scale-90"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="fixed inset-0 top-16 z-50 glass-effect animate-slideIn md:hidden">
          <nav className="container flex flex-col gap-6 p-6">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-3 p-2">
                  <div className="h-10 w-10 overflow-hidden rounded-full">
                    <img
                      src={user.image || "/placeholder.svg?height=40&width=40"}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </div>
                </div>
                <Link href="/notifications" className="flex items-center gap-2 p-2 hover:bg-muted rounded-md">
                  <div className="relative">
                    <Bell className="h-4 w-4" />
                    <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-primary text-[8px] text-primary-foreground">
                      3
                    </span>
                  </div>
                  <span>Notificações</span>
                </Link>
                <div className="flex flex-col gap-1">
                  <Link href="/profile" className="flex items-center gap-2 p-2 hover:bg-muted rounded-md">
                    <User className="h-4 w-4" />
                    <span>Minha conta</span>
                  </Link>
                  <Link href="/projects/my-projects" className="flex items-center gap-2 p-2 hover:bg-muted rounded-md">
                    <FileText className="h-4 w-4" />
                    <span>Projetos</span>
                  </Link>
                  <Link href="/messages" className="flex items-center gap-2 p-2 hover:bg-muted rounded-md">
                    <MessageSquare className="h-4 w-4" />
                    <span>Mensagens</span>
                  </Link>
                  <Link href="/favorites" className="flex items-center gap-2 p-2 hover:bg-muted rounded-md">
                    <Heart className="h-4 w-4" />
                    <span>Favoritos</span>
                  </Link>
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="w-full" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2 mt-4">
                <Link href="/login" passHref>
                  <Button variant="outline" className="w-full">
                    Entrar
                  </Button>
                </Link>
                <Link href="/register" passHref>
                  <Button className="w-full">Cadastrar</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth-provider"
import { Camera, Save } from "lucide-react"

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Dados do formulário
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    university: "Universidade Federal",
    course: "Engenharia de Software",
    bio: "Estudante de engenharia apaixonado por tecnologia e inovação.",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulação de salvamento
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsLoading(false)
    // Em uma aplicação real, aqui atualizaríamos os dados no backend
    alert("Perfil atualizado com sucesso!")
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulação de salvamento
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsLoading(false)
    // Em uma aplicação real, aqui atualizaríamos a senha no backend
    alert("Senha atualizada com sucesso!")

    // Limpar campos de senha
    setFormData((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }))
  }

  if (!user) {
    router.push("/login")
    return null
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold tracking-tight gradient-heading">Minha Conta</h1>

        <div className="grid gap-6 md:grid-cols-[250px_1fr]">
          {/* Sidebar com foto e informações básicas */}
          <div className="space-y-6">
            <Card className="rounded-xl glass-card">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="relative mb-4 group">
                  <Avatar className="h-32 w-32 border-4 border-primary/20">
                    <AvatarImage src={user.image || "/placeholder.svg?height=128&width=128"} alt={user.name} />
                    <AvatarFallback className="text-4xl">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 rounded-full bg-primary p-2 cursor-pointer hover:bg-primary/80 transition-colors">
                    <Camera className="h-4 w-4 text-white" />
                  </div>
                </div>
                <h3 className="font-bold text-xl">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground mt-1">Estudante</p>
              </CardContent>
            </Card>

            <Card className="rounded-xl glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Projetos</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Visualizações</span>
                    <span className="font-medium">124</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Curtidas</span>
                    <span className="font-medium">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Mensagens</span>
                    <span className="font-medium">5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Conteúdo principal */}
          <div>
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2 rounded-xl">
                <TabsTrigger value="profile" className="rounded-lg">
                  Informações Pessoais
                </TabsTrigger>
                <TabsTrigger value="security" className="rounded-lg">
                  Segurança
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-4 animate-fadeIn">
                <Card className="rounded-xl glass-card">
                  <CardHeader>
                    <CardTitle>Informações Pessoais</CardTitle>
                    <CardDescription>Atualize suas informações pessoais</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSaveProfile} className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome Completo</Label>
                          <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="university">Universidade</Label>
                          <Input
                            id="university"
                            name="university"
                            value={formData.university}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="course">Curso</Label>
                          <Input id="course" name="course" value={formData.course} onChange={handleChange} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Biografia</Label>
                        <Input id="bio" name="bio" value={formData.bio} onChange={handleChange} />
                        <p className="text-xs text-muted-foreground">
                          Breve descrição sobre você que será exibida no seu perfil.
                        </p>
                      </div>

                      <div className="flex justify-end">
                        <Button type="submit" disabled={isLoading} className="button-hover-effect">
                          {isLoading ? (
                            "Salvando..."
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Salvar Alterações
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="mt-4 animate-fadeIn">
                <Card className="rounded-xl glass-card">
                  <CardHeader>
                    <CardTitle>Segurança</CardTitle>
                    <CardDescription>Atualize sua senha</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Senha Atual</Label>
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          value={formData.currentPassword}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">Nova Senha</Label>
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={formData.newPassword}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button type="submit" disabled={isLoading} className="button-hover-effect">
                          {isLoading ? "Atualizando..." : "Atualizar Senha"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

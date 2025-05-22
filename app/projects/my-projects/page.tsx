"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { Eye, Heart, MessageSquare, Plus, FileText, BarChart, Edit, Trash2, Loader2 } from "lucide-react"
import Link from "next/link"

interface Project {
  id: number
  authorId: string
  title: string
  description: string
  area: string
  status: "Ativo" | "Rascunho"
  views: number
  likes: number
  messages: number
  lastUpdated: string
}

// Mock data for student projects
const mockStudentProjects: Project[] = [
  {
    id: 1,
    authorId: "user-1", // ID do usuário logado
    title: "Sistema de Monitoramento Ambiental IoT",
    description: "Dispositivo IoT para monitoramento de qualidade do ar e água em tempo real.",
    area: "Engenharia Ambiental",
    status: "Ativo",
    views: 124,
    likes: 24,
    messages: 5,
    lastUpdated: "2023-05-10",
  },
  {
    id: 2,
    authorId: "user-1", // ID do usuário logado
    title: "Aplicativo de Assistência Médica para Idosos",
    description: "Plataforma mobile que auxilia idosos no gerenciamento de medicamentos.",
    area: "Ciência da Computação",
    status: "Rascunho",
    views: 0,
    likes: 0,
    messages: 0,
    lastUpdated: "2023-05-15",
  },
  {
    id: 3,
    authorId: "user-1", // ID do usuário logado
    title: "Plataforma de Microcrédito para Pequenos Empreendedores",
    description: "Sistema financeiro que conecta investidores a pequenos empreendedores locais.",
    area: "Administração",
    status: "Ativo",
    views: 87,
    likes: 15,
    messages: 3,
    lastUpdated: "2023-05-12",
  },
]

export default function MyProjectsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [projects, setProjects] = useState<Project[]>([])

  // Redirecionar para login se não estiver autenticado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
      return
    }

    // Carregar projetos do usuário apenas se estiver autenticado
    if (isAuthenticated) {
      const loadUserProjects = async () => {
        setIsLoading(true)
        try {
          // Simulação - em produção, isso seria uma chamada API
          await new Promise((resolve) => setTimeout(resolve, 800))

          // Filtrar apenas os projetos do usuário atual
          // Assumindo que o usuário logado tem id "user-1"
          const userProjects = mockStudentProjects.filter((project) => project.authorId === "user-1")
          setProjects(userProjects)
        } catch (error) {
          console.error("Erro ao carregar projetos:", error)
        } finally {
          setIsLoading(false)
        }
      }

      loadUserProjects()
    }
  }, [isAuthenticated, authLoading, router])

  // Mostrar tela de carregamento enquanto verifica autenticação ou carrega projetos
  if (authLoading || isLoading) {
    return (
      <div className="container py-8 md:py-12 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Carregando seus projectos...</p>
      </div>
    )
  }

  // Se não estiver autenticado, não renderiza nada (o redirecionamento já foi feito)
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight gradient-heading">Meus Projectos</h1>
          <Link href="/projects/new">
            <Button className="button-hover-effect">
              <Plus className="mr-2 h-4 w-4" />
              Novo Projecto
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projectos</CardTitle>
              <div className="h-4 w-4 text-muted-foreground">
                <FileText />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
              <p className="text-xs text-muted-foreground">+1 desde o último mês</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
              <div className="h-4 w-4 text-muted-foreground">
                <Eye />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.reduce((sum, project) => sum + project.views, 0)}</div>
              <p className="text-xs text-muted-foreground">+24% desde o último mês</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Curtidas</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.reduce((sum, project) => sum + project.likes, 0)}</div>
              <p className="text-xs text-muted-foreground">+12% desde o último mês</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mensagens</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.reduce((sum, project) => sum + project.messages, 0)}</div>
              <p className="text-xs text-muted-foreground">+3 novas mensagens</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 md:w-auto">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="active">Ativos</TabsTrigger>
            <TabsTrigger value="draft">Rascunhos</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card className="rounded-xl glass-card">
              <CardHeader>
                <CardTitle>Todos os Projetos</CardTitle>
                <CardDescription>Gerencie todos os seus projetos cadastrados na plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                {projects.length > 0 ? (
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div key={project.id} className="flex items-center justify-between border-b pb-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{project.title}</h3>
                            <Badge variant={project.status === "Ativo" ? "default" : "secondary"}>
                              {project.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">{project.description}</p>
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" /> {project.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="h-3 w-3" /> {project.likes}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" /> {project.messages}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/projects/metrics/${project.id}`}>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                              <BarChart className="h-4 w-4" />
                              <span className="sr-only">Métricas</span>
                            </Button>
                          </Link>
                          <Link href={`/projects/edit/${project.id}`}>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Editar</span>
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Excluir</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-muted p-4">
                      <FileText className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">Nenhum projeto encontrado</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Você ainda não tem projetos. Crie seu primeiro projeto!
                    </p>
                    <Link href="/projects/new" className="mt-4">
                      <Button>Criar Projeto</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <Card className="rounded-xl glass-card">
              <CardHeader>
                <CardTitle>Projetos Ativos</CardTitle>
                <CardDescription>Projetos publicados e visíveis para investidores</CardDescription>
              </CardHeader>
              <CardContent>
                {projects.filter((project) => project.status === "Ativo").length > 0 ? (
                  <div className="space-y-4">
                    {projects
                      .filter((project) => project.status === "Ativo")
                      .map((project) => (
                        <div key={project.id} className="flex items-center justify-between border-b pb-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{project.title}</h3>
                              <Badge variant="default">Ativo</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-1">{project.description}</p>
                            <div className="flex gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" /> {project.views}
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart className="h-3 w-3" /> {project.likes}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" /> {project.messages}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Link href={`/projects/metrics/${project.id}`}>
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                <BarChart className="h-4 w-4" />
                                <span className="sr-only">Métricas</span>
                              </Button>
                            </Link>
                            <Link href={`/projects/edit/${project.id}`}>
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Editar</span>
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Excluir</span>
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-muted p-4">
                      <FileText className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">Nenhum projeto ativo</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Você não tem projetos ativos. Ative um projeto ou crie um novo!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="draft" className="space-y-4">
            <Card className="rounded-xl glass-card">
              <CardHeader>
                <CardTitle>Rascunhos</CardTitle>
                <CardDescription>Projetos em desenvolvimento, não visíveis para investidores</CardDescription>
              </CardHeader>
              <CardContent>
                {projects.filter((project) => project.status === "Rascunho").length > 0 ? (
                  <div className="space-y-4">
                    {projects
                      .filter((project) => project.status === "Rascunho")
                      .map((project) => (
                        <div key={project.id} className="flex items-center justify-between border-b pb-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{project.title}</h3>
                              <Badge variant="secondary">Rascunho</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-1">{project.description}</p>
                            <div className="flex gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" /> {project.views}
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart className="h-3 w-3" /> {project.likes}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" /> {project.messages}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Link href={`/projects/edit/${project.id}`}>
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Editar</span>
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Excluir</span>
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-muted p-4">
                      <FileText className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">Nenhum rascunho</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Você não tem projetos em rascunho. Crie um novo projeto!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

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

// Atualizar a interface do Projeto para corresponder aos dados da API
interface Project {
  id: string // Ou number, se o ID do Supabase for numérico
  user_id?: string // ID do usuário do Supabase (se aplicável e retornado pela API)
  titulo_do_projeto: string
  descricao_curta: string
  area_do_projeto: string
  status_do_projeto: "Ativo" | "Rascunho" // Ajustar conforme os valores reais
  // Campos de estatísticas (podem não vir diretamente da API de projetos, necessitando de outra fonte ou cálculo)
  views?: number
  likes?: number
  messages?: number
  updated_at?: string // Ou created_at, para data da última atualização
  // Adicionar quaisquer outros campos relevantes retornados pela API
}


export default function MyProjectsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [projects, setProjects] = useState<Project[]>([])
  const [isDeleting, setIsDeleting] = useState<string | null>(null) // Para feedback de exclusão

  // Redirecionar para login se não estiver autenticado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
      return // Retorna para evitar execução adicional
    }

    // Carregar projetos do usuário apenas se estiver autenticado e o usuário estiver definido
    if (isAuthenticated && user) {
      const loadUserProjects = async () => {
        setIsLoading(true)
        try {
          // A API /api/projects retorna todos os projetos.
          // Precisaremos filtrar pelo user_id no frontend ou, idealmente,
          // criar um endpoint específico para buscar projetos do usuário logado (ex: /api/users/me/projects)
          // Por agora, vamos buscar todos e filtrar.
          const response = await fetch(`/api/projects`) // Idealmente, seria /api/projects?userId=${user.id}
          if (!response.ok) {
            throw new Error("Falha ao buscar projetos do usuário")
          }
          const allProjects: Project[] = await response.json()
          // Filtrar projetos pelo user_id (assumindo que a API retorna user_id ou que você o adiciona ao criar)
          // Se o Supabase RLS estiver configurado, /api/projects já pode retornar apenas os projetos do usuário.
          // Se não, você precisará de um campo user_id na tabela 'project'.
          // Para este exemplo, vamos assumir que a API /api/projects já retorna apenas os projetos do usuário autenticado
          // ou que você tem uma forma de identificar o user_id no objeto do projeto.
          // Se a tabela 'project' não tem 'user_id', você precisará ajustar isso no backend (POST) e aqui.
          // Por enquanto, se 'user_id' não estiver presente, exibirá todos os projetos (o que não é o ideal para "Meus Projetos").
          const userProjects = allProjects.filter(p => p.user_id === user.id || !p.user_id) // Ajuste esta lógica
          setProjects(userProjects)
        } catch (error) {
          console.error("Erro ao carregar projetos:", error)
          // Adicionar tratamento de erro para o usuário, se necessário
        } finally {
          setIsLoading(false)
        }
      }

      loadUserProjects()
    } else if (!authLoading && isAuthenticated && !user) {
      // Caso onde está autenticado mas o objeto user ainda não carregou.
      // Pode-se adicionar um pequeno delay ou esperar pelo user.
      // Por simplicidade, não faremos nada aqui, o useEffect será re-executado quando user mudar.
    }
  }, [isAuthenticated, authLoading, user, router])


  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.")) {
      return
    }
    setIsDeleting(projectId)
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Falha ao excluir projeto")
      }
      setProjects(prevProjects => prevProjects.filter(p => p.id !== projectId))
      // Adicionar notificação de sucesso (ex: usando um sistema de toast)
    } catch (error) {
      console.error("Erro ao excluir projeto:", error)
      // Adicionar notificação de erro
    } finally {
      setIsDeleting(null)
    }
  }

  // Mostrar tela de carregamento enquanto verifica autenticação ou carrega projetos
  if (authLoading || (isAuthenticated && isLoading)) { // Adicionado (isAuthenticated && isLoading)
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
                      <div key={project.id} className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{project.titulo_do_projeto}</h3>
                            <Badge variant={project.status_do_projeto === "Ativo" ? "default" : "secondary"}>
                              {project.status_do_projeto}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">{project.descricao_curta}</p>
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" /> {project.views || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="h-3 w-3" /> {project.likes || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" /> {project.messages || 0}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/projects/metrics/${project.id}`}>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <BarChart className="h-4 w-4" />
                              <span className="sr-only">Métricas</span>
                            </Button>
                          </Link>
                          <Link href={`/projects/edit/${project.id}`}>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Editar</span>
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteProject(project.id)}
                            disabled={isDeleting === project.id}
                          >
                            {isDeleting === project.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
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
                {projects.filter((project) => project.status_do_projeto === "Ativo").length > 0 ? (
                  <div className="space-y-4">
                    {projects
                      .filter((project) => project.status_do_projeto === "Ativo")
                      .map((project) => (
                        <div key={project.id} className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{project.titulo_do_projeto}</h3>
                              <Badge variant="default">Ativo</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-1">{project.descricao_curta}</p>
                            <div className="flex gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" /> {project.views || 0}
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart className="h-3 w-3" /> {project.likes || 0}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" /> {project.messages || 0}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Link href={`/projects/metrics/${project.id}`}>
                              <Button variant="outline" size="icon" className="h-8 w-8">
                                <BarChart className="h-4 w-4" />
                                <span className="sr-only">Métricas</span>
                              </Button>
                            </Link>
                            <Link href={`/projects/edit/${project.id}`}>
                              <Button variant="outline" size="icon" className="h-8 w-8">
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Editar</span>
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteProject(project.id)}
                              disabled={isDeleting === project.id}
                            >
                              {isDeleting === project.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
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
                {projects.filter((project) => project.status_do_projeto === "Rascunho").length > 0 ? (
                  <div className="space-y-4">
                    {projects
                      .filter((project) => project.status_do_projeto === "Rascunho")
                      .map((project) => (
                        <div key={project.id} className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{project.titulo_do_projeto}</h3>
                              <Badge variant="secondary">Rascunho</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-1">{project.descricao_curta}</p>
                            <div className="flex gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" /> {project.views || 0}
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart className="h-3 w-3" /> {project.likes || 0}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" /> {project.messages || 0}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Link href={`/projects/edit/${project.id}`}>
                              <Button variant="outline" size="icon" className="h-8 w-8">
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Editar</span>
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteProject(project.id)}
                              disabled={isDeleting === project.id}
                            >
                              {isDeleting === project.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
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

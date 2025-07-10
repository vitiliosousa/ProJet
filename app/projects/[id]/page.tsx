"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageSquare, Share, BookmarkPlus, ArrowLeft, Eye, Calendar, School } from "lucide-react"
import Link from "next/link"
import AuthCheck from "@/components/auth-check"
import ProjectComments from "@/components/project-comments"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuth } from "@/components/auth-provider" // Importar useAuth

// Interface para os dados do projeto (deve corresponder à API)
interface ProjectData {
  id: string
  titulo_do_projeto: string
  descricao_curta: string
  descricao_completa: string
  area_do_projeto: string
  nome_completo_autor?: string // Assumindo que estes campos podem vir da API
  universidade_autor?: string
  status_do_projeto: string
  imagem_principal?: string
  imagens_adicionais?: string[] // Array de URLs de imagens
  tags?: string[] // Array de strings
  objetivos?: string[] // Array de strings
  created_at: string // Data de criação/publicação
  // Adicionar outros campos conforme necessário (ex: views, likes, etc., se vierem da API)
  views?: number
  likes?: number
  // user_id para identificar o autor para mensagens, etc.
  user_id?: string
}

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated, user } = useAuth() // Usar o hook de autenticação real
  const projectId = params.id as string // Garantir que projectId é string

  const [project, setProject] = useState<ProjectData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [liked, setLiked] = useState(false) // Lógica de like pode precisar de API
  const [bookmarked, setBookmarked] = useState(false) // Lógica de bookmark pode precisar de API
  const [likeCount, setLikeCount] = useState(0)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [activeTab, setActiveTab] = useState("description")

  useEffect(() => {
    if (projectId) {
      const fetchProjectDetails = async () => {
        setIsLoading(true)
        setError(null)
        try {
          const response = await fetch(`/api/projects/${projectId}`)
          if (!response.ok) {
            if (response.status === 404) {
              throw new Error("Projeto não encontrado.")
            }
            throw new Error("Falha ao buscar detalhes do projeto.")
          }
          const data: ProjectData = await response.json()
          setProject(data)
          setLikeCount(data.likes || 0) // Inicializar likeCount se disponível
          // Aqui você pode querer buscar o estado de 'liked' e 'bookmarked' para o usuário atual
        } catch (err: any) {
          console.error(err)
          setError(err.message || "Ocorreu um erro.")
        } finally {
          setIsLoading(false)
        }
      }
      fetchProjectDetails()
    } else {
      setError("ID do projeto não fornecido.")
      setIsLoading(false)
    }
  }, [projectId])

  const handleLike = async () => { // A lógica de like deve interagir com a API
    if (!isAuthenticated || !project) return

    // Exemplo: Chamar uma API para dar like/unlike
    // const newLikedState = !liked
    // try {
    //   await fetch(`/api/projects/${project.id}/like`, { method: newLikedState ? 'POST' : 'DELETE' });
    //   setLiked(newLikedState);
    //   setLikeCount(prev => newLikedState ? prev + 1 : prev - 1);
    // } catch (error) {
    //   console.error("Erro ao curtir:", error);
    // }
    // Por enquanto, simulação local:
    if (liked) {
      setLikeCount(likeCount - 1)
    } else {
      setLikeCount(likeCount + 1)
    }
    setLiked(!liked)
  }

  const handleBookmark = async () => { // A lógica de bookmark deve interagir com a API
    if (!isAuthenticated || !project) return
    // Similar à lógica de like, chamar API
    setBookmarked(!bookmarked)
  }


  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-32 bg-muted rounded-md"></div>
          <div className="h-10 w-3/4 bg-muted rounded-md"></div>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 w-20 bg-muted rounded-full"></div>
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-[400px] bg-muted rounded-lg"></div>
              <div className="h-[200px] bg-muted rounded-lg"></div>
            </div>
            <div className="space-y-6">
              <div className="h-[200px] bg-muted rounded-lg"></div>
              <div className="h-[100px] bg-muted rounded-lg"></div>
              <div className="h-[200px] bg-muted rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold text-destructive mb-4">Erro</h1>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={() => router.push("/projects")} className="mt-4">
          Voltar para Projetos
        </Button>
      </div>
    )
  }

  if (!project) {
    // Este caso pode não ser necessário se o isLoading cobrir,
    // mas é uma boa prática ter um fallback.
    return (
      <div className="container py-8 text-center">
        <p>Projeto não carregado.</p>
      </div>
    )
  }

  // Preparar imagens para a galeria (principal + adicionais)
  const galleryImages = [
    project.imagem_principal || "/placeholder.svg",
    ...(project.imagens_adicionais || []),
  ].filter(Boolean) // Remove undefined/null e strings vazias

  return (
    <div className="container py-8">
      <Link
        href="/projects"
        className="flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Voltar para Projetos</span>
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content - 2/3 width on desktop */}
        <div className="lg:col-span-2 space-y-6 animate-fadeIn">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2 gradient-heading">{project.titulo_do_projeto}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" className="gradient-border">
                {project.area_do_projeto}
              </Badge>
              <Badge variant="secondary">{project.status_do_projeto}</Badge>
              {(project.tags || []).map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(project.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{project.views || 0} visualizações</span>
              </div>
              {project.universidade_autor && (
                <div className="flex items-center gap-1">
                  <School className="h-4 w-4" />
                  <span>{project.universidade_autor}</span>
                </div>
              )}
            </div>
          </div>

          {/* Image gallery */}
          {galleryImages.length > 0 && (
            <div className="space-y-2">
              <div className="overflow-hidden rounded-xl border shadow-sm">
                <img
                  src={galleryImages[activeImageIndex]}
                  alt={`${project.titulo_do_projeto} - Imagem ${activeImageIndex + 1}`}
                  className="w-full h-[400px] object-cover"
                />
              </div>
              {galleryImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                  {galleryImages.map((image, index) => (
                    <button
                      key={index}
                      className={`rounded-lg overflow-hidden border-2 transition-all ${
                        index === activeImageIndex
                          ? "border-primary scale-105"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                      onClick={() => setActiveImageIndex(index)}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-20 h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Project details tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-xl">
              <TabsTrigger value="description" className="rounded-lg">
                Descrição
              </TabsTrigger>
              <TabsTrigger value="objectives" className="rounded-lg">
                Objetivos
              </TabsTrigger>
              <TabsTrigger value="comments" className="rounded-lg">
                Comentários
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4 animate-fadeIn">
              <Card className="rounded-xl glass-card">
                <CardContent className="p-6">
                  <div className="prose max-w-none dark:prose-invert">
                    {(project.descricao_completa || project.descricao_curta || "Nenhuma descrição fornecida.")
                      .split("\n\n")
                      .map((paragraph, index) => (
                        <p key={index} className="mb-4">
                          {paragraph}
                        </p>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="objectives" className="mt-4 animate-fadeIn">
              <Card className="rounded-xl glass-card">
                <CardContent className="p-6">
                  {(project.objetivos && project.objetivos.length > 0) ? (
                    <ul className="space-y-4">
                      {project.objetivos.map((objective, index) => (
                        <li key={index} className="flex items-start gap-3 group">
                          <div className="rounded-full bg-primary/10 text-primary w-8 h-8 flex items-center justify-center mt-0.5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            {index + 1}
                          </div>
                          <span className="flex-1 pt-1">{objective}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">Nenhum objetivo específico listado para este projeto.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="comments" className="mt-4 animate-fadeIn">
              <ProjectComments projectId={project.id} /> {/* Passar projectId para ProjectComments */}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar - 1/3 width on desktop */}
        <div className="space-y-6">
          {/* Author card */}
          {(project.nome_completo_autor || project.universidade_autor) && (
            <Card className="rounded-xl glass-card animate-fadeIn" style={{ animationDelay: "0.1s" }}>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4 border-4 border-primary/20">
                    {/* Idealmente, o autor teria uma imagem de perfil */}
                    <AvatarImage src={"/placeholder-user.jpg"} alt={project.nome_completo_autor || "Autor"} />
                    <AvatarFallback className="text-xl">
                      {(project.nome_completo_autor || "A").charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {project.nome_completo_autor && <h3 className="font-bold text-lg">{project.nome_completo_autor}</h3>}
                  {/* Poderia adicionar um campo 'papel_autor' se existir na API */}
                  {/* <p className="text-sm text-muted-foreground mb-2">{project.authorRole}</p> */}
                  {project.universidade_autor && <p className="text-sm text-muted-foreground mb-4">{project.universidade_autor}</p>}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AuthCheck
                          action="entrar em contato"
                          fallback={
                            <Button className="w-full button-hover-effect">
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Entrar em Contato
                            </Button>
                          }
                        >
                          <Button
                            className="w-full button-hover-effect"
                            // A rota de mensagens pode precisar do ID do usuário autor, não apenas do nome
                            onClick={() => router.push(`/messages?userId=${project.user_id || project.nome_completo_autor}&projectId=${project.id}`)}
                            disabled={!project.user_id && !project.nome_completo_autor} // Desabilitar se não houver identificador do autor
                          >
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Entrar em Contato
                          </Button>
                        </AuthCheck>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Inicia uma conversa direta com o autor do projeto</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions card */}
          <Card className="rounded-xl glass-card animate-fadeIn" style={{ animationDelay: "0.2s" }}>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                <h3 className="font-semibold">Ações</h3>
                <div className="grid grid-cols-2 gap-2">
                  <AuthCheck
                    action="curtir este projeto"
                    fallback={ // Mostrar apenas o contador se não autenticado
                      <Button variant="outline" disabled className="w-full group">
                        <Heart className="mr-2 h-4 w-4" />
                        {likeCount}
                      </Button>
                    }
                  >
                    <Button
                      variant={liked ? "default" : "outline"}
                      onClick={handleLike}
                      className="w-full button-hover-effect group"
                    >
                      <Heart
                        className={`mr-2 h-4 w-4 ${liked ? "fill-current" : "group-hover:fill-primary/20"} transition-all`}
                      />
                      {likeCount}
                    </Button>
                  </AuthCheck>
                  <AuthCheck
                    action="favoritar este projeto"
                    fallback={ // Mostrar botão desabilitado se não autenticado
                      <Button variant="outline" disabled className="w-full">
                        <BookmarkPlus className="mr-2 h-4 w-4" />
                        Favoritar
                      </Button>
                    }
                  >
                    <Button
                      variant={bookmarked ? "default" : "outline"}
                      onClick={handleBookmark}
                      className="w-full button-hover-effect"
                    >
                      <BookmarkPlus className="mr-2 h-4 w-4" />
                      {bookmarked ? "Favoritado" : "Favoritar"}
                    </Button>
                  </AuthCheck>
                  <Button
                    variant="outline"
                    className="w-full col-span-2 button-hover-effect"
                    onClick={() => setActiveTab("comments")}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Comentar
                  </Button>
                  {/* Funcionalidade de compartilhar pode ser implementada com navigator.share se disponível */}
                  <Button variant="outline" className="w-full col-span-2 button-hover-effect" onClick={() => alert("Compartilhar (implementar)")}>
                    <Share className="mr-2 h-4 w-4" />
                    Compartilhar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

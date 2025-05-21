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

// Mock project data
const mockProject = {
  id: 1,
  title: "Sistema de Monitoramento Ambiental IoT",
  description:
    "Dispositivo IoT para monitoramento de qualidade do ar e água em tempo real, utilizando sensores de baixo custo e transmissão de dados via LoRaWAN.",
  longDescription: `
    Este projeto visa desenvolver um sistema completo de monitoramento ambiental utilizando tecnologia IoT (Internet das Coisas) para coletar, analisar e visualizar dados sobre qualidade do ar, água e outros parâmetros ambientais em tempo real.
    
    O sistema é composto por três componentes principais:
    
    1. Dispositivos de Sensoriamento: Unidades compactas equipadas com sensores de baixo custo para medir parâmetros como temperatura, umidade, concentração de CO2, material particulado (PM2.5 e PM10), pH da água, turbidez e presença de contaminantes específicos.
    
    2. Rede de Comunicação: Utiliza o protocolo LoRaWAN para transmissão de dados de longo alcance com baixo consumo de energia, permitindo que os dispositivos operem por meses com baterias simples ou painéis solares de pequeno porte.
    
    3. Plataforma de Visualização: Interface web e mobile que apresenta os dados coletados em dashboards intuitivos, com alertas configuráveis e análises históricas.
    
    O diferencial do projeto está na combinação de hardware de baixo custo com software avançado de análise, tornando o monitoramento ambiental acessível para municípios, empresas e instituições de ensino com orçamento limitado.
    
    Estágio atual: Protótipo funcional desenvolvido e testado em laboratório, com resultados preliminares promissores. Buscamos parceiros para testes em campo e investimento para produção em escala.
  `,
  area: "Engenharia Ambiental",
  author: "Carlos Silva",
  authorRole: "Estudante de Mestrado",
  university: "Universidade Federal",
  likes: 24,
  views: 124,
  createdAt: "10/05/2023",
  status: "Em desenvolvimento",
  images: [
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
  ],
  tags: ["IoT", "Meio Ambiente", "Sensores", "Monitoramento", "LoRaWAN"],
  objectives: [
    "Desenvolver dispositivos de sensoriamento de baixo custo",
    "Implementar rede LoRaWAN para transmissão de dados",
    "Criar plataforma de visualização e análise de dados",
    "Validar o sistema em ambientes reais",
  ],
}

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [likeCount, setLikeCount] = useState(mockProject.likes)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isAuthenticated, setIsAuthenticated] = useState(false) // Simulação - em produção, isso viria de um hook de autenticação
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("description")

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleLike = () => {
    if (!isAuthenticated) {
      return
    }

    if (liked) {
      setLikeCount(likeCount - 1)
    } else {
      setLikeCount(likeCount + 1)
    }
    setLiked(!liked)
  }

  const handleBookmark = () => {
    if (!isAuthenticated) {
      return
    }

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
            <h1 className="text-3xl font-bold tracking-tight mb-2 gradient-heading">{mockProject.title}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" className="gradient-border">
                {mockProject.area}
              </Badge>
              <Badge variant="secondary">{mockProject.status}</Badge>
              {mockProject.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{mockProject.createdAt}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{mockProject.views} visualizações</span>
              </div>
              <div className="flex items-center gap-1">
                <School className="h-4 w-4" />
                <span>{mockProject.university}</span>
              </div>
            </div>
          </div>

          {/* Image gallery */}
          <div className="space-y-2">
            <div className="overflow-hidden rounded-xl border shadow-sm">
              <img
                src={mockProject.images[activeImageIndex] || "/placeholder.svg"}
                alt={`${mockProject.title} - Imagem ${activeImageIndex + 1}`}
                className="w-full h-[400px] object-cover"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {mockProject.images.map((image, index) => (
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
                    src={image || "/placeholder.svg"}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-20 h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

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
                    {mockProject.longDescription.split("\n\n").map((paragraph, index) => (
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
                  <ul className="space-y-4">
                    {mockProject.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-3 group">
                        <div className="rounded-full bg-primary/10 text-primary w-8 h-8 flex items-center justify-center mt-0.5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          {index + 1}
                        </div>
                        <span className="flex-1 pt-1">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="comments" className="mt-4 animate-fadeIn">
              <ProjectComments />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar - 1/3 width on desktop */}
        <div className="space-y-6">
          {/* Author card */}
          <Card className="rounded-xl glass-card animate-fadeIn" style={{ animationDelay: "0.1s" }}>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4 border-4 border-primary/20">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" alt={mockProject.author} />
                  <AvatarFallback className="text-xl">{mockProject.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-lg">{mockProject.author}</h3>
                <p className="text-sm text-muted-foreground mb-2">{mockProject.authorRole}</p>
                <p className="text-sm text-muted-foreground mb-4">{mockProject.university}</p>
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
                          onClick={() => router.push(`/messages?user=${mockProject.author}&project=${mockProject.id}`)}
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

          {/* Actions card */}
          <Card className="rounded-xl glass-card animate-fadeIn" style={{ animationDelay: "0.2s" }}>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                <h3 className="font-semibold">Ações</h3>
                <div className="grid grid-cols-2 gap-2">
                  <AuthCheck
                    action="curtir este projeto"
                    fallback={
                      <Button variant="outline" onClick={() => {}} className="w-full button-hover-effect group">
                        <Heart className="mr-2 h-4 w-4 group-hover:fill-primary/20 transition-all" />
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
                    fallback={
                      <Button variant="outline" onClick={() => {}} className="w-full button-hover-effect">
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
                      Favoritar
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
                  <Button variant="outline" className="w-full col-span-2 button-hover-effect">
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

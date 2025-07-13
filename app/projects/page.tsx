"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Search, Filter, Sparkles } from "lucide-react"
import Link from "next/link"
import AuthCheck from "@/components/auth-check"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useAuth } from "@/components/auth-provider"
// import mockProjects from "@/data/mockProjects" // Removido mockProjects
import areas from "@/data/areas"
import Image from "next/image"

// Definir a interface do Projeto
interface Project {
  id: string // Ou number, dependendo do tipo do ID no Supabase
  titulo_do_projeto: string
  descricao_curta: string
  area_do_projeto: string
  // Adicione outros campos conforme necessário para corresponder aos dados da API
  // Exemplo: autor, universidade, likes, imagem_principal
  nome_completo_autor?: string // Supondo que você tenha um campo para o nome do autor
  universidade_autor?: string // Supondo que você tenha um campo para a universidade
  likes?: number // Supondo um campo para likes
  imagem_principal?: string // URL da imagem
  created_at?: string // Para ordenação por recentes
}


export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedArea, setSelectedArea] = useState("Todas as Áreas")
  const [sortBy, setSortBy] = useState("recent")
  const [isLoading, setIsLoading] = useState(true)
  const [projects, setProjects] = useState<Project[]>([])
  const isMobile = useMediaQuery("(max-width: 768px)")
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/projects")
        if (!response.ok) {
          throw new Error("Falha ao buscar projetos")
        }
        const data = await response.json()
        setProjects(data)
      } catch (error) {
        console.error(error)
        // Tratar erro, talvez mostrar uma mensagem para o usuário
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // Filter projects based on search term and selected area
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.titulo_do_projeto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.descricao_curta.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.nome_completo_autor && project.nome_completo_autor.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesArea = selectedArea === "Todas as Áreas" || project.area_do_projeto === selectedArea

    return matchesSearch && matchesArea
  })

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === "recent") {
      // Supondo que a API retorna 'created_at' ou um campo similar para data de criação
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    } else if (sortBy === "popular") {
      return (b.likes || 0) - (a.likes || 0)
    } else if (sortBy === "alphabetical") {
      return a.titulo_do_projeto.localeCompare(b.titulo_do_projeto)
    }
    return 0
  })

  const handleLike = (id: string) => { // ID pode ser string
    // Em uma aplicação real, isso redirecionaria para o login se não estiver autenticado
    if (!isAuthenticated) {
      return
    }
  }

  // Mobile filters
  const MobileFilters = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="md:hidden">
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[60vh]">
        <SheetHeader>
          <SheetTitle>Filtros</SheetTitle>
          <SheetDescription>Refine sua busca de projetos</SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Área</h3>
            <Select value={selectedArea} onValueChange={setSelectedArea}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Área" />
              </SelectTrigger>
              <SelectContent>
                {areas.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Ordenar por</h3>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Mais Recentes</SelectItem>
                <SelectItem value="popular">Mais Populares</SelectItem>
                <SelectItem value="alphabetical">Ordem Alfabética</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 animate-fadeIn">
          <div className="flex items-center gap-2">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
              <Sparkles className="h-4 w-4 inline mr-1" /> Projectos Inovadores
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight gradient-heading">Descubra Projectos</h1>
          <p className="text-muted-foreground max-w-3xl">
            Explore projectos encontre oportunidades de investimento em ideias inovadoras
            que podem transformar o futuro.
          </p>
        </div>
        <div
          className="flex flex-col gap-4 md:flex-row md:items-center animate-fadeIn"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar projetos..."
              className="pl-8 rounded-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            {isMobile ? (
              <MobileFilters />
            ) : (
              <>
                <Select value={selectedArea} onValueChange={setSelectedArea}>
                  <SelectTrigger className="w-[180px] rounded-full">
                    <SelectValue placeholder="Área" />
                  </SelectTrigger>
                  <SelectContent>
                    {areas.map((area) => (
                      <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px] rounded-full">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Mais Recentes</SelectItem>
                    <SelectItem value="popular">Mais Populares</SelectItem>
                    <SelectItem value="alphabetical">Ordem Alfabética</SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}
          </div>
        </div>

        {/* Projects grid */}
        {isLoading ? (
          // Skeleton loading state
          <div className="grid gap-6 pt-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col overflow-hidden rounded-xl border animate-pulse">
                <div className="w-full h-48 bg-muted"></div>
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-muted rounded-md w-3/4"></div>
                  <div className="h-4 bg-muted rounded-md w-1/2"></div>
                  <div className="h-4 bg-muted rounded-md w-full"></div>
                  <div className="h-4 bg-muted rounded-md w-full"></div>
                  <div className="flex justify-between pt-2">
                    <div className="h-8 bg-muted rounded-md w-1/4"></div>
                    <div className="h-8 bg-muted rounded-md w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : sortedProjects.length > 0 ? (
          <div className="grid gap-6 pt-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedProjects.map((project, index) => (
              <Card
                key={project.id}
                className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 rounded-xl card-hover-effect animate-fadeIn"
                style={{ animationDelay: `${0.1 * ((index % 3) + 1)}s` }}
              >
                <div className="relative overflow-hidden group">
                  <Image
                    src={project.imagem_principal || "/placeholder.jpg"}
                    alt={project.titulo_do_projeto}
                    width={500}
                    height={300}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                    priority={index < 6}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Badge className="absolute top-2 right-2 z-10">{project.area_do_projeto}</Badge>
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="line-clamp-2 text-xl group-hover:text-primary transition-colors">
                    {project.titulo_do_projeto}
                  </CardTitle>
                  <div className="text-sm text-muted-foreground">
                    {project.nome_completo_autor || "Vitilio Sousa"} • {project.universidade_autor || "ISUTC"}
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-3">{project.descricao_curta}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between">
                  <AuthCheck
                    action="curtir este projeto"
                    fallback={
                      <div className="flex items-center gap-1 text-sm text-muted-foreground group">
                        <Heart className="h-4 w-4 group-hover:text-primary transition-colors" />
                        <span>{project.likes}</span>
                      </div>
                    }
                    showDialog={false}
                  >
                    <Button variant="ghost" size="sm" className="gap-1" onClick={() => handleLike(project.id)}>
                      <Heart className="h-4 w-4" />
                      <span>{project.likes}</span>
                    </Button>
                  </AuthCheck>
                  <Link href={`/projects/${project.id}`} passHref>
                    <Button size="sm" className="button-hover-effect">
                      Ver Detalhes
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center animate-fadeIn">
            <div className="rounded-full bg-muted p-4">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Nenhum projeto encontrado</h3>
            <p className="mt-2 text-sm text-muted-foreground">Tente ajustar seus filtros ou termos de busca</p>
          </div>
        )}
      </div>
    </div>
  )
}

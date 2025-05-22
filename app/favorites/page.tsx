"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { Search, Heart, Eye, MessageSquare, Trash2 } from "lucide-react"
import Link from "next/link"

// Mock data for favorite projects
const mockFavoriteProjects = [
  {
    id: 1,
    title: "Sistema de Monitoramento Ambiental IoT",
    description:
      "Dispositivo IoT para monitoramento de qualidade do ar e água em tempo real, utilizando sensores de baixo custo e transmissão de dados via LoRaWAN.",
    area: "Engenharia Ambiental",
    author: "Carlos Silva",
    university: "Universidade Federal",
    likes: 24,
    views: 124,
    messages: 5,
    image: "/project/1.jpg",
    addedAt: "10/05/2023",
  },
  {
    id: 3,
    title: "Plataforma de Microcrédito para Pequenos Empreendedores",
    description:
      "Sistema financeiro que conecta investidores a pequenos empreendedores locais, facilitando o acesso a microcrédito com taxas justas.",
    area: "Administração",
    author: "Pedro Oliveira",
    university: "Faculdade de Economia",
    likes: 32,
    views: 87,
    messages: 3,
    image: "/project/3.jpg",
    addedAt: "12/05/2023",
  },
  {
    id: 6,
    title: "Aplicativo de Realidade Aumentada para Educação",
    description:
      "Ferramenta educacional que utiliza realidade aumentada para visualização de conceitos complexos em ciências e matemática.",
    area: "Tecnologia Educacional",
    author: "Juliana Ferreira",
    university: "Faculdade de Educação",
    likes: 41,
    views: 156,
    messages: 8,
    image: "/project/5.jpg",
    addedAt: "15/05/2023",
  },
]

export default function FavoritesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [favorites, setFavorites] = useState(mockFavoriteProjects)

  if (!user) {
    router.push("/login")
    return null
  }

  // Filter favorites based on search term
  const filteredFavorites = favorites.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.area.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const removeFavorite = (id: number) => {
    setFavorites(favorites.filter((project) => project.id !== id))
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight gradient-heading">Projetos Favoritos</h1>
          <Link href="/projects">
            <Button>Explorar Projetos</Button>
          </Link>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar nos favoritos..."
            className="pl-10 rounded-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid gap-6">
          <Card className="rounded-xl glass-card">
            <CardHeader>
              <CardTitle>Seus Favoritos</CardTitle>
              <CardDescription>Projetos que você marcou como favoritos</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredFavorites.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredFavorites.map((project) => (
                    <Card
                      key={project.id}
                      className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 rounded-xl card-hover-effect"
                    >
                      <div className="relative overflow-hidden group">
                        <img
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <Badge className="absolute top-2 right-2 z-10">{project.area}</Badge>
                      </div>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold line-clamp-2 text-xl">{project.title}</h3>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => removeFavorite(project.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Remover dos favoritos</span>
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {project.author} • {project.university}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex gap-3 text-xs text-muted-foreground">
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
                            <Link href={`/projects/${project.id}`}>
                              <Button size="sm">Ver Detalhes</Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-muted p-4">
                    <Heart className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">Nenhum projeto favorito encontrado</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {searchTerm
                      ? "Tente ajustar sua busca"
                      : "Adicione projetos aos favoritos para encontrá-los facilmente"}
                  </p>
                  <Link href="/projects" className="mt-4">
                    <Button>Explorar Projetos</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

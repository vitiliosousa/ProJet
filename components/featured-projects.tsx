"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import AuthCheck from "@/components/auth-check"

// Mock data for featured projects
const mockProjects = [
  {
    id: 1,
    title: "Sistema de Monitoramento Ambiental IoT",
    description:
      "Dispositivo IoT para monitoramento de qualidade do ar e água em tempo real, utilizando sensores de baixo custo e transmissão de dados via LoRaWAN.",
    area: "Engenharia Ambiental",
    author: "Carlos Silva",
    university: "Universidade Federal",
    likes: 24,
    image: "/placeholder.svg?height=200&width=350",
  },
  {
    id: 2,
    title: "Aplicativo de Assistência Médica para Idosos",
    description:
      "Plataforma mobile que auxilia idosos no gerenciamento de medicamentos, consultas médicas e monitoramento de sinais vitais com interface simplificada.",
    area: "Ciência da Computação",
    author: "Ana Pereira",
    university: "Universidade Estadual",
    likes: 18,
    image: "/placeholder.svg?height=200&width=350",
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
    image: "/placeholder.svg?height=200&width=350",
  },
]

export default function FeaturedProjects() {
  const [projects, setProjects] = useState(mockProjects)

  const handleLike = (id: number) => {
    // Simulação - em produção, isso verificaria a autenticação
    const isAuthenticated = false

    if (!isAuthenticated) {
      // Abrir modal de login
      return
    }

    setProjects(projects.map((project) => (project.id === id ? { ...project, likes: project.likes + 1 } : project)))
  }

  return (
    <div className="grid gap-6 pt-8 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <Card
          key={project.id}
          className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 rounded-xl card-hover-effect animate-fadeIn"
          style={{ animationDelay: `${0.1 * (index + 1)}s` }}
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
          <CardHeader className="p-4">
            <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">{project.title}</CardTitle>
            <CardDescription>
              {project.author} • {project.university}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 flex-grow">
            <p className="text-sm text-muted-foreground line-clamp-3">{project.description}</p>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between">
            <AuthCheck
              action="curtir este projeto"
              fallback={
                <Button variant="ghost" size="sm" className="gap-1 group">
                  <Heart className="h-4 w-4 group-hover:fill-primary/20 transition-all" />
                  <span>{project.likes}</span>
                </Button>
              }
              showDialog={false}
            >
              <Button variant="ghost" size="sm" className="gap-1 group" onClick={() => handleLike(project.id)}>
                <Heart className="h-4 w-4 group-hover:fill-primary/20 transition-all" />
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
  )
}

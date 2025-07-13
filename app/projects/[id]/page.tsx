'use client'

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
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
import { useAuth } from "@/components/auth-provider"

interface ProjectData {
  id: string
  titulo_do_projeto: string
  descricao_curta: string
  descricao_completa: string
  area_do_projeto: string
  nome_completo_autor?: string
  universidade_autor?: string
  status_do_projeto: string
  imagem_principal?: string
  imagens_adicionais?: string[] | string // Can be an array or a JSON string
  tags?: string[]
  objetivos?: string[]
  created_at: string
  views?: number
  likes?: number
  user_id?: string
}

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const projectId = params.id as string

  const [project, setProject] = useState<ProjectData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
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
            throw new Error(response.status === 404 ? "Projeto não encontrado." : "Falha ao buscar detalhes do projeto.")
          }
          const data: ProjectData = await response.json()
          setProject(data)
          setLikeCount(data.likes || 0)
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

  const handleLike = () => {
    if (!isAuthenticated) return
    setLiked(!liked)
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1))
  }

  const handleBookmark = () => {
    if (!isAuthenticated) return
    setBookmarked(!bookmarked)
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-32 bg-muted rounded-md"></div>
          <div className="h-10 w-3/4 bg-muted rounded-md"></div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-[400px] bg-muted rounded-lg"></div>
              <div className="flex gap-2">{[...Array(4)].map((_, i) => <div key={i} className="w-20 h-20 bg-muted rounded-lg"></div>)}</div>
            </div>
            <div className="space-y-6">
              <div className="h-[200px] bg-muted rounded-lg"></div>
              <div className="h-[150px] bg-muted rounded-lg"></div>
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
        <Button onClick={() => router.push("/projects")} className="mt-4">Voltar para Projetos</Button>
      </div>
    )
  }

  if (!project) {
    return null
  }

  // --- Start of Image Parsing Logic ---
  let additionalImages: string[] = [];
  if (typeof project.imagens_adicionais === 'string') {
    try {
      additionalImages = JSON.parse(project.imagens_adicionais);
    } catch (e) {
      console.error("Failed to parse imagens_adicionais:", e);
      additionalImages = [];
    }
  } else if (Array.isArray(project.imagens_adicionais)) {
    additionalImages = project.imagens_adicionais;
  }

  const galleryImages = [
    project.imagem_principal,
    ...additionalImages,
  ].filter((url): url is string => typeof url === 'string' && url.trim() !== '');

  if (galleryImages.length === 0) {
      galleryImages.push('/placeholder.jpg');
  }
  // --- End of Image Parsing Logic ---

  return (
    <div className="container py-8">
      <Link href="/projects" className="flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        <span>Voltar para Projetos</span>
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6 animate-fadeIn">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2 gradient-heading">{project.titulo_do_projeto} <Badge variant="secondary">{project.status_do_projeto}</Badge></h1>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" className="gradient-border">{project.area_do_projeto}</Badge>
              {(project.tags || []).map((tag, index) => <Badge key={index} variant="outline">{tag}</Badge>)}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1"><Calendar className="h-4 w-4" /><span>{new Date(project.created_at).toLocaleDateString()}</span></div>
              <div className="flex items-center gap-1"><Eye className="h-4 w-4" /><span>{project.views || 0} visualizações</span></div>
              {project.universidade_autor && <div className="flex items-center gap-1"><School className="h-4 w-4" /><span>{project.universidade_autor}</span></div>}
            </div>
          </div>
          
          {galleryImages.length > 0 && (
            <div className="space-y-2">
              <div className="relative overflow-hidden rounded-xl border shadow-sm aspect-video">
                <Image
                  src={galleryImages[activeImageIndex]}
                  alt={`${project.titulo_do_projeto} - Imagem ${activeImageIndex + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-500 hover:scale-105"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  placeholder="blur"
                  blurDataURL={`data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0wIDBoMTAwdjEwMEgweiIgZmlsbD0iI2YwZjBmMCIvPjwvc3ZnPg==`}
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
                      <div className="relative w-20 h-20">
                        <Image src={image} alt={`Thumbnail ${index + 1}`} layout="fill" objectFit="cover" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-xl">
              <TabsTrigger value="description">Descrição</TabsTrigger>
              <TabsTrigger value="objectives">Objetivos</TabsTrigger>
              <TabsTrigger value="comments">Comentários</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4"><Card className="rounded-xl"><CardContent className="p-6"><div className="prose dark:prose-invert max-w-none">{(project.descricao_completa || project.descricao_curta).split('\n').map((p, i) => <p key={i}>{p}</p>)}</div></CardContent></Card></TabsContent>
            <TabsContent value="objectives" className="mt-4"><Card className="rounded-xl"><CardContent className="p-6">{(project.objetivos && project.objetivos.length > 0) ? <ul className="space-y-3">{project.objetivos.map((obj, i) => <li key={i} className="flex items-start gap-3"><div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary"><span>{i + 1}</span></div><span className="flex-1">{obj}</span></li>)}</ul> : <p>Nenhum objetivo listado.</p>}</CardContent></Card></TabsContent>
            <TabsContent value="comments" className="mt-4"><ProjectComments projectId={project.id} /></TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          {(project.nome_completo_autor || project.universidade_autor) && (
            <Card className="rounded-xl"><CardContent className="p-6"><div className="flex flex-col items-center text-center"><Avatar className="h-20 w-20 mb-4"><AvatarImage src="/placeholder-user.jpg" alt={project.nome_completo_autor} /><AvatarFallback>{(project.nome_completo_autor || "?").charAt(0)}</AvatarFallback></Avatar><h3 className="font-bold text-lg">{project.nome_completo_autor}</h3><p className="text-sm text-muted-foreground">{project.universidade_autor}</p><Button className="mt-4 w-full" onClick={() => router.push(`/messages?userId=${project.user_id}`)} disabled={!isAuthenticated}><MessageSquare className="mr-2 h-4 w-4" />Entrar em Contato</Button></div></CardContent></Card>
          )}

          <Card className="rounded-xl"><CardContent className="p-6"><div className="flex flex-col gap-3"><h3 className="font-semibold">Ações</h3><div className="grid grid-cols-2 gap-2"><Button variant={liked ? "default" : "outline"} onClick={handleLike} disabled={!isAuthenticated}><Heart className="mr-2 h-4 w-4" />{likeCount}</Button><Button variant={bookmarked ? "default" : "outline"} onClick={handleBookmark} disabled={!isAuthenticated}><BookmarkPlus className="mr-2 h-4 w-4" />{bookmarked ? "Salvo" : "Salvar"}</Button></div><Button variant="outline" onClick={() => alert("Compartilhar link: " + window.location.href)}><Share className="mr-2 h-4 w-4" />Compartilhar</Button></div></CardContent></Card>
        </div>
      </div>
    </div>
  )
}
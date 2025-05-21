"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, X, Upload } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

// Areas for project
const areas = [
  "Engenharia Ambiental",
  "Ciência da Computação",
  "Administração",
  "Engenharia de Software",
  "Engenharia Civil",
  "Tecnologia Educacional",
  "Medicina",
  "Arquitetura",
  "Design",
  "Economia",
  "Outro",
]

export default function NewProjectPage() {
  console.log("Renderizando página de novo projeto") // Log para debug

  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [objectives, setObjectives] = useState<string[]>([])
  const [objectiveInput, setObjectiveInput] = useState("")

  // Redirecionar para login se não estiver autenticado
  if (!user) {
    console.log("Usuário não autenticado, redirecionando para login")
    router.push("/login")
    return null
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleAddObjective = () => {
    if (objectiveInput.trim() && !objectives.includes(objectiveInput.trim())) {
      setObjectives([...objectives, objectiveInput.trim()])
      setObjectiveInput("")
    }
  }

  const handleRemoveObjective = (objective: string) => {
    setObjectives(objectives.filter((o) => o !== objective))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    // Simulate project creation
    setTimeout(() => {
      setIsLoading(false)
      router.push("/projects/my-projects")
    }, 1500)
  }

  return (
    <div className="container max-w-4xl py-8">
      <Link
        href="/projects/my-projects"
        className="flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Voltar para Meus Projetos</span>
      </Link>

      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight gradient-heading">Novo Projeto</h1>
          <p className="text-muted-foreground">
            Preencha os detalhes do seu projeto para compartilhá-lo com potenciais investidores
          </p>
        </div>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="media">Mídia</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="basic" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Básicas</CardTitle>
                  <CardDescription>Preencha as informações essenciais do seu projeto</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título do Projeto *</Label>
                    <Input id="title" placeholder="Ex: Sistema de Monitoramento Ambiental IoT" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="area">Área do Projeto *</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma área" />
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
                    <Label htmlFor="shortDescription">Descrição Curta *</Label>
                    <Textarea
                      id="shortDescription"
                      placeholder="Descreva seu projeto em poucas palavras (máx. 200 caracteres)"
                      maxLength={200}
                      required
                    />
                    <p className="text-xs text-muted-foreground">Esta descrição será exibida nos cards de projetos</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <div className="flex gap-2">
                      <Input
                        id="tags"
                        placeholder="Ex: IoT, Meio Ambiente"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            handleAddTag()
                          }
                        }}
                      />
                      <Button type="button" onClick={handleAddTag} variant="outline">
                        Adicionar
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-1 bg-muted text-muted-foreground rounded-full px-3 py-1 text-sm"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" type="button" onClick={() => router.push("/projects/my-projects")}>
                    Cancelar
                  </Button>
                  <Button type="button" onClick={() => document.querySelector('[data-value="details"]')?.click()}>
                    Próximo
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Detalhes do Projeto</CardTitle>
                  <CardDescription>Forneça informações detalhadas sobre seu projeto</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullDescription">Descrição Completa *</Label>
                    <Textarea
                      id="fullDescription"
                      placeholder="Descreva seu projeto em detalhes"
                      className="min-h-[200px]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="objectives">Objetivos</Label>
                    <div className="flex gap-2">
                      <Input
                        id="objectives"
                        placeholder="Ex: Desenvolver dispositivos de sensoriamento de baixo custo"
                        value={objectiveInput}
                        onChange={(e) => setObjectiveInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            handleAddObjective()
                          }
                        }}
                      />
                      <Button type="button" onClick={handleAddObjective} variant="outline">
                        Adicionar
                      </Button>
                    </div>
                    <div className="space-y-2 mt-2">
                      {objectives.map((objective, index) => (
                        <div key={index} className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 text-sm">
                          <div className="rounded-full bg-primary/10 text-primary w-6 h-6 flex items-center justify-center">
                            {index + 1}
                          </div>
                          <span className="flex-1">{objective}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveObjective(objective)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status do Projeto *</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="idea">Ideia</SelectItem>
                        <SelectItem value="planning">Planejamento</SelectItem>
                        <SelectItem value="development">Em desenvolvimento</SelectItem>
                        <SelectItem value="testing">Em testes</SelectItem>
                        <SelectItem value="completed">Concluído</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => document.querySelector('[data-value="basic"]')?.click()}
                  >
                    Anterior
                  </Button>
                  <Button type="button" onClick={() => document.querySelector('[data-value="media"]')?.click()}>
                    Próximo
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="media" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Mídia</CardTitle>
                  <CardDescription>Adicione imagens e arquivos ao seu projeto</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Imagem Principal *</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Arraste e solte uma imagem ou clique para selecionar
                      </p>
                      <p className="text-xs text-muted-foreground">PNG, JPG ou GIF (máx. 5MB)</p>
                      <Input type="file" accept="image/*" className="hidden" id="main-image" />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById("main-image")?.click()}
                      >
                        Selecionar Arquivo
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Imagens Adicionais</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Arraste e solte imagens ou clique para selecionar</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG ou GIF (máx. 5MB cada, até 5 imagens)</p>
                      <Input type="file" accept="image/*" multiple className="hidden" id="additional-images" />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById("additional-images")?.click()}
                      >
                        Selecionar Arquivos
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Documentos Complementares</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Adicione documentos complementares ao seu projeto</p>
                      <p className="text-xs text-muted-foreground">PDF, DOCX, PPTX (máx. 10MB cada)</p>
                      <Input type="file" accept=".pdf,.docx,.pptx" multiple className="hidden" id="documents" />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById("documents")?.click()}
                      >
                        Selecionar Arquivos
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => document.querySelector('[data-value="details"]')?.click()}
                  >
                    Anterior
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Salvando..." : "Salvar Projeto"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </form>
        </Tabs>
      </div>
    </div>
  )
}

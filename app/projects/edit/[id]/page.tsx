'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, X, Upload, Loader2 } from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import { toast } from '@/components/ui/use-toast'
import areas from '@/data/areas' // Import the updated areas list

// Use the correct field names from the database
const initialFormData = {
  titulo_do_projeto: '',
  area_do_projeto: '',
  descricao_curta: '',
  descricao_completa: '',
  status_do_projeto: '',
}

export default function EditProjectPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [project, setProject] = useState<any>(null) // Keep original project data
  const [formData, setFormData] = useState(initialFormData)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [objectives, setObjectives] = useState<string[]>([])
  const [objectiveInput, setObjectiveInput] = useState('')
  const [activeTab, setActiveTab] = useState('basic')

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  // Fetch project data from the API
  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) return
      setIsLoading(true)
      try {
        const response = await fetch(`/api/projects/${projectId}`)
        if (!response.ok) {
          throw new Error('Falha ao carregar o projeto.')
        }
        const data = await response.json()
        setProject(data)
        // Populate form data with fetched data using correct keys
        setFormData({
          titulo_do_projeto: data.titulo_do_projeto || '',
          area_do_projeto: data.area_do_projeto || '',
          descricao_curta: data.descricao_curta || '',
          descricao_completa: data.descricao_completa || '',
          status_do_projeto: data.status_do_projeto || '',
        })
        setTags(data.tags || [])
        setObjectives(data.objetivos || []) // Corrected from data.objectives
      } catch (error) {
        console.error('Erro ao carregar projeto:', error)
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os dados do projeto. Tente novamente.',
          variant: 'destructive',
        })
        setProject(null) // Ensure 'not found' screen is shown
      } finally {
        setIsLoading(false)
      }
    }

    loadProject()
  }, [projectId])

  if (!user) {
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleAddObjective = () => {
    if (objectiveInput.trim() && !objectives.includes(objectiveInput.trim())) {
      setObjectives([...objectives, objectiveInput.trim()])
      setObjectiveInput('')
    }
  }

  const handleRemoveObjective = (objective: string) => {
    setObjectives(objectives.filter((o) => o !== objective))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)

    const updatedData = {
      ...formData,
      tags,
      objetivos: objectives, // Corrected from 'objectives'
    }

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API Error:', errorData)
        throw new Error('Falha ao atualizar o projeto.')
      }

      toast({
        title: 'Sucesso!',
        description: 'Seu projeto foi atualizado.',
      })
      router.push('/projects/my-projects')
    } catch (error) {
      console.error('Erro ao salvar projeto:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as alterações. Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container max-w-4xl py-8 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Carregando projeto...</p>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Projeto não encontrado</h1>
          <p className="text-muted-foreground mb-6">
            O projeto que você está tentando editar não existe ou não pôde ser carregado.
          </p>
          <Link href="/projects/my-projects">
            <Button>Voltar para Meus Projetos</Button>
          </Link>
        </div>
      </div>
    )
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
          <h1 className="text-2xl font-bold tracking-tight gradient-heading">Editar Projeto</h1>
          <p className="text-muted-foreground">
            Atualize as informações do seu projeto para mantê-lo relevante para potenciais investidores
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                  <CardDescription>Atualize as informações essenciais do seu projeto</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="titulo_do_projeto">Título do Projeto *</Label>
                    <Input
                      id="titulo_do_projeto"
                      name="titulo_do_projeto"
                      placeholder="Ex: Sistema de Monitoramento Ambiental IoT"
                      required
                      value={formData.titulo_do_projeto}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="area_do_projeto">Área do Projeto *</Label>
                    <Select
                      name="area_do_projeto"
                      value={formData.area_do_projeto}
                      onValueChange={(value) => handleSelectChange('area_do_projeto', value)}
                      required
                    >
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
                    <Label htmlFor="descricao_curta">Descrição Curta *</Label>
                    <Textarea
                      id="descricao_curta"
                      name="descricao_curta"
                      placeholder="Descreva seu projeto em poucas palavras (máx. 200 caracteres)"
                      maxLength={200}
                      required
                      value={formData.descricao_curta}
                      onChange={handleInputChange}
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
                          if (e.key === 'Enter') {
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
                  <Button variant="outline" type="button" onClick={() => router.push('/projects/my-projects')}>
                    Cancelar
                  </Button>
                  <Button type="button" onClick={() => setActiveTab('details')}>
                    Próximo
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Detalhes do Projeto</CardTitle>
                  <CardDescription>Atualize informações detalhadas sobre seu projeto</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="descricao_completa">Descrição Completa *</Label>
                    <Textarea
                      id="descricao_completa"
                      name="descricao_completa"
                      placeholder="Descreva seu projeto em detalhes"
                      className="min-h-[200px]"
                      required
                      value={formData.descricao_completa}
                      onChange={handleInputChange}
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
                          if (e.key === 'Enter') {
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
                    <Label htmlFor="status_do_projeto">Status do Projeto *</Label>
                    <Select
                      name="status_do_projeto"
                      value={formData.status_do_projeto}
                      onValueChange={(value) => handleSelectChange('status_do_projeto', value)}
                      required
                    >
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
                  <Button variant="outline" type="button" onClick={() => setActiveTab('basic')}>
                    Anterior
                  </Button>
                  <Button type="button" onClick={() => setActiveTab('media')}>
                    Próximo
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="media" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Mídia</CardTitle>
                  <CardDescription>Atualize imagens e arquivos do seu projeto</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Imagem Principal *</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-2">
                        <p className="text-sm font-medium mb-2">Imagem atual:</p>
                        <img
                          src={project.imagem_principal || '/placeholder.svg'}
                          alt="Imagem atual do projeto"
                          className="w-full h-48 object-cover rounded-md"
                        />
                      </div>
                      <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Arraste e solte uma nova imagem ou clique para selecionar
                        </p>
                        <p className="text-xs text-muted-foreground">PNG, JPG ou GIF (máx. 5MB)</p>
                        <Input type="file" accept="image/*" className="hidden" id="main-image" />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('main-image')?.click()}
                        >
                          Selecionar Arquivo
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Funcionalidade de upload de imagens adicionais e documentos pode ser implementada aqui */}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" type="button" onClick={() => setActiveTab('details')}>
                    Anterior
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? 'Salvando...' : 'Salvar Alterações'}
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
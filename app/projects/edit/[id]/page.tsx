"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, X, Upload, Loader2 } from "lucide-react"
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

// Mock project data for editing
const mockProjects = [
  {
    id: "1",
    title: "Sistema de Monitoramento Ambiental IoT",
    area: "Engenharia Ambiental",
    shortDescription:
      "Dispositivo IoT para monitoramento de qualidade do ar e água em tempo real, utilizando sensores de baixo custo e transmissão de dados via LoRaWAN.",
    fullDescription: `Este projeto visa desenvolver um sistema completo de monitoramento ambiental utilizando tecnologia IoT (Internet das Coisas) para coletar, analisar e visualizar dados sobre qualidade do ar, água e outros parâmetros ambientais em tempo real.
    
O sistema é composto por três componentes principais:

1. Dispositivos de Sensoriamento: Unidades compactas equipadas com sensores de baixo custo para medir parâmetros como temperatura, umidade, concentração de CO2, material particulado (PM2.5 e PM10), pH da água, turbidez e presença de contaminantes específicos.

2. Rede de Comunicação: Utiliza o protocolo LoRaWAN para transmissão de dados de longo alcance com baixo consumo de energia, permitindo que os dispositivos operem por meses com baterias simples ou painéis solares de pequeno porte.

3. Plataforma de Visualização: Interface web e mobile que apresenta os dados coletados em dashboards intuitivos, com alertas configuráveis e análises históricas.

O diferencial do projeto está na combinação de hardware de baixo custo com software avançado de análise, tornando o monitoramento ambiental acessível para municípios, empresas e instituições de ensino com orçamento limitado.`,
    tags: ["IoT", "Meio Ambiente", "Sensores", "Monitoramento", "LoRaWAN"],
    objectives: [
      "Desenvolver dispositivos de sensoriamento de baixo custo",
      "Implementar rede LoRaWAN para transmissão de dados",
      "Criar plataforma de visualização e análise de dados",
      "Validar o sistema em ambientes reais",
    ],
    status: "development",
    images: ["/placeholder.svg?height=400&width=600"],
  },
  {
    id: "2",
    title: "Aplicativo de Assistência Médica para Idosos",
    area: "Ciência da Computação",
    shortDescription:
      "Plataforma mobile que auxilia idosos no gerenciamento de medicamentos, consultas médicas e monitoramento de sinais vitais com interface simplificada.",
    fullDescription: `Este aplicativo foi desenvolvido pensando nas necessidades específicas da população idosa, oferecendo uma interface simplificada e acessível para o gerenciamento de saúde.

Principais funcionalidades:
- Lembretes de medicamentos com confirmação de uso
- Agendamento e lembretes de consultas médicas
- Registro de sinais vitais como pressão arterial, glicemia e frequência cardíaca
- Integração com dispositivos wearables para monitoramento contínuo
- Botão de emergência com envio de localização para contatos cadastrados
- Relatórios de saúde para compartilhamento com médicos e cuidadores

O aplicativo foi testado com um grupo de 50 idosos e recebeu feedback positivo quanto à facilidade de uso e utilidade das funcionalidades.`,
    tags: ["Saúde", "Mobile", "Acessibilidade", "Idosos"],
    objectives: [
      "Desenvolver interface simplificada e acessível",
      "Implementar sistema de lembretes de medicamentos",
      "Criar funcionalidade de monitoramento de sinais vitais",
      "Integrar com dispositivos wearables",
    ],
    status: "planning",
    images: ["/placeholder.svg?height=400&width=600"],
  },
  {
    id: "3",
    title: "Plataforma de Microcrédito para Pequenos Empreendedores",
    area: "Administração",
    shortDescription:
      "Sistema financeiro que conecta investidores a pequenos empreendedores locais, facilitando o acesso a microcrédito com taxas justas.",
    fullDescription: `Esta plataforma visa democratizar o acesso ao crédito para pequenos empreendedores que normalmente não conseguem financiamento através dos canais tradicionais.

O sistema funciona como um marketplace que conecta diretamente investidores a empreendedores, eliminando intermediários e reduzindo custos. Os empreendedores cadastram seus projetos, necessidades de financiamento e planos de negócio. Investidores podem navegar pelos projetos, avaliar riscos e retornos potenciais, e decidir quanto desejam investir em cada negócio.

A plataforma utiliza um algoritmo proprietário de análise de risco que considera fatores alternativos aos utilizados por bancos tradicionais, como histórico de vendas, avaliações de clientes e potencial de crescimento do negócio.

Um sistema de escrow garante a segurança das transações, liberando os recursos conforme marcos pré-estabelecidos são atingidos pelo empreendedor.`,
    tags: ["Finanças", "Microcrédito", "Empreendedorismo", "Marketplace"],
    objectives: [
      "Desenvolver plataforma segura para transações financeiras",
      "Implementar algoritmo de análise de risco alternativo",
      "Criar sistema de escrow para liberação gradual de recursos",
      "Estabelecer mecanismos de feedback e avaliação",
    ],
    status: "development",
    images: ["/placeholder.svg?height=400&width=600"],
  },
]

export default function EditProjectPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [project, setProject] = useState<any>(null)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [objectives, setObjectives] = useState<string[]>([])
  const [objectiveInput, setObjectiveInput] = useState("")
  const [activeTab, setActiveTab] = useState("basic")

  // Redirecionar para login se não estiver autenticado
  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  // Simular carregamento dos dados do projeto
  useEffect(() => {
    const loadProject = async () => {
      setIsLoading(true)
      try {
        // Simulação de chamada à API
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const foundProject = mockProjects.find((p) => p.id === projectId)

        if (foundProject) {
          setProject(foundProject)
          setTags(foundProject.tags || [])
          setObjectives(foundProject.objectives || [])
        } else {
          // Projeto não encontrado
          router.push("/projects/my-projects")
        }
      } catch (error) {
        console.error("Erro ao carregar projeto:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProject()
  }, [projectId, router])

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
    setIsSaving(true)

    // Simulate project update
    setTimeout(() => {
      setIsSaving(false)
      router.push("/projects/my-projects")
    }, 1500)
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
          <p className="text-muted-foreground mb-6">O projeto que você está tentando editar não existe.</p>
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
                    <Label htmlFor="title">Título do Projeto *</Label>
                    <Input
                      id="title"
                      placeholder="Ex: Sistema de Monitoramento Ambiental IoT"
                      required
                      defaultValue={project.title}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="area">Área do Projeto *</Label>
                    <Select defaultValue={project.area} required>
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
                      defaultValue={project.shortDescription}
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
                  <Button type="button" onClick={() => setActiveTab("details")}>
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
                    <Label htmlFor="fullDescription">Descrição Completa *</Label>
                    <Textarea
                      id="fullDescription"
                      placeholder="Descreva seu projeto em detalhes"
                      className="min-h-[200px]"
                      required
                      defaultValue={project.fullDescription}
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
                    <Select defaultValue={project.status} required>
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
                  <Button variant="outline" type="button" onClick={() => setActiveTab("basic")}>
                    Anterior
                  </Button>
                  <Button type="button" onClick={() => setActiveTab("media")}>
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
                          src={project.images[0] || "/placeholder.svg"}
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
                          onClick={() => document.getElementById("main-image")?.click()}
                        >
                          Selecionar Arquivo
                        </Button>
                      </div>
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
                  <Button variant="outline" type="button" onClick={() => setActiveTab("details")}>
                    Anterior
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Salvando..." : "Salvar Alterações"}
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

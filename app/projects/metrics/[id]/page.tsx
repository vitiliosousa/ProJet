"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth-provider"
import { ArrowLeft, Eye, Heart, MessageSquare, Share, Users, Clock, TrendingUp, BarChart3 } from "lucide-react"

// Mock data for project metrics
const mockProjectMetrics = {
  id: 1,
  title: "Sistema de Monitoramento Ambiental IoT",
  description: "Dispositivo IoT para monitoramento de qualidade do ar e água em tempo real.",
  area: "Engenharia Ambiental",
  status: "Ativo",
  views: {
    total: 124,
    weekly: [12, 15, 8, 21, 18, 25, 25],
    monthly: [45, 68, 124],
  },
  likes: {
    total: 24,
    weekly: [2, 3, 1, 5, 4, 6, 3],
    monthly: [8, 12, 24],
  },
  messages: {
    total: 5,
    weekly: [0, 1, 0, 2, 0, 1, 1],
    monthly: [1, 2, 5],
  },
  shares: {
    total: 8,
    weekly: [1, 0, 2, 1, 1, 2, 1],
    monthly: [2, 3, 8],
  },
  visitors: {
    unique: 87,
    returning: 37,
    locations: [
      { name: "Brasil", count: 65 },
      { name: "Portugal", count: 12 },
      { name: "Estados Unidos", count: 8 },
      { name: "Outros", count: 2 },
    ],
  },
  engagement: {
    avgTimeOnPage: "2m 45s",
    bounceRate: "32%",
    conversionRate: "8.2%",
  },
  lastUpdated: "2023-05-10",
}

export default function ProjectMetricsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const projectId = params.id

  // Simulação de carregamento de dados do projeto
  const [project] = useState(mockProjectMetrics)
  const [timeRange, setTimeRange] = useState("7d")

  if (!user) {
    router.push("/login")
    return null
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Link
            href="/projects/my-projects"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar para Meus Projetos</span>
          </Link>

          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight gradient-heading">{project.title}</h1>
            <div className="flex gap-2">
              <Link href={`/projects/edit/${projectId}`}>
                <Button variant="outline">Editar Projeto</Button>
              </Link>
              <Link href={`/projects/${projectId}`}>
                <Button>Ver Página do Projeto</Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Métricas e Desempenho</h2>
          <div className="flex items-center gap-2">
            <Button variant={timeRange === "7d" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("7d")}>
              7 dias
            </Button>
            <Button variant={timeRange === "30d" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("30d")}>
              30 dias
            </Button>
            <Button variant={timeRange === "90d" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("90d")}>
              90 dias
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{project.views.total}</div>
              <div className="flex items-center pt-1">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-xs text-green-500">+12% </span>
                <span className="text-xs text-muted-foreground ml-1">vs. período anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Curtidas</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{project.likes.total}</div>
              <div className="flex items-center pt-1">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-xs text-green-500">+8% </span>
                <span className="text-xs text-muted-foreground ml-1">vs. período anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mensagens</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{project.messages.total}</div>
              <div className="flex items-center pt-1">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-xs text-green-500">+3 </span>
                <span className="text-xs text-muted-foreground ml-1">novas mensagens</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Compartilhamentos</CardTitle>
              <Share className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{project.shares.total}</div>
              <div className="flex items-center pt-1">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-xs text-green-500">+5 </span>
                <span className="text-xs text-muted-foreground ml-1">vs. período anterior</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 md:w-auto">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="audience">Audiência</TabsTrigger>
            <TabsTrigger value="engagement">Engajamento</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="rounded-xl glass-card">
                <CardHeader>
                  <CardTitle>Tendência de Visualizações</CardTitle>
                  <CardDescription>Visualizações ao longo do tempo</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <div className="flex flex-col items-center justify-center text-center">
                    <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground">
                      Gráfico de visualizações ao longo do tempo seria exibido aqui
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-xl glass-card">
                <CardHeader>
                  <CardTitle>Interações</CardTitle>
                  <CardDescription>Curtidas, mensagens e compartilhamentos</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <div className="flex flex-col items-center justify-center text-center">
                    <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground">Gráfico de interações seria exibido aqui</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-xl glass-card">
              <CardHeader>
                <CardTitle>Resumo de Desempenho</CardTitle>
                <CardDescription>Principais métricas do seu projeto</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Visitantes</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Únicos</span>
                      <span className="font-medium">{project.visitors.unique}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Recorrentes</span>
                      <span className="font-medium">{project.visitors.returning}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Engajamento</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Tempo médio</span>
                      <span className="font-medium">{project.engagement.avgTimeOnPage}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Taxa de rejeição</span>
                      <span className="font-medium">{project.engagement.bounceRate}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Conversão</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Taxa de conversão</span>
                      <span className="font-medium">{project.engagement.conversionRate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Contatos recebidos</span>
                      <span className="font-medium">{project.messages.total}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audience" className="space-y-4">
            <Card className="rounded-xl glass-card">
              <CardHeader>
                <CardTitle>Origem dos Visitantes</CardTitle>
                <CardDescription>De onde vêm seus visitantes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.visitors.locations.map((location, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span>{location.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${(location.count / project.visitors.unique) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{location.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="rounded-xl glass-card">
                <CardHeader>
                  <CardTitle>Dispositivos</CardTitle>
                  <CardDescription>Tipos de dispositivos usados</CardDescription>
                </CardHeader>
                <CardContent className="h-[250px] flex items-center justify-center">
                  <div className="flex flex-col items-center justify-center text-center">
                    <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground">Gráfico de dispositivos seria exibido aqui</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-xl glass-card">
                <CardHeader>
                  <CardTitle>Perfil dos Visitantes</CardTitle>
                  <CardDescription>Características dos visitantes</CardDescription>
                </CardHeader>
                <CardContent className="h-[250px] flex items-center justify-center">
                  <div className="flex flex-col items-center justify-center text-center">
                    <Users className="h-16 w-16 text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground">Dados demográficos seriam exibidos aqui</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="engagement" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="rounded-xl glass-card">
                <CardHeader>
                  <CardTitle>Tempo de Permanência</CardTitle>
                  <CardDescription>Quanto tempo os visitantes ficam na página</CardDescription>
                </CardHeader>
                <CardContent className="h-[250px] flex items-center justify-center">
                  <div className="flex flex-col items-center justify-center text-center">
                    <Clock className="h-16 w-16 text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground">Gráfico de tempo de permanência seria exibido aqui</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-xl glass-card">
                <CardHeader>
                  <CardTitle>Taxa de Interação</CardTitle>
                  <CardDescription>Como os visitantes interagem com seu projeto</CardDescription>
                </CardHeader>
                <CardContent className="h-[250px] flex items-center justify-center">
                  <div className="flex flex-col items-center justify-center text-center">
                    <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground">Gráfico de interações seria exibido aqui</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-xl glass-card">
              <CardHeader>
                <CardTitle>Mensagens Recebidas</CardTitle>
                <CardDescription>Histórico de mensagens recebidas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <h3 className="font-medium">Maria Investimentos</h3>
                      <p className="text-sm text-muted-foreground">Interesse no seu projeto de IoT</p>
                    </div>
                    <span className="text-sm text-muted-foreground">2 dias atrás</span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <h3 className="font-medium">Tech Ventures</h3>
                      <p className="text-sm text-muted-foreground">Proposta de parceria</p>
                    </div>
                    <span className="text-sm text-muted-foreground">4 dias atrás</span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <h3 className="font-medium">Pedro Santos</h3>
                      <p className="text-sm text-muted-foreground">Dúvida sobre tecnologia utilizada</p>
                    </div>
                    <span className="text-sm text-muted-foreground">1 semana atrás</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

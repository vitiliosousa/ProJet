"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import {
  Search,
  Bell,
  Heart,
  MessageSquare,
  Eye,
  BookmarkPlus,
  Trash2,
  CheckCircle2,
  Filter,
  ChevronDown,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

// Mock data for notifications
const mockNotifications = [
  {
    id: 1,
    type: "like",
    title: "Novo interesse no seu projeto",
    description: 'Um investidor demonstrou interesse no seu projeto "Sistema de Monitoramento Ambiental IoT"',
    date: "Hoje, 10:45",
    read: false,
    project: {
      id: 1,
      title: "Sistema de Monitoramento Ambiental IoT",
    },
    user: {
      id: 2,
      name: "Maria Investimentos",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 2,
    type: "message",
    title: "Nova mensagem recebida",
    description: "Você recebeu uma nova mensagem de Maria Investimentos",
    date: "Ontem, 15:30",
    read: false,
    project: {
      id: 1,
      title: "Sistema de Monitoramento Ambiental IoT",
    },
    user: {
      id: 2,
      name: "Maria Investimentos",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 3,
    type: "highlight",
    title: "Seu projeto foi destacado",
    description: 'Seu projeto "Sistema de Monitoramento Ambiental IoT" foi destacado na página inicial',
    date: "15/05/2023",
    read: true,
    project: {
      id: 1,
      title: "Sistema de Monitoramento Ambiental IoT",
    },
  },
  {
    id: 4,
    type: "view",
    title: "Aumento de visualizações",
    description:
      'Seu projeto "Sistema de Monitoramento Ambiental IoT" recebeu 50 novas visualizações nas últimas 24 horas',
    date: "14/05/2023",
    read: true,
    project: {
      id: 1,
      title: "Sistema de Monitoramento Ambiental IoT",
    },
  },
  {
    id: 5,
    type: "bookmark",
    title: "Projeto adicionado aos favoritos",
    description: 'Tech Ventures adicionou seu projeto "Sistema de Monitoramento Ambiental IoT" aos favoritos',
    date: "12/05/2023",
    read: true,
    project: {
      id: 1,
      title: "Sistema de Monitoramento Ambiental IoT",
    },
    user: {
      id: 3,
      name: "Tech Ventures",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 6,
    type: "message",
    title: "Nova mensagem recebida",
    description:
      'Você recebeu uma nova mensagem de Pedro Santos sobre seu projeto "Aplicativo de Assistência Médica para Idosos"',
    date: "10/05/2023",
    read: true,
    project: {
      id: 2,
      title: "Aplicativo de Assistência Médica para Idosos",
    },
    user: {
      id: 4,
      name: "Pedro Santos",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 7,
    type: "system",
    title: "Bem-vindo ao ProjetoConnect",
    description:
      "Obrigado por se juntar à nossa plataforma! Complete seu perfil para aumentar suas chances de conexão.",
    date: "01/05/2023",
    read: true,
  },
]

// Notification type icons
const notificationIcons = {
  like: <Heart className="h-5 w-5 text-rose-500" />,
  message: <MessageSquare className="h-5 w-5 text-blue-500" />,
  view: <Eye className="h-5 w-5 text-green-500" />,
  bookmark: <BookmarkPlus className="h-5 w-5 text-purple-500" />,
  highlight: <Star className="h-5 w-5 text-amber-500" />,
  system: <Bell className="h-5 w-5 text-gray-500" />,
}

function Star(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

export default function NotificationsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [notifications, setNotifications] = useState(mockNotifications)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [showRealTime, setShowRealTime] = useState(true)

  if (!user) {
    router.push("/login")
    return null
  }

  // Filter notifications based on search term and active tab
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.project?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false

    if (activeTab === "all") return matchesSearch
    if (activeTab === "unread") return matchesSearch && !notification.read
    if (activeTab === "read") return matchesSearch && notification.read

    return matchesSearch && notification.type === activeTab
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight gradient-heading">Notificações</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie suas notificações e mantenha-se atualizado sobre suas interações
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-2">
              <Switch id="realtime" checked={showRealTime} onCheckedChange={setShowRealTime} />
              <Label htmlFor="realtime">Tempo real</Label>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Ações</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Gerenciar notificações</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={markAllAsRead}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  <span>Marcar todas como lidas</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={clearAllNotifications}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Limpar todas as notificações</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar notificações..."
            className="pl-10 rounded-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all" className="relative">
                Todas
                {unreadCount > 0 && (
                  <Badge className="ml-1 absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="unread">Não lidas</TabsTrigger>
              <TabsTrigger value="message">Mensagens</TabsTrigger>
              <TabsTrigger value="like">Interações</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="space-y-4">
            <Card className="rounded-xl glass-card">
              <CardHeader>
                <CardTitle>Todas as Notificações</CardTitle>
                <CardDescription>Visualize todas as suas notificações</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredNotifications.length > 0 ? (
                  <div className="space-y-1">
                    {filteredNotifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={markAsRead}
                        onDelete={deleteNotification}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyNotifications searchTerm={searchTerm} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="unread" className="space-y-4">
            <Card className="rounded-xl glass-card">
              <CardHeader>
                <CardTitle>Notificações Não Lidas</CardTitle>
                <CardDescription>Notificações que você ainda não visualizou</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredNotifications.length > 0 ? (
                  <div className="space-y-1">
                    {filteredNotifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={markAsRead}
                        onDelete={deleteNotification}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyNotifications searchTerm={searchTerm} type="não lidas" />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="message" className="space-y-4">
            <Card className="rounded-xl glass-card">
              <CardHeader>
                <CardTitle>Mensagens</CardTitle>
                <CardDescription>Notificações relacionadas a mensagens recebidas</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredNotifications.length > 0 ? (
                  <div className="space-y-1">
                    {filteredNotifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={markAsRead}
                        onDelete={deleteNotification}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyNotifications searchTerm={searchTerm} type="de mensagens" />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="like" className="space-y-4">
            <Card className="rounded-xl glass-card">
              <CardHeader>
                <CardTitle>Interações</CardTitle>
                <CardDescription>Notificações relacionadas a curtidas, favoritos e destaques</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredNotifications.length > 0 ? (
                  <div className="space-y-1">
                    {filteredNotifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={markAsRead}
                        onDelete={deleteNotification}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyNotifications searchTerm={searchTerm} type="de interações" />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

interface NotificationItemProps {
  notification: (typeof mockNotifications)[0]
  onMarkAsRead: (id: number) => void
  onDelete: (id: number) => void
}

function NotificationItem({ notification, onMarkAsRead, onDelete }: NotificationItemProps) {
  const icon = notificationIcons[notification.type as keyof typeof notificationIcons]

  return (
    <div
      className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${
        notification.read ? "hover:bg-muted/50" : "bg-primary/5 hover:bg-primary/10"
      }`}
      onClick={() => !notification.read && onMarkAsRead(notification.id)}
    >
      <div className="rounded-full p-2 bg-muted flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className={`font-medium ${notification.read ? "" : "font-semibold"}`}>{notification.title}</h3>
          {!notification.read && (
            <Badge variant="default" className="bg-primary">
              Novo
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-muted-foreground">{notification.date}</span>
          {notification.project && (
            <>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">{notification.project.title}</span>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1">
        {!notification.read && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation()
              onMarkAsRead(notification.id)
            }}
          >
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Marcar como lida</span>
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(notification.id)
          }}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Excluir</span>
        </Button>
      </div>
    </div>
  )
}

interface EmptyNotificationsProps {
  searchTerm: string
  type?: string
}

function EmptyNotifications({ searchTerm, type = "" }: EmptyNotificationsProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-4">
        <Bell className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">Nenhuma notificação {type} encontrada</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        {searchTerm ? "Tente ajustar sua busca" : `Você não tem notificações ${type} no momento`}
      </p>
    </div>
  )
}

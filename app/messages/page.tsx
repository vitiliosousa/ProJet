"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth-provider"
import { Search, MessageSquare, MoreHorizontal, CheckCircle2, Trash2, Send, ArrowLeft } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useMobileMedia } from "@/hooks/use-mobile"

// Interfaces
interface Message {
  id: number
  from: string
  to: string
  avatar: string
  subject: string
  content: string
  date: string
  project: string
  isReceived: boolean
  read?: boolean
}

interface Conversation {
  contact: string
  avatar: string | null
  messages: Message[]
  hasUnread: boolean
  lastMessage: Message | null
  project: string
}

// Mock data para mensagens individuais
const mockMessageItems: Message[] = [
  {
    id: 1,
    from: "Maria Investimentos",
    to: "Você",
    avatar: "/placeholder.svg?height=40&width=40",
    subject: "Interesse no seu projeto de IoT",
    content:
      "Olá, gostaria de saber mais sobre seu projeto de monitoramento ambiental. Poderia compartilhar mais detalhes sobre a tecnologia utilizada e o estágio atual de desenvolvimento?",
    date: "2023-05-18T14:30:00",
    project: "Sistema de Monitoramento Ambiental IoT",
    isReceived: true,
  },
  {
    id: 101,
    from: "Você",
    to: "Maria Investimentos",
    avatar: "/placeholder.svg?height=40&width=40",
    subject: "Re: Interesse no seu projeto de IoT",
    content:
      "Olá Maria, agradeço o interesse! Estou disponível para uma reunião para discutir mais detalhes. O projeto utiliza sensores de baixo custo conectados via LoRaWAN e está atualmente em fase de testes em campo.",
    date: "2023-05-18T15:45:00",
    project: "Sistema de Monitoramento Ambiental IoT",
    isReceived: false,
  },
  {
    id: 2,
    from: "Maria Investimentos",
    to: "Você",
    avatar: "/placeholder.svg?height=40&width=40",
    subject: "Re: Re: Interesse no seu projeto de IoT",
    content:
      "Obrigada pelas informações! Gostaria de agendar uma reunião para a próxima semana. Você tem disponibilidade na terça ou quarta-feira?",
    date: "2023-05-19T10:15:00",
    project: "Sistema de Monitoramento Ambiental IoT",
    isReceived: true,
  },
  {
    id: 3,
    from: "Tech Ventures",
    to: "Você",
    avatar: "/placeholder.svg?height=40&width=40",
    subject: "Proposta de parceria",
    content:
      "Estamos interessados em discutir possibilidades de investimento no seu projeto de monitoramento ambiental. Nossa empresa tem experiência em escalar soluções IoT e gostaríamos de conhecer mais sobre seu trabalho.",
    date: "2023-05-16T09:30:00",
    project: "Sistema de Monitoramento Ambiental IoT",
    isReceived: true,
  },
  {
    id: 102,
    from: "Você",
    to: "Tech Ventures",
    avatar: "/placeholder.svg?height=40&width=40",
    subject: "Re: Proposta de parceria",
    content:
      "Prezados, agradeço o contato e o interesse no projeto. Estou aberto a discutir possibilidades de parceria. Podemos agendar uma reunião para apresentar mais detalhes do projeto e entender melhor como podemos colaborar.",
    date: "2023-05-16T11:20:00",
    project: "Sistema de Monitoramento Ambiental IoT",
    isReceived: false,
  },
  {
    id: 4,
    from: "Ana Costa",
    to: "Você",
    avatar: "/placeholder.svg?height=40&width=40",
    subject: "Dúvida sobre seu aplicativo",
    content:
      "Olá! Vi seu projeto de assistência médica para idosos e gostaria de saber se vocês planejam incluir funcionalidades de monitoramento remoto de sinais vitais na próxima versão.",
    date: "2023-05-14T16:45:00",
    project: "Aplicativo de Assistência Médica para Idosos",
    isReceived: true,
  },
  {
    id: 5,
    from: "Pedro Santos",
    to: "Você",
    avatar: "/placeholder.svg?height=40&width=40",
    subject: "Dúvida técnica sobre sensores",
    content:
      "Olá, estou desenvolvendo um projeto similar e gostaria de saber quais sensores vocês estão utilizando para medir a qualidade do ar. Você poderia compartilhar essa informação?",
    date: "2023-05-13T13:10:00",
    project: "Sistema de Monitoramento Ambiental IoT",
    isReceived: true,
  },
  {
    id: 103,
    from: "Você",
    to: "Pedro Santos",
    avatar: "/placeholder.svg?height=40&width=40",
    subject: "Re: Dúvida técnica sobre sensores",
    content:
      "Olá Pedro, em relação à sua pergunta sobre os sensores utilizados, estamos usando principalmente o SDS011 para material particulado (PM2.5 e PM10) e o BME680 para temperatura, umidade, pressão e gases. Ambos têm boa relação custo-benefício e precisão adequada para o nosso caso de uso.",
    date: "2023-05-13T14:30:00",
    project: "Sistema de Monitoramento Ambiental IoT",
    isReceived: false,
  },
  {
    id: 6,
    from: "Incubadora Startup",
    to: "Você",
    avatar: "/placeholder.svg?height=40&width=40",
    subject: "Convite para apresentação",
    content:
      "Gostaríamos de convidar você para apresentar seu projeto em nosso evento de startups que acontecerá no próximo mês. Seria uma ótima oportunidade para networking e visibilidade.",
    date: "2023-05-12T10:00:00",
    project: "Sistema de Monitoramento Ambiental IoT",
    isReceived: true,
  },
  {
    id: 104,
    from: "Você",
    to: "Fundo de Investimento XYZ",
    avatar: "/placeholder.svg?height=40&width=40",
    subject: "Apresentação do projeto",
    content:
      "Prezados, conforme solicitado, estou enviando a apresentação detalhada do projeto, incluindo projeções financeiras e plano de expansão. Fico à disposição para esclarecer quaisquer dúvidas.",
    date: "2023-05-10T15:45:00",
    project: "Sistema de Monitoramento Ambiental IoT",
    isReceived: false,
  },
]

// Função para agrupar mensagens por contato
function groupMessagesByContact(messages: Message[]): Conversation[] {
  const conversations = {}

  // Agrupar mensagens por contato
  messages.forEach((message) => {
    const contactName = message.isReceived ? message.from : message.to

    if (!Object.prototype.hasOwnProperty.call(conversations, contactName)) {
      (conversations as Record<string, Conversation>)[contactName] = {
        contact: contactName,
        avatar: message.isReceived ? message.avatar : null,
        messages: [],
        hasUnread: false,
        lastMessage: null,
        project: message.project,
      }
    }

(conversations as Record<string, Conversation>)[contactName].messages.push(message)

    // Verificar se é a mensagem mais recente deste contato
    const currentConversation = (conversations as Record<string, Conversation>)[contactName];
    if (
      !currentConversation.lastMessage ||
      new Date(message.date) > new Date(currentConversation.lastMessage?.date || '')
    ) {
(conversations as Record<string, Conversation>)[contactName].lastMessage = message
    }

    // Verificar se há mensagens não lidas
    if (message.isReceived && !message.read) {
(conversations as Record<string, Conversation>)[contactName].hasUnread = true
    }
  })

  // Ordenar mensagens de cada conversa por data
  Object.values(conversations).forEach((conversation) => {
    (conversation as Conversation).messages.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  })

  // Converter para array e ordenar por data da última mensagem (mais recente primeiro)
  return (Object.values(conversations) as Conversation[]).sort((a, b) =>
    new Date((b as Conversation).lastMessage?.date || '').getTime() - new Date((a as Conversation).lastMessage?.date || '').getTime()
  )
}

// Formatar data relativa (hoje, ontem, etc.)
function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return `Hoje, ${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`
  } else if (diffDays === 1) {
    return `Ontem, ${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`
  } else if (diffDays < 7) {
    const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]
    return `${days[date.getDay()]}, ${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`
  } else {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
  }
}

export default function MessagesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isMobile = useMobileMedia()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [searchTerm, setSearchTerm] = useState<string>("")
  const [messageItems, setMessageItems] = useState<Message[]>(mockMessageItems)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedContact, setSelectedContact] = useState<string | null>(null)
  const [replyText, setReplyText] = useState<string>("")
  const [showConversationList, setShowConversationList] = useState<boolean>(true)
  const [isTyping, setIsTyping] = useState<boolean>(false)

  // Redirecionar para login se não estiver autenticado
  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  // Verificar parâmetros de URL para abrir conversa específica
  useEffect(() => {
    const userParam = searchParams.get("user")
    if (userParam) {
      // Encontrar ou criar conversa com este usuário
      setSelectedContact(userParam)
      setShowConversationList(false)
    }
  }, [searchParams])

  // Agrupar mensagens por contato ao carregar ou quando as mensagens mudarem
  useEffect(() => {
    const grouped = groupMessagesByContact(messageItems)
    setConversations(grouped)

    // Se não houver contato selecionado e houver conversas, selecione a primeira
    if (grouped.length > 0 && !selectedContact) {
      setSelectedContact(grouped[0].contact)
    }
  }, [messageItems])

  // Rolar para o final da conversa quando novas mensagens são adicionadas
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [selectedContact, messageItems])

  // Filtrar conversas com base no termo de busca
  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.lastMessage?.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.lastMessage?.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.project.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Obter mensagens da conversa selecionada
  const selectedConversation = conversations.find((conv) => conv.contact === selectedContact)
  const conversationMessages = selectedConversation ? selectedConversation.messages : []

  // Marcar mensagens como lidas
  const markConversationAsRead = (contactName: string) => {
    setMessageItems((prevMessages) =>
      prevMessages.map((message) =>
        message.isReceived && message.from === contactName ? { ...message, read: true } : message,
      ),
    )
    setSelectedContact(contactName)
    setShowConversationList(false)

    // Focar no campo de resposta
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 100)
  }

  // Excluir conversa
  const deleteConversation = (contactName: string) => {
    setMessageItems((prevMessages) =>
      prevMessages.filter(
        (message) => !(message.isReceived ? message.from === contactName : message.to === contactName),
      ),
    )

    if (selectedContact === contactName) {
      setSelectedContact(null)
      if (isMobile) {
        setShowConversationList(true)
      }
    }
  }

  // Enviar resposta
  const handleSendReply = () => {
    if (!replyText.trim() || !selectedContact) return

    // Simular digitação
    setIsTyping(true)

    // Criar nova mensagem
    const newMessage = {
      id: Date.now(),
      from: "Você",
      to: selectedContact,
      avatar: user?.image || "/placeholder.svg?height=40&width=40",
      subject: `Re: ${selectedConversation?.lastMessage?.subject || 'No subject'}`,
      content: replyText,
      date: new Date().toISOString(),
      project: selectedConversation?.project || 'No project',
      isReceived: false,
      read: true,
    }

    // Adicionar mensagem imediatamente
    setMessageItems((prevMessages) => [...prevMessages, newMessage])
    setReplyText("")

    // Simular resposta após alguns segundos
    setTimeout(
      () => {
        setIsTyping(false)

        // 50% de chance de receber uma resposta
        if (Math.random() > 0.5) {
          const responseMessage = {
            id: Date.now() + 1,
            from: selectedContact,
            to: "Você",
            avatar: selectedConversation?.avatar || "/placeholder.svg?height=40&width=40",
            subject: `Re: ${newMessage.subject}`,
            content: `Obrigado pela sua resposta! Vamos continuar a conversa em breve.`,
            date: new Date().toISOString(),
            project: selectedConversation?.project || 'No project',
            isReceived: true,
            read: false,
          }

          setMessageItems((prevMessages) => [...prevMessages, responseMessage])
        }
      },
      2000 + Math.random() * 3000,
    ) // Entre 2 e 5 segundos
  }

  // Voltar para a lista de conversas (mobile)
  const handleBackToList = () => {
    setShowConversationList(true)
  }

  if (!user) {
    return null
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight gradient-heading">Mensagens</h1>
        </div>

        {(showConversationList || !isMobile) && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar mensagens..."
              className="pl-10 rounded-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        <div className="grid md:grid-cols-[350px,1fr] gap-4">
          {/* Lista de conversas - sempre visível em desktop, condicional em mobile */}
          {(showConversationList || !isMobile) && (
            <Card className="rounded-xl glass-card animate-fadeIn">
              <CardHeader className="py-3">
                <CardTitle className="text-lg">Conversas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-[calc(100vh-220px)] overflow-y-auto">
                  {filteredConversations.length > 0 ? (
                    filteredConversations.map((conversation) => (
                      <div
                        key={conversation.contact}
                        className={`flex items-center justify-between p-2 border-b last:border-b-0 hover:bg-muted/50 transition-colors cursor-pointer ${
                          conversation.hasUnread ? "bg-primary/5" : ""
                        } ${selectedContact === conversation.contact ? "bg-muted" : ""}`}
                        onClick={() => markConversationAsRead(conversation.contact)}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Avatar className="h-10 w-10 border border-border">
                            <AvatarImage src={conversation.avatar || "/placeholder.svg"} alt={conversation.contact} />
                            <AvatarFallback>{conversation.contact.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className={`font-medium truncate ${conversation.hasUnread ? "font-semibold" : ""}`}>
                                {conversation.contact === "Você" ? conversation.lastMessage?.to : conversation.contact}
                              </h3>
                              {conversation.hasUnread && (
                                <Badge variant="default" className="bg-primary">
                                  Novo
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm font-medium truncate">{conversation.lastMessage?.subject}</p>
                            <p className="text-xs text-muted-foreground truncate">{conversation.lastMessage?.content}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground">
                                {conversation.lastMessage ? formatRelativeDate(conversation.lastMessage.date) : ''}
                              </span>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground">{conversation.project}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Mais opções</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {conversation.hasUnread && (
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    markConversationAsRead(conversation.contact)
                                  }}
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-2" />
                                  Marcar como lida
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteConversation(conversation.contact)
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Excluir conversa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="rounded-full bg-muted p-4">
                        <MessageSquare className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold">Nenhuma conversa encontrada</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {searchTerm ? "Tente ajustar sua busca" : "Sua caixa de mensagens está vazia"}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Visualização da conversa selecionada - visível em desktop ou quando uma conversa está selecionada */}
          {(!showConversationList || !isMobile) && selectedContact && (
            <Card className="rounded-xl glass-card animate-fadeIn">
              <CardHeader className="py-3 border-b">
                    <div className="flex justify-between items-center">
                      {isMobile && (
                        <Button variant="ghost" size="icon" onClick={handleBackToList} className="mr-2">
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                      )}
                      <div className="flex items-center gap-3 flex-1">
                        <Avatar className="h-9 w-9 border border-border">
                          <AvatarImage src={selectedConversation?.avatar || "/placeholder.svg"} alt={selectedContact} />
                          <AvatarFallback>{selectedContact.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="overflow-hidden">
                          <CardTitle className="text-base">{selectedContact}</CardTitle>
                          <CardDescription className="text-xs truncate">
                            {selectedConversation?.project}
                          </CardDescription>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => deleteConversation(selectedContact)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[500px] px-4">
                      <div className="space-y-6 py-4">
                        {conversationMessages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.isReceived ? "justify-start" : "justify-end"} animate-fadeIn`}
                            style={{ animationDuration: "0.3s" }}
                          >
                            <div
                              className={`flex items-start gap-3 max-w-[80%] ${message.isReceived ? "" : "flex-row-reverse"}`}
                            >
                              <Avatar className="h-8 w-8 mt-1 border border-border flex-shrink-0">
                                <AvatarImage
                                  src={message.isReceived ? message.avatar : user.image || "/placeholder.svg"}
                                  alt={message.isReceived ? message.from : "Você"}
                                />
                                <AvatarFallback>{message.isReceived ? message.from.charAt(0) : "V"}</AvatarFallback>
                              </Avatar>
                              <div
                                className={`rounded-lg p-3 ${
                                  message.isReceived ? "bg-muted text-foreground" : "bg-primary text-primary-foreground"
                                } transition-all hover:shadow-md`}
                              >
                                <div className="text-sm font-medium mb-1">{message.subject}</div>
                                <div className="text-sm">{message.content}</div>
                                <div className="text-xs mt-2 opacity-70">{formatRelativeDate(message.date)}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                        {isTyping && (
                          <div className="flex justify-start animate-fadeIn">
                            <div className="flex items-start gap-3 max-w-[80%]">
                              <Avatar className="h-8 w-8 mt-1 border border-border flex-shrink-0">
                                <AvatarImage
                                  src={selectedConversation?.avatar || "/placeholder.svg"}
                                  alt={selectedContact}
                                />
                                <AvatarFallback>{selectedContact.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="rounded-lg p-3 bg-muted text-foreground">
                                <div className="flex space-x-1">
                                  <div
                                    className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                                    style={{ animationDelay: "0ms" }}
                                  ></div>
                                  <div
                                    className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                                    style={{ animationDelay: "300ms" }}
                                  ></div>
                                  <div
                                    className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                                    style={{ animationDelay: "600ms" }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>

                    {/* Área de resposta */}
                    <div className="p-4 border-t mt-2">
                      <div className="flex gap-2">
                        <Avatar className="h-8 w-8 mt-1 border border-border">
                          <AvatarImage src={user.image || "/placeholder.svg"} alt="Você" />
                          <AvatarFallback>V</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <Input
                            placeholder="Escreva sua resposta..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="w-full"
                            ref={inputRef}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                handleSendReply()
                              }
                            }}
                          />
                        </div>
                        <Button
                          size="icon"
                          disabled={!replyText.trim() || isTyping}
                          onClick={handleSendReply}
                          className="transition-all hover:scale-105 active:scale-95"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )} : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  {isMobile && (
                    <Button variant="ghost" size="icon" onClick={handleBackToList} className="absolute top-4 left-4">
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  )}
                  <div className="rounded-full bg-muted p-4">
                    <MessageSquare className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">Selecione uma conversa</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Escolha uma conversa da lista para visualizar as mensagens
                  </p>
                </div>
              )
            </div>
        </div>
      </div>
  )
}

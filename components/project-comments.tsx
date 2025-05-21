"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { ThumbsUp, Reply, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import AuthCheck from "@/components/auth-check"

// Tipo para os comentários
interface Comment {
  id: string
  author: {
    name: string
    avatar?: string
    role?: string
  }
  content: string
  createdAt: string
  likes: number
  replies?: Comment[]
  isLiked?: boolean
}

// Dados de exemplo para comentários
const mockComments: Comment[] = [
  {
    id: "1",
    author: {
      name: "Maria Oliveira",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Investidora",
    },
    content:
      "Projeto muito interessante! Gostaria de saber mais sobre a escalabilidade da solução e se já existem testes em ambientes reais.",
    createdAt: "2 dias atrás",
    likes: 5,
    replies: [
      {
        id: "1-1",
        author: {
          name: "Carlos Silva",
          avatar: "/placeholder.svg?height=40&width=40",
          role: "Autor do Projeto",
        },
        content:
          "Olá Maria! Obrigado pelo interesse. Sim, já realizamos testes em dois municípios e os resultados foram muito promissores. Quanto à escalabilidade, o sistema foi projetado para suportar até 500 dispositivos por gateway LoRaWAN, o que é suficiente para cobrir áreas urbanas de médio porte.",
        createdAt: "1 dia atrás",
        likes: 2,
      },
    ],
  },
  {
    id: "2",
    author: {
      name: "Pedro Santos",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Estudante",
    },
    content:
      "Estou desenvolvendo um projeto similar na minha universidade. Seria interessante trocarmos experiências sobre os desafios de calibração dos sensores de qualidade do ar.",
    createdAt: "3 dias atrás",
    likes: 3,
  },
  {
    id: "3",
    author: {
      name: "Ana Costa",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Professora",
    },
    content:
      "Excelente iniciativa! Como vocês estão lidando com o consumo de energia dos dispositivos? Estão usando painéis solares ou apenas baterias?",
    createdAt: "5 dias atrás",
    likes: 7,
    replies: [
      {
        id: "3-1",
        author: {
          name: "Carlos Silva",
          avatar: "/placeholder.svg?height=40&width=40",
          role: "Autor do Projeto",
        },
        content:
          "Olá Ana! Estamos usando uma combinação de baterias de lítio de alta capacidade e pequenos painéis solares de 5W. Em áreas com boa exposição solar, os dispositivos podem operar indefinidamente. Em locais com menos luz, as baterias garantem autonomia de até 6 meses.",
        createdAt: "4 dias atrás",
        likes: 4,
      },
      {
        id: "3-2",
        author: {
          name: "Ana Costa",
          avatar: "/placeholder.svg?height=40&width=40",
          role: "Professora",
        },
        content:
          "Interessante! Vocês consideraram o uso de supercapacitores para complementar as baterias? Podem oferecer ciclos de carga/descarga muito superiores.",
        createdAt: "3 dias atrás",
        likes: 2,
      },
    ],
  },
]

export default function ProjectComments() {
  const [comments, setComments] = useState<Comment[]>(mockComments)
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false) // Simulação - em produção, isso viria de um hook de autenticação

  const handleAddComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: `${Date.now()}`,
      author: {
        name: "João Silva", // Usuário logado simulado
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Estudante",
      },
      content: newComment,
      createdAt: "Agora mesmo",
      likes: 0,
    }

    setComments([comment, ...comments])
    setNewComment("")
  }

  const handleAddReply = (commentId: string) => {
    if (!replyContent.trim()) return

    const reply: Comment = {
      id: `${commentId}-${Date.now()}`,
      author: {
        name: "João Silva", // Usuário logado simulado
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Estudante",
      },
      content: replyContent,
      createdAt: "Agora mesmo",
      likes: 0,
    }

    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), reply],
        }
      }
      return comment
    })

    setComments(updatedComments)
    setReplyContent("")
    setReplyingTo(null)
  }

  const handleLikeComment = (commentId: string, isReply = false, parentId?: string) => {
    if (!isAuthenticated) return

    if (!isReply) {
      setComments(
        comments.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
              isLiked: !comment.isLiked,
            }
          }
          return comment
        }),
      )
    } else if (parentId) {
      setComments(
        comments.map((comment) => {
          if (comment.id === parentId && comment.replies) {
            return {
              ...comment,
              replies: comment.replies.map((reply) => {
                if (reply.id === commentId) {
                  return {
                    ...reply,
                    likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                    isLiked: !reply.isLiked,
                  }
                }
                return reply
              }),
            }
          }
          return comment
        }),
      )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">
          Comentários ({comments.reduce((acc, comment) => acc + 1 + (comment.replies?.length || 0), 0)})
        </h3>
      </div>

      {/* Formulário de comentário */}
      <Card className="rounded-xl glass-card">
        <CardContent className="p-4 space-y-4">
          <AuthCheck
            action="comentar neste projeto"
            fallback={
              <div className="flex flex-col space-y-2">
                <Textarea placeholder="Faça login para adicionar um comentário..." className="resize-none" disabled />
                <div className="flex justify-end">
                  <Button disabled>Comentar</Button>
                </div>
              </div>
            }
          >
            <div className="flex flex-col space-y-2">
              <Textarea
                placeholder="Adicione um comentário..."
                className="resize-none"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <div className="flex justify-end">
                <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                  Comentar
                </Button>
              </div>
            </div>
          </AuthCheck>
        </CardContent>
      </Card>

      {/* Lista de comentários */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="space-y-4">
            <Card className="rounded-xl glass-card">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-10 w-10 border border-border">
                        <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
                        <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{comment.author.name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                          <span>{comment.author.role}</span>
                          <span>•</span>
                          <span>{comment.createdAt}</span>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Mais opções</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Reportar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="text-sm">{comment.content}</div>

                  <div className="flex items-center gap-4 pt-1">
                    <AuthCheck
                      action="curtir este comentário"
                      fallback={
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          <span>{comment.likes}</span>
                        </Button>
                      }
                      showDialog={false}
                    >
                      <Button
                        variant={comment.isLiked ? "default" : "ghost"}
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => handleLikeComment(comment.id)}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        <span>{comment.likes}</span>
                      </Button>
                    </AuthCheck>

                    <AuthCheck
                      action="responder a este comentário"
                      fallback={
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground">
                          <Reply className="h-4 w-4 mr-1" />
                          <span>Responder</span>
                        </Button>
                      }
                      showDialog={false}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      >
                        <Reply className="h-4 w-4 mr-1" />
                        <span>Responder</span>
                      </Button>
                    </AuthCheck>
                  </div>

                  {/* Formulário de resposta */}
                  {replyingTo === comment.id && (
                    <div className="pt-2 pl-10 space-y-2">
                      <Textarea
                        placeholder="Adicione uma resposta..."
                        className="resize-none text-sm"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                      />
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => setReplyingTo(null)}>
                          Cancelar
                        </Button>
                        <Button size="sm" onClick={() => handleAddReply(comment.id)} disabled={!replyContent.trim()}>
                          Responder
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Respostas */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="pl-8 space-y-3">
                {comment.replies.map((reply) => (
                  <Card key={reply.id} className="rounded-xl glass-card border-l-4 border-l-primary/20">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8 border border-border">
                              <AvatarImage src={reply.author.avatar || "/placeholder.svg"} alt={reply.author.name} />
                              <AvatarFallback>{reply.author.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm">{reply.author.name}</div>
                              <div className="text-xs text-muted-foreground flex items-center gap-2">
                                <span>{reply.author.role}</span>
                                <span>•</span>
                                <span>{reply.createdAt}</span>
                              </div>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Mais opções</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Reportar</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="text-sm">{reply.content}</div>

                        <div className="flex items-center gap-4 pt-1">
                          <AuthCheck
                            action="curtir esta resposta"
                            fallback={
                              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground">
                                <ThumbsUp className="h-3 w-3 mr-1" />
                                <span>{reply.likes}</span>
                              </Button>
                            }
                            showDialog={false}
                          >
                            <Button
                              variant={reply.isLiked ? "default" : "ghost"}
                              size="sm"
                              className="h-7 px-2 text-xs"
                              onClick={() => handleLikeComment(reply.id, true, comment.id)}
                            >
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              <span>{reply.likes}</span>
                            </Button>
                          </AuthCheck>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

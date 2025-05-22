
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "./ui/dropdown-menu"
import { Bell } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"




export default function NotificationsIcon() {
    return(
        <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                        3
                      </span>
                      <span className="sr-only">Notificações</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel className="flex items-center justify-between">
                      <span>Notificações</span>
                      <Button variant="ghost" size="sm" className="h-auto p-1 text-xs">
                        Marcar todas como lidas
                      </Button>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-80 overflow-y-auto">
                      <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                        <div className="flex w-full justify-between">
                          <span className="font-medium">Novo interesse no seu projeto</span>
                          <Badge variant="default" className="ml-2">
                            Novo
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          Um investidor demonstrou interesse no seu projeto "Sistema de Monitoramento Ambiental IoT"
                        </span>
                        <span className="text-xs text-muted-foreground">Hoje, 10:45</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                        <div className="flex w-full justify-between">
                          <span className="font-medium">Nova mensagem recebida</span>
                          <Badge variant="default" className="ml-2">
                            Novo
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          Você recebeu uma nova mensagem de Maria Investimentos
                        </span>
                        <span className="text-xs text-muted-foreground">Ontem, 15:30</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                        <div className="flex w-full justify-between">
                          <span className="font-medium">Seu projeto foi destacado</span>
                          <Badge variant="outline" className="ml-2">
                            Lido
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          Seu projeto "Sistema de Monitoramento Ambiental IoT" foi destacado na página inicial
                        </span>
                        <span className="text-xs text-muted-foreground">15/05/2023</span>
                      </DropdownMenuItem>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="justify-center w-full" asChild>
                      <Link href="/notifications" className="w-full text-center">Ver todas as notificações</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
    )
}
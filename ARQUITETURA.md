# Arquitetura Técnica do ProjetoConnect

Este documento detalha a arquitetura técnica do ProjetoConnect, explicando as decisões de design, estrutura de código e tecnologias utilizadas.

## Sumário

1. [Visão Geral da Arquitetura](#1-visão-geral-da-arquitetura)
2. [Frontend](#2-frontend)
3. [Estrutura de Arquivos](#3-estrutura-de-arquivos)
4. [Gerenciamento de Estado](#4-gerenciamento-de-estado)
5. [Roteamento e Navegação](#5-roteamento-e-navegação)
6. [Componentes Principais](#6-componentes-principais)
7. [Estilização](#7-estilização)
8. [Autenticação](#8-autenticação)
9. [Responsividade](#9-responsividade)
10. [Performance](#10-performance)

## 1. Visão Geral da Arquitetura

O ProjetoConnect é construído como uma aplicação web moderna utilizando o framework Next.js com o App Router. A arquitetura segue os princípios de:

- **Componentes Reutilizáveis**: Construção modular com componentes independentes
- **Server Components**: Utilização de React Server Components para melhor performance
- **Client Components**: Componentes interativos marcados com "use client"
- **Roteamento Baseado em Arquivos**: Estrutura de diretórios que define as rotas
- **Renderização Híbrida**: Combinação de SSR, SSG e CSR conforme necessário

A aplicação é estruturada em camadas:

1. **Camada de Apresentação**: Componentes de UI e páginas
2. **Camada de Lógica**: Hooks, providers e gerenciamento de estado
3. **Camada de Dados**: Simulação de API e manipulação de dados (localStorage)

## 2. Frontend

### Tecnologias Principais

- **Next.js 14**: Framework React com App Router
- **React 18**: Biblioteca para construção de interfaces
- **TypeScript**: Superset tipado de JavaScript
- **Tailwind CSS**: Framework CSS utilitário
- **shadcn/ui**: Componentes de UI reutilizáveis

### Bibliotecas Complementares

- **Lucide React**: Ícones modernos e personalizáveis
- **React Hook Form** (planejado): Gerenciamento de formulários
- **Zod** (planejado): Validação de esquemas
- **SWR** (planejado): Estratégias de busca de dados

## 3. Estrutura de Arquivos

A aplicação segue a estrutura de diretórios do Next.js com App Router:

\`\`\`
/app                       # Diretório principal do App Router
  /(home)                  # Grupo de rota para a página inicial
  /favorites               # Página de projetos favoritos
  /login                   # Página de login
  /messages                # Sistema de mensagens
  /notifications           # Central de notificações
  /profile                 # Perfil do usuário
  /projects                # Exploração e gerenciamento de projetos
    /[id]                  # Detalhes de um projeto específico (rota dinâmica)
    /edit/[id]             # Edição de projeto (rota dinâmica)
    /metrics/[id]          # Métricas de um projeto (rota dinâmica)
    /my-projects           # Projetos do usuário
    /new                   # Criação de novo projeto
  /register                # Página de cadastro
  globals.css              # Estilos globais
  layout.tsx               # Layout principal da aplicação

/components                # Componentes reutilizáveis
  /ui                      # Componentes de UI básicos (shadcn)
  auth-check.tsx           # Componente de verificação de autenticação
  auth-provider.tsx        # Provedor de contexto de autenticação
  featured-projects.tsx    # Componente de projetos em destaque
  footer.tsx               # Rodapé da aplicação
  header.tsx               # Cabeçalho da aplicação
  mode-toggle.tsx          # Alternador de tema claro/escuro
  project-comments.tsx     # Sistema de comentários de projetos
  user-account-nav.tsx     # Navegação da conta do usuário

/hooks                     # Hooks personalizados
  use-media-query.ts       # Hook para consultas de mídia
  use-mobile.ts            # Hook para detectar dispositivos móveis

/lib                       # Funções utilitárias e lógica compartilhada
  utils.ts                 # Funções utilitárias gerais

/public                    # Arquivos estáticos
\`\`\`

## 4. Gerenciamento de Estado

### Contexto de Autenticação

O estado de autenticação é gerenciado através do `AuthProvider`, que:

- Mantém o estado do usuário atual
- Fornece funções para login, registro e logout
- Verifica a autenticação em rotas protegidas
- Simula persistência com localStorage

\`\`\`typescript
// Exemplo simplificado do AuthProvider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Verificar autenticação inicial
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])
  
  // Funções de autenticação
  const login = async (email: string, password: string) => {
    // Lógica de login
  }
  
  const register = async (userData: Partial<User>) => {
    // Lógica de registro
  }
  
  const logout = () => {
    // Lógica de logout
  }
  
  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
\`\`\`

### Estado Local

- **useState**: Utilizado para estado de componentes individuais
- **useEffect**: Para efeitos colaterais e sincronização
- **useRef**: Para referências persistentes entre renderizações

## 5. Roteamento e Navegação

### App Router do Next.js

- **Roteamento Baseado em Arquivos**: Estrutura de diretórios define as rotas
- **Layouts Aninhados**: Compartilhamento de UI entre rotas
- **Rotas Dinâmicas**: Uso de parâmetros com `[id]`
- **Grupos de Rotas**: Organização lógica com `(group)`

### Navegação Programática

\`\`\`typescript
// Exemplo de navegação programática
const router = useRouter()

// Redirecionamento
router.push('/projects/my-projects')

// Redirecionamento com parâmetros
router.push(`/projects/${projectId}`)

// Redirecionamento com query params
router.push(`/messages?user=${userName}`)
\`\`\`

### Proteção de Rotas

\`\`\`typescript
// Verificação de autenticação em páginas protegidas
useEffect(() => {
  if (!isLoading && !user) {
    router.push('/login')
  }
}, [user, isLoading, router])
\`\`\`

## 6. Componentes Principais

### AuthCheck

Componente para verificação de autenticação em nível de componente:

\`\`\`typescript
export default function AuthCheck({
  children,
  fallback,
  showDialog = true,
  action = "realizar esta ação",
}: AuthCheckProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [open, setOpen] = useState(false)
  
  if (isAuthenticated) {
    return <>{children}</>
  }
  
  if (!showDialog) {
    return <>{fallback || null}</>
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{fallback || <Button>{children}</Button>}</DialogTrigger>
      <DialogContent>
        {/* Conteúdo do diálogo de autenticação */}
      </DialogContent>
    </Dialog>
  )
}
\`\`\`

### Sistema de Mensagens

Componente complexo que gerencia conversas e mensagens:

- Agrupamento de mensagens por contato
- Interface responsiva tipo WhatsApp
- Simulação de respostas em tempo real
- Gerenciamento de estado de leitura

\`\`\`typescript
// Exemplo simplificado do componente de mensagens
export default function MessagesPage() {
  const [messageItems, setMessageItems] = useState(mockMessageItems)
  const [conversations, setConversations] = useState([])
  const [selectedContact, setSelectedContact] = useState(null)
  
  // Agrupar mensagens por contato
  useEffect(() => {
    const grouped = groupMessagesByContact(messageItems)
    setConversations(grouped)
  }, [messageItems])
  
  // Renderização da interface de chat
  return (
    <div className="grid grid-cols-[350px_1fr]">
      {/* Lista de conversas */}
      <Card>
        {conversations.map(conversation => (
          <div onClick={() => markConversationAsRead(conversation.contact)}>
            {/* Detalhes da conversa */}
          </div>
        ))}
      </Card>
      
      {/* Área de mensagens */}
      <Card>
        {selectedContact ? (
          <>
            {/* Cabeçalho da conversa */}
            <CardHeader>{selectedContact}</CardHeader>
            
            {/* Mensagens */}
            <ScrollArea>
              {conversationMessages.map(message => (
                <div className={message.isReceived ? "justify-start" : "justify-end"}>
                  {/* Conteúdo da mensagem */}
                </div>
              ))}
            </ScrollArea>
            
            {/* Área de resposta */}
            <div className="flex gap-2">
              <Input value={replyText} onChange={e => setReplyText(e.target.value)} />
              <Button onClick={handleSendReply}>Enviar</Button>
            </div>
          </>
        ) : (
          <div>Selecione uma conversa</div>
        )}
      </Card>
    </div>
  )
}
\`\`\`

## 7. Estilização

### Tailwind CSS

- **Utilitários**: Classes utilitárias para estilização rápida
- **Componentes**: Combinação de utilitários para componentes consistentes
- **Responsividade**: Prefixos de breakpoint (`md:`, `lg:`)
- **Temas**: Variáveis CSS para temas claro/escuro

### Customizações

\`\`\`css
/* Exemplo de customizações no globals.css */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --primary: 262.1 83.3% 57.8%;
    /* Outras variáveis */
  }

  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    /* Outras variáveis para tema escuro */
  }
}

/* Animações personalizadas */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out forwards;
}
\`\`\`

### shadcn/ui

- **Componentes Base**: Botões, cards, inputs, etc.
- **Personalização**: Adaptação para o design do ProjetoConnect
- **Acessibilidade**: Componentes acessíveis por padrão
- **Consistência**: Design system unificado

## 8. Autenticação

### Fluxo de Autenticação

1. **Registro**: Coleta de informações do usuário
2. **Login**: Verificação de credenciais
3. **Persistência**: Armazenamento de sessão
4. **Verificação**: Proteção de rotas e ações

### Simulação de Backend

\`\`\`typescript
// Simulação de login
const login = async (email: string, password: string) => {
  setIsLoading(true)
  
  try {
    // Simulação de chamada API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Usuário simulado
    const mockUser = {
      id: "user-1",
      name: "João Silva",
      email: email,
      role: "student",
    }
    
    setUser(mockUser)
    localStorage.setItem("user", JSON.stringify(mockUser))
    router.push("/projects")
  } catch (error) {
    throw error
  } finally {
    setIsLoading(false)
  }
}
\`\`\`

## 9. Responsividade

### Estratégia Mobile-First

- **Design Adaptativo**: Layout que se ajusta a diferentes tamanhos de tela
- **Breakpoints**: Pontos de quebra para diferentes dispositivos
- **Componentes Responsivos**: UI que se reorganiza conforme o espaço disponível

### Hooks de Mídia

\`\`\`typescript
// Hook para detectar dispositivos móveis
export function useMobileMedia(): boolean {
  return useMediaQuery("(max-width: 768px)")
}

// Hook para consultas de mídia genéricas
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)
  
  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    
    const listener = () => setMatches(media.matches)
    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [matches, query])
  
  return matches
}
\`\`\`

### Adaptações para Mobile

- **Menu Hamburger**: Navegação compacta em telas pequenas
- **Visualização Alternada**: Troca entre lista e detalhe em componentes como mensagens
- **Touch-Friendly**: Elementos maiores para interação por toque
- **Simplificação**: Redução de informações em telas menores

## 10. Performance

### Otimizações Implementadas

- **Lazy Loading**: Carregamento sob demanda de componentes pesados
- **Memoização**: Uso de `useMemo` e `useCallback` para evitar recálculos
- **Virtualização**: Renderização eficiente de listas longas
- **Skeleton Loading**: Feedback visual durante carregamento

### Otimizações Planejadas

- **Image Optimization**: Uso do componente `next/image` para otimização de imagens
- **Code Splitting**: Divisão de código para carregamento mais rápido
- **Prefetching**: Pré-carregamento de rotas prováveis
- **Caching**: Estratégias de cache para dados frequentemente acessados

---

Este documento será atualizado conforme a arquitetura da aplicação evolui e novas tecnologias são incorporadas.

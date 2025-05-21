# ProjetoConnect - Plataforma de Conexão entre Estudantes e Investidores

## Visão Geral

ProjetoConnect é uma plataforma web que conecta estudantes universitários a potenciais investidores, permitindo que projetos acadêmicos inovadores ganhem visibilidade e oportunidades de financiamento. A plataforma facilita a exposição de projetos, comunicação entre as partes e acompanhamento de métricas de desempenho.

![ProjetoConnect](https://via.placeholder.com/800x400?text=ProjetoConnect)

## Índice

- [Funcionalidades Principais](#funcionalidades-principais)
- [Estrutura da Aplicação](#estrutura-da-aplicação)
- [Fluxos de Usuário](#fluxos-de-usuário)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Componentes Principais](#componentes-principais)
- [Autenticação e Autorização](#autenticação-e-autorização)
- [Sistema de Mensagens](#sistema-de-mensagens)
- [Métricas e Analytics](#métricas-e-analytics)
- [Instalação e Configuração](#instalação-e-configuração)
- [Melhorias Futuras](#melhorias-futuras)

## Funcionalidades Principais

### 1. Exploração de Projetos

- **Listagem de Projetos**: Visualização de todos os projetos disponíveis na plataforma
- **Filtros e Busca**: Filtragem por área, ordenação por popularidade/data e busca por palavras-chave
- **Detalhes do Projeto**: Página detalhada com descrição, objetivos, imagens e informações do autor

### 2. Gerenciamento de Projetos

- **Criação de Projetos**: Interface para estudantes criarem novos projetos
- **Edição de Projetos**: Atualização de informações, imagens e status
- **Métricas de Desempenho**: Visualização de estatísticas como visualizações, curtidas e mensagens
- **Meus Projetos**: Dashboard para gerenciar todos os projetos do usuário

### 3. Sistema de Mensagens

- **Chat em Tempo Real**: Comunicação direta entre estudantes e investidores
- **Notificações**: Alertas sobre novas mensagens e interações
- **Histórico de Conversas**: Acesso a todas as conversas anteriores
- **Contato via Projeto**: Possibilidade de iniciar conversa a partir da página de um projeto

### 4. Perfil e Conta

- **Perfil Público**: Página com informações do usuário e seus projetos
- **Configurações de Conta**: Gerenciamento de informações pessoais e preferências
- **Segurança**: Alteração de senha e configurações de privacidade

### 5. Interação Social

- **Curtidas**: Possibilidade de curtir projetos interessantes
- **Comentários**: Discussões públicas sobre os projetos
- **Favoritos**: Salvamento de projetos para acesso posterior
- **Compartilhamento**: Compartilhamento de projetos em redes sociais

### 6. Notificações

- **Central de Notificações**: Hub centralizado para todas as notificações
- **Categorização**: Separação por tipo (mensagens, curtidas, comentários, etc.)
- **Configurações**: Personalização de quais notificações receber

## Estrutura da Aplicação

A aplicação segue a estrutura de diretórios do Next.js com o App Router:

\`\`\`
/app
  /(home)
    page.tsx                # Página inicial (redirecionamento)
  /favorites
    page.tsx                # Página de projetos favoritos
  /login
    page.tsx                # Página de login
  /messages
    page.tsx                # Sistema de mensagens
  /notifications
    page.tsx                # Central de notificações
  /profile
    page.tsx                # Perfil do usuário
  /projects
    page.tsx                # Exploração de projetos
    /[id]
      page.tsx              # Detalhes de um projeto específico
    /edit/[id]
      page.tsx              # Edição de projeto
    /metrics/[id]
      page.tsx              # Métricas de um projeto
    /my-projects
      page.tsx              # Projetos do usuário
    /new
      page.tsx              # Criação de novo projeto
  /register
    page.tsx                # Página de cadastro
  globals.css               # Estilos globais
  layout.tsx                # Layout principal da aplicação

/components
  auth-check.tsx            # Componente de verificação de autenticação
  auth-provider.tsx         # Provedor de contexto de autenticação
  featured-projects.tsx     # Componente de projetos em destaque
  footer.tsx                # Rodapé da aplicação
  header.tsx                # Cabeçalho da aplicação
  mode-toggle.tsx           # Alternador de tema claro/escuro
  project-comments.tsx      # Sistema de comentários de projetos
  user-account-nav.tsx      # Navegação da conta do usuário
  /ui                       # Componentes de UI reutilizáveis

/hooks
  use-media-query.ts        # Hook para consultas de mídia
  use-mobile.ts             # Hook para detectar dispositivos móveis

/lib
  utils.ts                  # Funções utilitárias
\`\`\`

## Fluxos de Usuário

### Fluxo de Estudante

1. **Cadastro/Login**: Criação de conta como estudante
2. **Criação de Projeto**: Preenchimento de informações e upload de imagens
3. **Gerenciamento**: Acompanhamento de métricas e interações
4. **Comunicação**: Resposta a mensagens de investidores interessados

### Fluxo de Investidor

1. **Cadastro/Login**: Criação de conta como investidor
2. **Exploração**: Navegação pelos projetos disponíveis
3. **Interação**: Curtidas, comentários e salvamento de favoritos
4. **Contato**: Envio de mensagens para autores de projetos interessantes

## Tecnologias Utilizadas

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Estilização**: Tailwind CSS, shadcn/ui (componentes)
- **Autenticação**: Sistema simulado (em produção seria NextAuth.js ou similar)
- **Responsividade**: Design adaptativo para desktop e dispositivos móveis
- **Temas**: Suporte a tema claro e escuro
- **Animações**: CSS Transitions e Keyframes

## Componentes Principais

### Header

O cabeçalho da aplicação contém:
- Logo e navegação principal
- Alternador de tema (claro/escuro)
- Menu de usuário (quando autenticado)
- Notificações
- Menu mobile responsivo

### Sistema de Projetos

- **Card de Projeto**: Exibe informações resumidas de um projeto
- **Página de Detalhes**: Visualização completa com descrição, objetivos e comentários
- **Formulário de Criação/Edição**: Interface para gerenciar informações do projeto
- **Dashboard de Métricas**: Visualização de estatísticas e desempenho

### Sistema de Mensagens

- **Lista de Conversas**: Exibe todas as conversas do usuário
- **Chat**: Interface para troca de mensagens em tempo real
- **Notificações**: Alertas sobre novas mensagens
- **Busca**: Pesquisa em conversas e mensagens

## Autenticação e Autorização

A aplicação utiliza um sistema de autenticação simulado que:

- Gerencia estado de login/logout
- Protege rotas que requerem autenticação
- Diferencia entre tipos de usuário (estudante/investidor)
- Armazena dados de sessão no localStorage (em produção seria com cookies seguros)

O componente `AuthProvider` gerencia o estado de autenticação globalmente, enquanto o componente `AuthCheck` protege componentes e funcionalidades específicas.

## Sistema de Mensagens

O sistema de mensagens permite comunicação direta entre usuários:

- **Conversas Agrupadas**: Mensagens organizadas por contato
- **Interface Tipo WhatsApp**: Lista de contatos à esquerda e conversa à direita
- **Indicadores de Status**: Marcação de mensagens lidas/não lidas
- **Responsividade**: Adaptação para dispositivos móveis
- **Simulação de Respostas**: Para fins de demonstração

Funcionalidades específicas:
- Envio de mensagens com Enter
- Indicador de digitação
- Rolagem automática para novas mensagens
- Formatação de data relativa (hoje, ontem, etc.)

## Métricas e Analytics

A plataforma oferece métricas detalhadas para projetos:

- **Visualizações**: Contagem e tendências de visualizações
- **Engajamento**: Curtidas, comentários e tempo na página
- **Conversões**: Mensagens recebidas e taxa de resposta
- **Demografia**: Origem dos visitantes e dispositivos utilizados

## Instalação e Configuração

1. Clone o repositório:
\`\`\`bash
git clone https://github.com/seu-usuario/projeto-connect.git
cd projeto-connect
\`\`\`

2. Instale as dependências:
\`\`\`bash
npm install
\`\`\`

3. Execute o servidor de desenvolvimento:
\`\`\`bash
npm run dev
\`\`\`

4. Acesse a aplicação em `http://localhost:3000`

## Melhorias Futuras

### Funcionalidades Planejadas

1. **Autenticação Real**: Implementação com NextAuth.js e provedores OAuth
2. **Banco de Dados**: Integração com PostgreSQL ou MongoDB
3. **Sistema de Notificações em Tempo Real**: Implementação com WebSockets
4. **Upload de Arquivos**: Suporte para documentos e apresentações
5. **Sistema de Recomendação**: Sugestões personalizadas de projetos
6. **Comentários Aninhados**: Respostas a comentários específicos
7. **Estatísticas Avançadas**: Análises mais detalhadas de desempenho
8. **Perfis Públicos**: Páginas públicas para usuários
9. **Sistema de Favoritos**: Organização de projetos salvos
10. **Filtros Avançados**: Mais opções de filtragem e ordenação

### Melhorias Técnicas

1. **Testes Automatizados**: Implementação de testes unitários e E2E
2. **Otimização de Performance**: Lazy loading e code splitting
3. **Acessibilidade**: Melhorias para conformidade com WCAG
4. **Internacionalização**: Suporte a múltiplos idiomas
5. **PWA**: Transformação em Progressive Web App
6. **SEO**: Otimização para motores de busca
7. **CI/CD**: Pipeline de integração e entrega contínua
8. **Monitoramento**: Implementação de logging e rastreamento de erros

---

## Conclusão

ProjetoConnect é uma plataforma completa para conectar estudantes universitários e investidores, facilitando a exposição de projetos acadêmicos inovadores e criando oportunidades de financiamento. Com uma interface intuitiva e recursos abrangentes, a plataforma oferece uma experiência rica para todos os usuários.

Para mais informações ou suporte, entre em contato através de [contato@projetoconnect.com](mailto:contato@projetoconnect.com).

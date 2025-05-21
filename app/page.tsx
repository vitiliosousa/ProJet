import { redirect } from "next/navigation"

export default function Home() {
  // Redireciona diretamente para a página de projetos sem verificar autenticação
  redirect("/projects")
}

import Link from "next/link"
import { Lightbulb } from "lucide-react"
import Image from "next/image"
import projet from "@/public/projet.svg"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background py-8 md:py-12">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Image src={projet} alt="" className="size-28" />
            </Link>
            <p className="text-sm text-muted-foreground">
              Conectando ideias a investidores para transformar projectos em realidade.
            </p>
          </div>
          <div className="grid gap-2">
            <h3 className="font-semibold">Conta</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Entrar
              </Link>
              <Link
                href="/register?role=student"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cadastro de Estudante
              </Link>
              <Link
                href="/register?role=investor"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cadastro de Investidor
              </Link>
            </nav>
          </div>
          <div className="grid gap-2">
            <h3 className="font-semibold">Legal</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Termos de Uso
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Política de Privacidade
              </Link>
              <Link href="/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Política de Cookies
              </Link>
            </nav>
          </div>
        </div>
        <div className="mt-8 border-t pt-6">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ProJet. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

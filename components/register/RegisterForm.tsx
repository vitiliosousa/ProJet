'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useAuth } from '@/components/auth-provider'
import { ProfileTypeSelector } from './ProfileTypeSelector'
import { PersonalInfoFields } from './PersonalInfoFields'
import { PasswordFields } from './PasswordFields'
import { Lightbulb } from 'lucide-react'

export function RegisterForm() {
  const router = useRouter()
  const { register } = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [role, setRole] = useState<string>('student')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [university, setUniversity] = useState('')
  const [company, setCompany] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      setIsLoading(false)
      return
    }

    try {
      await register({
        name: `${firstName} ${lastName}`,
        email,
        role: role as 'student' | 'investor',
        password,
      })
    } catch (err) {
      setError('Falha ao registrar. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-8 md:py-12 flex flex-col items-center">
      <div className="w-full max-w-md mx-auto">
        <div className="flex flex-col space-y-2 text-center mb-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-2">
              <Lightbulb className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Crie sua conta</h1>
          <p className="text-sm text-muted-foreground">Preencha os dados abaixo para se cadastrar</p>
        </div>

        {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">{error}</div>}

        <Card className="rounded-xl shadow-sm animate-fadeIn">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Cadastro</CardTitle>
              <CardDescription>Escolha seu tipo de perfil e preencha seus dados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProfileTypeSelector role={role} onRoleChange={setRole} />
              
              <PersonalInfoFields
                firstName={firstName}
                lastName={lastName}
                email={email}
                university={university}
                company={company}
                role={role}
                onFirstNameChange={setFirstName}
                onLastNameChange={setLastName}
                onEmailChange={setEmail}
                onUniversityChange={setUniversity}
                onCompanyChange={setCompany}
              />

              <PasswordFields
                password={password}
                confirmPassword={confirmPassword}
                onPasswordChange={setPassword}
                onConfirmPasswordChange={setConfirmPassword}
              />
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button className="w-full button-hover-effect" type="submit" disabled={isLoading}>
                {isLoading ? 'Cadastrando...' : 'Cadastrar'}
              </Button>
              <div className="text-center text-sm">
                Já tem uma conta?{' '}
                <Link href="/login" className="text-primary hover:underline underline-offset-4">
                  Entrar
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
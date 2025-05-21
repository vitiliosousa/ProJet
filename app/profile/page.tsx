'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/components/auth-provider'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { StatisticsCard } from '@/components/profile/StatisticsCard'
import { PersonalInfoForm } from '@/components/profile/PersonalInfoForm'
import { SecurityForm } from '@/components/profile/SecurityForm'

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    university: 'Universidade Federal',
    course: 'Engenharia de Software',
    bio: 'Estudante de engenharia apaixonado por tecnologia e inovação.',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      alert('Perfil atualizado com sucesso!')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      alert('Senha atualizada com sucesso!')
      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }))
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    router.push('/login')
    return null
  }

  const statistics = [
    { label: 'Projetos', value: 3 },
    { label: 'Visualizações', value: 124 },
    { label: 'Curtidas', value: 24 },
    { label: 'Mensagens', value: 5 },
  ]

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold tracking-tight gradient-heading">Minha Conta</h1>

        <div className="grid gap-6 md:grid-cols-[250px_1fr]">
          <div className="space-y-6">
            <ProfileHeader
              name={user.name}
              email={user.email}
              image={user.image}
              role="Estudante"
            />
            <StatisticsCard statistics={statistics} />
          </div>

          <div>
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2 rounded-xl">
                <TabsTrigger value="profile" className="rounded-lg">
                  Informações Pessoais
                </TabsTrigger>
                <TabsTrigger value="security" className="rounded-lg">
                  Segurança
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-4 animate-fadeIn">
                <PersonalInfoForm
                  formData={formData}
                  isLoading={isLoading}
                  onSubmit={handleSaveProfile}
                  onChange={handleChange}
                />
              </TabsContent>

              <TabsContent value="security" className="mt-4 animate-fadeIn">
                <SecurityForm
                  formData={formData}
                  isLoading={isLoading}
                  onSubmit={handleChangePassword}
                  onChange={handleChange}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

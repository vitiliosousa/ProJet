'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Save } from 'lucide-react'

interface PersonalInfoFormProps {
  formData: {
    name: string
    email: string
    university: string
    course: string
    bio: string
  }
  isLoading: boolean
  onSubmit: (e: React.FormEvent) => Promise<void>
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export function PersonalInfoForm({ formData, isLoading, onSubmit, onChange }: PersonalInfoFormProps) {
  return (
    <Card className="rounded-xl glass-card">
      <CardHeader>
        <CardTitle>Informações Pessoais</CardTitle>
        <CardDescription>Atualize suas informações pessoais</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input id="name" name="name" value={formData.name} onChange={onChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={onChange}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="university">Universidade</Label>
              <Input
                id="university"
                name="university"
                value={formData.university}
                onChange={onChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course">Curso</Label>
              <Input id="course" name="course" value={formData.course} onChange={onChange} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Biografia</Label>
            <Input id="bio" name="bio" value={formData.bio} onChange={onChange} />
            <p className="text-xs text-muted-foreground">
              Breve descrição sobre você que será exibida no seu perfil.
            </p>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading} className="button-hover-effect">
              {isLoading ? (
                "Salvando..."
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
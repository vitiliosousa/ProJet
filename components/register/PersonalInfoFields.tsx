'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface PersonalInfoFieldsProps {
  firstName: string
  lastName: string
  email: string
  university: string
  company: string
  role: string
  onFirstNameChange: (value: string) => void
  onLastNameChange: (value: string) => void
  onEmailChange: (value: string) => void
  onUniversityChange: (value: string) => void
  onCompanyChange: (value: string) => void
}

export function PersonalInfoFields({
  firstName,
  lastName,
  email,
  university,
  company,
  role,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onUniversityChange,
  onCompanyChange,
}: PersonalInfoFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Nome</Label>
          <Input
            id="firstName"
            placeholder="João"
            required
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Sobrenome</Label>
          <Input
            id="lastName"
            placeholder="Silva"
            required
            value={lastName}
            onChange={(e) => onLastNameChange(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          required
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
        />
      </div>

      {role === 'student' && (
        <div className="space-y-2">
          <Label htmlFor="university">Universidade</Label>
          <Input
            id="university"
            placeholder="Nome da sua universidade"
            required
            value={university}
            onChange={(e) => onUniversityChange(e.target.value)}
          />
        </div>
      )}

      {role === 'investor' && (
        <div className="space-y-2">
          <Label htmlFor="company">Empresa (opcional)</Label>
          <Input
            id="company"
            placeholder="Nome da sua empresa"
            value={company}
            onChange={(e) => onCompanyChange(e.target.value)}
          />
        </div>
      )}
    </>
  )
}
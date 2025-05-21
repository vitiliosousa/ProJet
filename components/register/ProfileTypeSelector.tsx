'use client'

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface ProfileTypeSelectorProps {
  role: string
  onRoleChange: (role: string) => void
}

export function ProfileTypeSelector({ role, onRoleChange }: ProfileTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>Tipo de Perfil</Label>
      <RadioGroup defaultValue={role} onValueChange={onRoleChange} className="flex flex-col space-y-1">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="student" id="student" />
          <Label htmlFor="student" className="font-normal">
            Estudante - Quero compartilhar meu projeto
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="investor" id="investor" />
          <Label htmlFor="investor" className="font-normal">
            Investidor - Quero encontrar projetos para apoiar
          </Label>
        </div>
      </RadioGroup>
    </div>
  )
}
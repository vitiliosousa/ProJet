'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface SecurityFormProps {
  formData: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }
  isLoading: boolean
  onSubmit: (e: React.FormEvent) => Promise<void>
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function SecurityForm({ formData, isLoading, onSubmit, onChange }: SecurityFormProps) {
  return (
    <Card className="rounded-xl glass-card">
      <CardHeader>
        <CardTitle>Segurança</CardTitle>
        <CardDescription>Atualize sua senha</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Senha Atual</Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={onChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Nova Senha</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={onChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={onChange}
              required
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading} className="button-hover-effect">
              {isLoading ? "Atualizando..." : "Atualizar Senha"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
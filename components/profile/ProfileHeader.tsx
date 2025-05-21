'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Camera } from 'lucide-react'

interface ProfileHeaderProps {
  name: string
  email: string
  image?: string
  role?: string
}

export function ProfileHeader({ name, email, image, role = 'Estudante' }: ProfileHeaderProps) {
  return (
    <Card className="rounded-xl glass-card">
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="relative mb-4 group">
          <Avatar className="h-32 w-32 border-4 border-primary/20">
            <AvatarImage src={"https://github.com/shadcn.png"} alt={name} />
            <AvatarFallback className="text-4xl">{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 right-0 rounded-full bg-primary p-2 cursor-pointer hover:bg-primary/80 transition-colors">
            <Camera className="h-4 w-4 text-white" />
          </div>
        </div>
        <h3 className="font-bold text-xl">{name}</h3>
        <p className="text-sm text-muted-foreground">{email}</p>
        <p className="text-sm text-muted-foreground mt-1">{role}</p>
      </CardContent>
    </Card>
  )
}
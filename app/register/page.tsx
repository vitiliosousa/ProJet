'use client'

import { useSearchParams } from 'next/navigation'
import { RegisterForm } from '@/components/register/RegisterForm'

export default function RegisterPage() {
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get('role') || 'student'

  return <RegisterForm />
}

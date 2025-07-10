// app/api/projects/route.ts
import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      titulo_do_projeto,
      area_do_projeto,
      descricao_curta,
      tags,
      descricao_completa,
      objetivos,
      status_do_projeto,
      imagem_principal,
      imagens_adicionais,
      documentos_complementares,
    } = body

    // Validação mínima
    if (
      !titulo_do_projeto ||
      !area_do_projeto ||
      !descricao_curta ||
      !descricao_completa ||
      !status_do_projeto
    ) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes ou inválidos.' }, { status: 400 })
    }

    const { data, error } = await supabase.from('project').insert([
      {
        titulo_do_projeto,
        area_do_projeto,
        descricao_curta,
        tags,
        descricao_completa,
        objetivos,
        status_do_projeto,
        imagem_principal,
        imagens_adicionais,
        documentos_complementares,
      },
    ])

    if (error) {
      console.error('Erro ao inserir no Supabase:', error)
      return NextResponse.json({ error: 'Erro ao salvar projeto.' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Projeto submetido com sucesso.', data }, { status: 201 })
  } catch (err) {
    console.error('Erro inesperado:', err)
    return NextResponse.json({ error: 'Erro no servidor.' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase.from('project').select('*')

    if (error) {
      console.error('Erro ao buscar projetos no Supabase:', error)
      return NextResponse.json({ error: 'Erro ao buscar projetos.' }, { status: 500 })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (err) {
    console.error('Erro inesperado:', err)
    return NextResponse.json({ error: 'Erro no servidor.' }, { status: 500 })
  }
}

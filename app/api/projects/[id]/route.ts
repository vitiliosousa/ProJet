// app/api/projects/[id]/route.ts
import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: 'ID do projeto não fornecido.' }, { status: 400 })
    }

    const { data, error } = await supabase.from('project').select('*').eq('id', id).single()

    if (error) {
      console.error('Erro ao buscar projeto no Supabase:', error)
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Projeto não encontrado.' }, { status: 404 })
      }
      return NextResponse.json({ error: 'Erro ao buscar projeto.' }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Projeto não encontrado.' }, { status: 404 })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (err) {
    console.error('Erro inesperado:', err)
    return NextResponse.json({ error: 'Erro no servidor.' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: 'ID do projeto não fornecido.' }, { status: 400 })
    }

    // Primeiro, verifique se o projeto existe
    const { data: existingProject, error: fetchError } = await supabase
      .from('project')
      .select('id')
      .eq('id', id)
      .single()

    if (fetchError || !existingProject) {
      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116: single row not found
        console.error('Erro ao verificar projeto no Supabase:', fetchError)
        return NextResponse.json({ error: 'Erro ao verificar projeto.' }, { status: 500 })
      }
      return NextResponse.json({ error: 'Projeto não encontrado para exclusão.' }, { status: 404 })
    }

    // Se o projeto existe, prossiga com a exclusão
    const { error: deleteError } = await supabase.from('project').delete().eq('id', id)

    if (deleteError) {
      console.error('Erro ao excluir projeto no Supabase:', deleteError)
      return NextResponse.json({ error: 'Erro ao excluir projeto.' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Projeto excluído com sucesso.' }, { status: 200 })
  } catch (err) {
    console.error('Erro inesperado:', err)
    return NextResponse.json({ error: 'Erro no servidor.' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await req.json()

    if (!id) {
      return NextResponse.json({ error: 'ID do projeto não fornecido.' }, { status: 400 })
    }

    // Validação mínima (pode ser expandida conforme necessário)
    if (Object.keys(body).length === 0) {
      return NextResponse.json({ error: 'Nenhum dado fornecido para atualização.' }, { status: 400 })
    }

    const { data, error } = await supabase.from('project').update(body).eq('id', id).select().single()

    if (error) {
      console.error('Erro ao atualizar projeto no Supabase:', error)
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Projeto não encontrado para atualização.' }, { status: 404 })
      }
      return NextResponse.json({ error: 'Erro ao atualizar projeto.' }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Projeto não encontrado para atualização.' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Projeto atualizado com sucesso.', data }, { status: 200 })
  } catch (err) {
    console.error('Erro inesperado:', err)
    return NextResponse.json({ error: 'Erro no servidor.' }, { status: 500 })
  }
}

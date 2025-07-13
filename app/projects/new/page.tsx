'use client'

import type React from 'react'
import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, X, Upload, Paperclip } from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import { supabase } from '@/lib/supabase'
import areas from '@/data/areas' // Import the updated areas list

export default function NewProjectPage() {
  const router = useRouter()
  const { user } = useAuth()

  // Tab state
  const [activeTab, setActiveTab] = useState("basic")

  // Form state
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [area, setArea] = useState("")
  const [shortDesc, setShortDesc] = useState("")
  const [fullDesc, setFullDesc] = useState("")
  const [status, setStatus] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [objetivos, setObjectives] = useState<string[]>([])
  const [objectiveInput, setObjectiveInput] = useState("")

  // File state
  const [mainImage, setMainImage] = useState<File | null>(null)
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null)
  const [additionalImages, setAdditionalImages] = useState<File[]>([])
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([])
  const [documents, setDocuments] = useState<File[]>([])

  // Refs for file inputs
  const mainImageRef = useRef<HTMLInputElement>(null)
  const additionalImagesRef = useRef<HTMLInputElement>(null)
  const documentsRef = useRef<HTMLInputElement>(null)


  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleAddObjective = () => {
    if (objectiveInput.trim() && !objetivos.includes(objectiveInput.trim())) {
      setObjectives([...objetivos, objectiveInput.trim()])
      setObjectiveInput("")
    }
  }

  const handleRemoveObjective = (objectiveToRemove: string) => {
    setObjectives(objetivos.filter((o) => o !== objectiveToRemove))
  }

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setMainImage(file)
      if (mainImagePreview) URL.revokeObjectURL(mainImagePreview)
      setMainImagePreview(URL.createObjectURL(file))
    }
  }

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newFiles = Array.from(files)
      const combined = [...additionalImages, ...newFiles].slice(0, 5)
      setAdditionalImages(combined)

      additionalImagePreviews.forEach(URL.revokeObjectURL)
      const newPreviews = combined.map((file) => URL.createObjectURL(file))
      setAdditionalImagePreviews(newPreviews)
    }
  }

  const handleRemoveAdditionalImage = (index: number) => {
    const newImages = [...additionalImages]
    const newPreviews = [...additionalImagePreviews]
    URL.revokeObjectURL(newPreviews[index])
    newImages.splice(index, 1)
    newPreviews.splice(index, 1)
    setAdditionalImages(newImages)
    setAdditionalImagePreviews(newPreviews)
  }

  const handleDocumentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      setDocuments((prev) => [...prev, ...Array.from(files)])
    }
  }

  const handleRemoveDocument = (index: number) => {
    const newDocuments = [...documents]
    newDocuments.splice(index, 1)
    setDocuments(newDocuments)
  }

  async function uploadFile(file: File, path: string): Promise<string | null> {
  try {
    // Corrigindo o nome do bucket (removendo o colchete)
    const { data, error } = await supabase.storage.from("projetos").upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    });

    if (error) {
      console.error("Erro no upload:", error.message);
      return null;
    }

    const { data: publicURLData } = await supabase.storage
      .from("projetos")
      .getPublicUrl(data.path);

    return publicURLData.publicUrl;
  } catch (err) {
    console.error("Erro inesperado no upload:", err);
    return null;
  }
}

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  if (!title || !area || !shortDesc || !fullDesc || !status || !mainImage) {
    alert("Preencha todos os campos obrigatórios, incluindo a imagem principal.");
    setIsLoading(false);
    return;
  }

  try {
    let imagem_principal: string | undefined;
    const imagens_adicionais: string[] = [];
    const documentos_complementares: string[] = [];

    // Upload da imagem principal
    if (mainImage) {
      const uploaded = await uploadFile(
        mainImage, 
        `principal/${user?.id}_${Date.now()}_${mainImage.name}`
      );
      if (!uploaded) throw new Error("Falha no upload da imagem principal");
      imagem_principal = uploaded;
    }

    // Upload de imagens adicionais
    for (const [index, file] of additionalImages.entries()) {
      const url = await uploadFile(
        file, 
        `adicionais/${user?.id}_${Date.now()}_${index}_${file.name}`
      );
      if (url) imagens_adicionais.push(url);
    }

    // Upload de documentos
    for (const [index, file] of documents.entries()) {
      const url = await uploadFile(
        file, 
        `documentos/${user?.id}_${Date.now()}_${index}_${file.name}`
      );
      if (url) documentos_complementares.push(url);
    }

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titulo_do_projeto: title,
        area_do_projeto: area,
        descricao_curta: shortDesc,
        descricao_completa: fullDesc,
        status_do_projeto: status,
        tags,
        objetivos,
        imagem_principal,
        imagens_adicionais,
        documentos_complementares,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Erro ao salvar projeto.");
    }

    // Limpar previews após o upload
    if (mainImagePreview) URL.revokeObjectURL(mainImagePreview);
    additionalImagePreviews.forEach(URL.revokeObjectURL);

    router.push("/projects/my-projects");
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      alert(err.message || "Erro ao submeter projeto.");
    } else {
      alert("Erro ao submeter projeto.");
    }
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="container max-w-4xl py-8">
      <Link
        href="/projects/my-projects"
        className="flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Voltar para Meus Projetos</span>
      </Link>

      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight gradient-heading">Novo Projeto</h1>
          <p className="text-muted-foreground">
            Preencha os detalhes do seu projeto para compartilhá-lo com potenciais investidores
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="media">Mídia</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="basic" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Básicas</CardTitle>
                  <CardDescription>Preencha as informações essenciais do seu projeto</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título do Projeto *</Label>
                    <Input
                      id="title"
                      placeholder="Ex: Sistema de Monitoramento Ambiental IoT"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="area">Área do Projeto *</Label>
                    <Select required value={area} onValueChange={setArea}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma área" />
                      </SelectTrigger>
                      <SelectContent>
                        {areas.filter(a => a !== "Todas as Áreas").map((area) => (
                          <SelectItem key={area} value={area}>
                            {area}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shortDescription">Descrição Curta *</Label>
                    <Textarea
                      id="shortDescription"
                      placeholder="Descreva seu projeto em poucas palavras (máx. 200 caracteres)"
                      maxLength={200}
                      required
                      value={shortDesc}
                      onChange={(e) => setShortDesc(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Esta descrição será exibida nos cards de projetos</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <div className="flex gap-2">
                      <Input
                        id="tags"
                        placeholder="Ex: IoT, Meio Ambiente"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            handleAddTag()
                          }
                        }}
                      />
                      <Button type="button" onClick={handleAddTag} variant="outline">
                        Adicionar
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag) => (
                        <div
                          key={tag}
                          className="flex items-center gap-1 bg-muted text-muted-foreground rounded-full px-3 py-1 text-sm"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="button" onClick={() => setActiveTab("details")}>
                    Próximo
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Detalhes do Projeto</CardTitle>
                  <CardDescription>Forneça informações detalhadas sobre seu projeto</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullDescription">Descrição Completa *</Label>
                    <Textarea
                      id="fullDescription"
                      placeholder="Descreva seu projeto em detalhes"
                      className="min-h-[200px]"
                      required
                      value={fullDesc}
                      onChange={(e) => setFullDesc(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="objectives">Objetivos</Label>
                    <div className="flex gap-2">
                      <Input
                        id="objectives"
                        placeholder="Ex: Desenvolver dispositivos de sensoriamento de baixo custo"
                        value={objectiveInput}
                        onChange={(e) => setObjectiveInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            handleAddObjective()
                          }
                        }}
                      />
                      <Button type="button" onClick={handleAddObjective} variant="outline">
                        Adicionar
                      </Button>
                    </div>
                    <div className="space-y-2 mt-2">
                      {objetivos.map((objective, index) => (
                        <div key={index} className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 text-sm">
                          <div className="rounded-full bg-primary/10 text-primary w-6 h-6 flex items-center justify-center">
                            {index + 1}
                          </div>
                          <span className="flex-1">{objective}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveObjective(objective)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status do Projeto *</Label>
                    <Select required value={status} onValueChange={setStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="idea">Ideia</SelectItem>
                        <SelectItem value="planning">Planejamento</SelectItem>
                        <SelectItem value="development">Em desenvolvimento</SelectItem>
                        <SelectItem value="testing">Em testes</SelectItem>
                        <SelectItem value="completed">Concluído</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" type="button" onClick={() => setActiveTab("basic")}>
                    Anterior
                  </Button>
                  <Button type="button" onClick={() => setActiveTab("media")}>
                    Próximo
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="media" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Mídia</CardTitle>
                  <CardDescription>Adicione imagens e arquivos ao seu projeto</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Main Image */}
                  <div className="space-y-2">
                    <Label htmlFor="main-image">Imagem Principal *</Label>
                    <div
                      className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 text-center"
                      onClick={() => mainImageRef.current?.click()}
                    >
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Arraste e solte ou clique para selecionar
                      </p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, GIF (máx. 5MB)</p>
                      <Input
                        id="main-image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={mainImageRef}
                        onChange={handleMainImageChange}
                        required
                      />
                    </div>
                    {mainImagePreview && (
                      <div className="mt-4 relative w-32 h-32">
                        <Image
                          src={mainImagePreview}
                          alt="Preview da imagem principal"
                          fill
                          className="rounded-lg object-cover"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                          onClick={() => {
                            setMainImage(null)
                            if (mainImagePreview) URL.revokeObjectURL(mainImagePreview)
                            setMainImagePreview(null)
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Additional Images */}
                  <div className="space-y-2">
                    <Label htmlFor="additional-images">Imagens Adicionais</Label>
                    <div
                      className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 text-center"
                      onClick={() => additionalImagesRef.current?.click()}
                    >
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Arraste e solte ou clique para selecionar (até 5)
                      </p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, GIF (máx. 5MB cada)</p>
                      <Input
                        id="additional-images"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        ref={additionalImagesRef}
                        onChange={handleAdditionalImagesChange}
                        disabled={additionalImages.length >= 5}
                      />
                    </div>
                    {additionalImagePreviews.length > 0 && (
                      <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                        {additionalImagePreviews.map((preview, index) => (
                          <div key={index} className="relative w-full aspect-square">
                            <Image src={preview} alt={`Preview ${index + 1}`} fill className="rounded-lg object-cover" />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                              onClick={() => handleRemoveAdditionalImage(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Documents */}
                  <div className="space-y-2">
                    <Label htmlFor="documents">Documentos Complementares</Label>
                    <div
                      className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 text-center"
                      onClick={() => documentsRef.current?.click()}
                    >
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Arraste e solte ou clique para selecionar</p>
                      <p className="text-xs text-muted-foreground">PDF, DOCX, PPTX (máx. 10MB cada)</p>
                      <Input
                        id="documents"
                        type="file"
                        accept=".pdf,.doc,.docx,.ppt,.pptx"
                        multiple
                        className="hidden"
                        ref={documentsRef}
                        onChange={handleDocumentsChange}
                      />
                    </div>
                    {documents.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {documents.map((doc, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-muted p-2 rounded-lg text-sm"
                          >
                            <div className="flex items-center gap-2">
                              <Paperclip className="h-4 w-4" />
                              <span className="truncate">{doc.name}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleRemoveDocument(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" type="button" onClick={() => setActiveTab("details")}>
                    Anterior
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Salvando..." : "Salvar Projeto"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </form>
        </Tabs>
      </div>
    </div>
  )
}
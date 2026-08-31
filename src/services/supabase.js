import { createClient } from '@supabase/supabase-js'

// Substitua pelas suas credenciais que você copiou
const SUPABASE_URL = 'https://xphzvvxmwecnsampbnmx.supabase.co'
const SUPABASE_KEY = 'sb_publishable_xznx0wX72X85jhndiuGsZg_ZVovmcwI'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export async function uploadImage(file, folder = 'Uploads Tasty Cuisine') {
  if (!file) return null

  // Gera um nome único para o arquivo usando o timestamp para evitar nomes duplicados
  const fileExt = file.name.split('.').pop()
  const fileName = `${folder}/${Date.now()}-${Math.random()}.${fileExt}`

  // 1. Faz o upload do arquivo para o bucket do Supabase
  const { data, error } = await supabase.storage
    .from('Uploads Tasty Cuisine') // Nome do Bucket que você criou no Supabase (troque se o seu for diferente)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.error('Erro ao fazer upload da imagem:', error.message)
    throw error
  }

  // 2. Busca a URL pública do arquivo enviado
  const { data: publicUrlData } = supabase.storage
    .from('Uploads Tasty Cuisine')
    .getPublicUrl(fileName)

  return publicUrlData.publicUrl
}
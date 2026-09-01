import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://xphzvvxmwecnsampbnmx.supabase.co'
const SUPABASE_KEY = 'sb_publishable_xznx0wX72X85jhndiuGsZg_ZVovmcwI'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

/**
 * Upload flexível usando UUID para receitas e ID fixo para usuários
 * @param {File|Blob} file - Arquivo vindo do input
 * @param {string|number} [userId] - ID do usuário (obrigatório apenas se isReceita = false)
 * @param {boolean} isReceita - true para Receitas, false para Usuários
 * @param {string} [oldImageUrl] - URL da imagem antiga (opcional, para apagar ao editar receita)
 */
export async function uploadImage(file, userId = null, isReceita = true, oldImageUrl = null) {
  try {
    if (!file) return null

    const BUCKET_NAME = 'Uploads Tasty Cuisine'
    const folder = isReceita ? 'receitas' : 'usuarios'
    const fileExt = file.name ? file.name.split('.').pop()?.toLowerCase() : 'png'

    // 1. Limpeza garantida da imagem antiga
    if (isReceita && oldImageUrl && typeof oldImageUrl === 'string') {
      try {
        // Pega tudo a partir de "receitas/" na URL antiga
        const urlWithoutParams = oldImageUrl.split('?')[0]
        const folderIndex = urlWithoutParams.indexOf(`${folder}/`)

        if (folderIndex !== -1) {
          // Ex: "receitas/receita_f47ac10b-58cc.png"
          const oldFilePath = urlWithoutParams.substring(folderIndex)
          
          console.log('Removendo do Storage:', oldFilePath)

          const { error: removeError } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([oldFilePath])

          if (removeError) {
            console.warn('Aviso do Storage ao deletar:', removeError.message)
          }
        }
      } catch (err) {
        console.warn('Erro ao tentar extrair caminho antigo:', err)
      }
    }

    // 2. Cria o novo caminho
    let filePath = ''
    if (isReceita) {
      const uuid = crypto.randomUUID()
      filePath = `${folder}/receita_${uuid}.${fileExt}`
    } else {
      filePath = `${folder}/user_${userId}.${fileExt}`
    }

    // 3. Upload
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: !isReceita,
      })

    if (error) throw error

    // 4. Retorna a URL pública
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath)

    return !isReceita 
      ? `${publicUrlData.publicUrl}?t=${Date.now()}` 
      : publicUrlData.publicUrl

  } catch (error) {
    console.error('Erro no upload:', error.message)
    return null
  }
}

/**
 * Deleta a imagem de uma receita do Supabase Storage
 * @param {string} imageUrl - URL pública completa da foto
 */
export async function deleteImage(imageUrl) {
  try {
    if (!imageUrl || typeof imageUrl !== 'string') return

    const BUCKET_NAME = 'Uploads Tasty Cuisine'
    const urlWithoutParams = imageUrl.split('?')[0]
    const folderIndex = urlWithoutParams.indexOf('receitas/')

    if (folderIndex !== -1) {
      const filePath = urlWithoutParams.substring(folderIndex)

      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([filePath])

      if (error) {
        console.warn('Erro ao deletar imagem do storage:', error.message)
      } else {
        console.log('Imagem deletada com sucesso do storage:', filePath)
      }
    }
  } catch (err) {
    console.error('Erro na remoção da imagem:', err)
  }
}
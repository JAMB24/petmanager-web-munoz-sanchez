'use server'

import { revalidatePath } from 'next/cache'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { HEALTH_STATUSES, type ActionState, type PetType } from '@/lib/pet-types'

type PetInput = {
  type: PetType
  code: string
  name: string
  bornYear: number
  color: string
  healthStatus: string
  breed: string
  pedigree: boolean
}

function parseInput(formData: FormData): PetInput | string {
  const type = formData.get('type')
  if (type !== 'dog' && type !== 'cat') return 'Tipo de mascota inválido.'

  const code = String(formData.get('code') ?? '').trim()
  const name = String(formData.get('name') ?? '').trim()
  const color = String(formData.get('color') ?? '').trim()
  const breed = String(formData.get('breed') ?? '').trim()
  const healthStatus = String(formData.get('healthStatus') ?? '')
  const bornYearRaw = String(formData.get('bornYear') ?? '').trim()
  const bornYear = Number(bornYearRaw)
  const currentYear = new Date().getFullYear()

  if (!code || code.length > 20) return 'El código es obligatorio (máx. 20 caracteres).'
  if (!name || name.length > 60) return 'El nombre es obligatorio (máx. 60 caracteres).'
  if (!Number.isInteger(bornYear) || bornYear < 1980 || bornYear > currentYear)
    return `El año de nacimiento debe estar entre 1980 y ${currentYear}.`
  if (color.length > 40) return 'El color admite máximo 40 caracteres.'
  if (breed.length > 60) return 'La raza admite máximo 60 caracteres.'
  if (!(HEALTH_STATUSES as readonly string[]).includes(healthStatus))
    return 'Estado de salud inválido.'

  return {
    type,
    code,
    name,
    bornYear,
    color,
    healthStatus,
    breed,
    pedigree: formData.get('pedigree') === 'on',
  }
}

async function codeInUse(code: string, excludePetId?: number) {
  const supabase = getSupabaseAdmin()
  let query = supabase.from('tb_pet').select('id').eq('code', code).limit(1)
  if (excludePetId) query = query.neq('id', excludePetId)
  const { data } = await query
  return (data?.length ?? 0) > 0
}

export async function savePet(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const input = parseInput(formData)
  if (typeof input === 'string') return { ok: false, message: input }

  const supabase = getSupabaseAdmin()
  const petId = Number(formData.get('petId')) || undefined
  const childId = Number(formData.get('childId')) || undefined
  const childTable = input.type === 'dog' ? 'tb_dog' : 'tb_cat'
  const petValues = {
    code: input.code,
    name: input.name,
    born_year: input.bornYear,
    color: input.color,
    health_status: input.healthStatus,
  }
  const childValues =
    input.type === 'dog' ? { breed: input.breed, pedigree: input.pedigree } : { breed: input.breed }

  if (await codeInUse(input.code, petId)) {
    return { ok: false, message: `Ya existe una mascota con el código "${input.code}".` }
  }

  if (petId && childId) {
    const { error: petError } = await supabase.from('tb_pet').update(petValues).eq('id', petId)
    if (petError) return { ok: false, message: 'No se pudo actualizar la mascota.' }
    const { error: childError } = await supabase
      .from(childTable)
      .update(childValues)
      .eq('id', childId)
    if (childError) return { ok: false, message: 'No se pudieron actualizar los datos de la raza.' }
    revalidatePath('/')
    return { ok: true, message: `${input.name} fue actualizado correctamente.` }
  }

  const { data: pet, error: petError } = await supabase
    .from('tb_pet')
    .insert(petValues)
    .select('id')
    .single()
  if (petError || !pet) return { ok: false, message: 'No se pudo registrar la mascota.' }

  const { error: childError } = await supabase
    .from(childTable)
    .insert({ ...childValues, id_pet: pet.id })
  if (childError) {
    await supabase.from('tb_pet').delete().eq('id', pet.id)
    return { ok: false, message: 'No se pudo registrar la mascota.' }
  }

  revalidatePath('/')
  return { ok: true, message: `${input.name} fue registrado correctamente.` }
}

export async function deletePet(formData: FormData) {
  const type = formData.get('type')
  const petId = Number(formData.get('petId'))
  const childId = Number(formData.get('childId'))
  if ((type !== 'dog' && type !== 'cat') || !petId || !childId) return

  const supabase = getSupabaseAdmin()
  const childTable = type === 'dog' ? 'tb_dog' : 'tb_cat'
  const { error } = await supabase
    .from(childTable)
    .delete()
    .eq('id', childId)
    .eq('id_pet', petId)
  if (error) throw new Error('No se pudo eliminar la mascota.')
  await supabase.from('tb_pet').delete().eq('id', petId)
  revalidatePath('/')
}

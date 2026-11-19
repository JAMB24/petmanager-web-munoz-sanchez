import 'server-only'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import type { HealthReportRow, Pet, PetType } from '@/lib/pet-types'

type PetRow = {
  id: number
  code: string
  name: string
  born_year: number
  color: string
  health_status: string
}

type ChildRow = {
  id: number
  breed: string
  pedigree?: boolean
  tb_pet: PetRow | PetRow[] | null
}

export async function listPets(type: PetType): Promise<Pet[]> {
  const supabase = getSupabaseAdmin()
  const table = type === 'dog' ? 'tb_dog' : 'tb_cat'
  const columns =
    type === 'dog'
      ? 'id, breed, pedigree, tb_pet!inner(id, code, name, born_year, color, health_status)'
      : 'id, breed, tb_pet!inner(id, code, name, born_year, color, health_status)'

  const { data, error } = await supabase.from(table).select(columns).order('id')
  if (error) throw new Error(error.message)

  return ((data ?? []) as unknown as ChildRow[])
    .map((row) => {
      const pet = Array.isArray(row.tb_pet) ? row.tb_pet[0] : row.tb_pet
      if (!pet) return null
      return {
        petId: pet.id,
        childId: row.id,
        type,
        code: pet.code,
        name: pet.name,
        bornYear: pet.born_year,
        color: pet.color,
        healthStatus: pet.health_status,
        breed: row.breed,
        pedigree: Boolean(row.pedigree),
      } satisfies Pet
    })
    .filter((p): p is Pet => p !== null)
    .sort((a, b) => a.code.localeCompare(b.code))
}

export function buildHealthReport(pets: Pet[]): HealthReportRow[] {
  const counts = new Map<string, number>()
  for (const pet of pets) {
    counts.set(pet.healthStatus, (counts.get(pet.healthStatus) ?? 0) + 1)
  }
  return [...counts.entries()].map(([healthStatus, amount]) => ({ healthStatus, amount }))
}

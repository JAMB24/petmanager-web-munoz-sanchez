export const HEALTH_STATUSES = ['Healthy', 'Sick', 'In Surgery'] as const
export type HealthStatus = (typeof HEALTH_STATUSES)[number]

export const HEALTH_LABELS: Record<string, string> = {
  Healthy: 'Sano',
  Sick: 'Enfermo',
  'In Surgery': 'En cirugía',
}

export type PetType = 'dog' | 'cat'

export type Pet = {
  petId: number
  childId: number
  type: PetType
  code: string
  name: string
  bornYear: number
  color: string
  healthStatus: string
  breed: string
  pedigree: boolean
}

export type HealthReportRow = { healthStatus: string; amount: number }

export type ActionState = { ok: boolean; message: string } | null

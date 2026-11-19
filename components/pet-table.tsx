'use client'

import { useTransition } from 'react'
import { Pencil, Search, Trash2 } from 'lucide-react'
import { deletePet } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { HEALTH_LABELS, type Pet, type PetType } from '@/lib/pet-types'
import { cn } from '@/lib/utils'

const BADGE: Record<string, string> = {
  Healthy: 'bg-teal-50 text-teal-800 ring-teal-600/20',
  Sick: 'bg-amber-50 text-amber-800 ring-amber-600/20',
  'In Surgery': 'bg-rose-50 text-rose-800 ring-rose-600/20',
}

export function PetTable({
  type,
  pets,
  query,
  onQueryChange,
  editingId,
  onEdit,
}: {
  type: PetType
  pets: Pet[]
  query: string
  onQueryChange: (q: string) => void
  editingId: number | null
  onEdit: (pet: Pet) => void
}) {
  const [pending, startTransition] = useTransition()

  function handleDelete(pet: Pet) {
    if (!window.confirm(`¿Eliminar a ${pet.name} (${pet.code})?`)) return
    const fd = new FormData()
    fd.set('type', pet.type)
    fd.set('petId', String(pet.petId))
    fd.set('childId', String(pet.childId))
    startTransition(() => deletePet(fd))
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-background p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-semibold">{type === 'dog' ? 'Listado de perros' : 'Listado de gatos'}</h2>
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <label htmlFor="search" className="sr-only">
            Buscar por código o nombre
          </label>
          <input
            id="search"
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Buscar por código o nombre"
            className="h-9 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none focus-visible:border-teal-600 focus-visible:ring-2 focus-visible:ring-teal-600/20"
          />
        </div>
      </div>

      <div className={cn('overflow-x-auto', pending && 'opacity-60')}>
        <table className="w-full text-left text-sm">
          <thead className="border-b text-muted-foreground">
            <tr>
              <th scope="col" className="px-2 py-2 font-medium">Código</th>
              <th scope="col" className="px-2 py-2 font-medium">Nombre</th>
              <th scope="col" className="px-2 py-2 font-medium">Año</th>
              <th scope="col" className="px-2 py-2 font-medium">Color</th>
              <th scope="col" className="px-2 py-2 font-medium">Raza</th>
              {type === 'dog' && <th scope="col" className="px-2 py-2 font-medium">Pedigrí</th>}
              <th scope="col" className="px-2 py-2 font-medium">Salud</th>
              <th scope="col" className="px-2 py-2 text-right font-medium">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {pets.length === 0 && (
              <tr>
                <td colSpan={8} className="px-2 py-8 text-center text-muted-foreground">
                  {query ? 'No hay resultados para tu búsqueda.' : 'Aún no hay mascotas registradas.'}
                </td>
              </tr>
            )}
            {pets.map((pet) => (
              <tr
                key={pet.petId}
                className={cn('border-b last:border-0', editingId === pet.petId && 'bg-teal-50/60')}
              >
                <td className="px-2 py-2.5 font-mono text-xs">{pet.code}</td>
                <td className="px-2 py-2.5 font-medium">{pet.name}</td>
                <td className="px-2 py-2.5 tabular-nums">{pet.bornYear}</td>
                <td className="px-2 py-2.5">{pet.color || '—'}</td>
                <td className="px-2 py-2.5">{pet.breed || '—'}</td>
                {type === 'dog' && <td className="px-2 py-2.5">{pet.pedigree ? 'Sí' : 'No'}</td>}
                <td className="px-2 py-2.5">
                  <span
                    className={cn(
                      'inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
                      BADGE[pet.healthStatus] ?? 'bg-muted',
                    )}
                  >
                    {HEALTH_LABELS[pet.healthStatus] ?? pet.healthStatus}
                  </span>
                </td>
                <td className="px-2 py-2.5">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon-sm" onClick={() => onEdit(pet)} aria-label={`Editar ${pet.name}`}>
                      <Pencil aria-hidden="true" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDelete(pet)}
                      disabled={pending}
                      aria-label={`Eliminar ${pet.name}`}
                      className="text-rose-600 hover:text-rose-700"
                    >
                      <Trash2 aria-hidden="true" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

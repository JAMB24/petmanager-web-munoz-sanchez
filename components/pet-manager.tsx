'use client'

import { useState } from 'react'
import { Cat, Dog } from 'lucide-react'
import type { Pet, PetType } from '@/lib/pet-types'
import { PetForm } from '@/components/pet-form'
import { PetTable } from '@/components/pet-table'
import { cn } from '@/lib/utils'

export function PetManager({ dogs, cats }: { dogs: Pet[]; cats: Pet[] }) {
  const [type, setType] = useState<PetType>('dog')
  const [editing, setEditing] = useState<Pet | null>(null)
  const [query, setQuery] = useState('')

  const pets = type === 'dog' ? dogs : cats
  const q = query.trim().toLowerCase()
  const filtered = q
    ? pets.filter((p) => p.code.toLowerCase().includes(q) || p.name.toLowerCase().includes(q))
    : pets

  function switchType(next: PetType) {
    setType(next)
    setEditing(null)
    setQuery('')
  }

  const tabs = [
    { value: 'dog' as const, label: 'Perros', Icon: Dog },
    { value: 'cat' as const, label: 'Gatos', Icon: Cat },
  ]

  return (
    <section aria-label="Gestión de mascotas" className="flex flex-col gap-4">
      <div role="tablist" aria-label="Tipo de mascota" className="flex w-fit gap-1 rounded-lg border bg-background p-1">
        {tabs.map(({ value, label, Icon }) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={type === value}
            onClick={() => switchType(value)}
            className={cn(
              'flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
              type === value ? 'bg-teal-600 text-white' : 'text-muted-foreground hover:bg-muted',
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <PetForm
          key={`${type}-${editing?.petId ?? 'new'}`}
          type={type}
          pet={editing}
          onDone={() => setEditing(null)}
        />
        <PetTable
          type={type}
          pets={filtered}
          query={query}
          onQueryChange={setQuery}
          editingId={editing?.petId ?? null}
          onEdit={setEditing}
        />
      </div>
    </section>
  )
}

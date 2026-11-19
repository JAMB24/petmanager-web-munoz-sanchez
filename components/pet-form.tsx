'use client'

import { useActionState, useEffect, useRef } from 'react'
import { savePet } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { HEALTH_LABELS, HEALTH_STATUSES, type ActionState, type Pet, type PetType } from '@/lib/pet-types'
import { cn } from '@/lib/utils'

const inputClass =
  'h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:border-teal-600 focus-visible:ring-2 focus-visible:ring-teal-600/20'

export function PetForm({
  type,
  pet,
  onDone,
}: {
  type: PetType
  pet: Pet | null
  onDone: () => void
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(savePet, null)
  const formRef = useRef<HTMLFormElement>(null)
  const isEdit = Boolean(pet)
  const noun = type === 'dog' ? 'perro' : 'gato'

  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset()
      if (isEdit) onDone()
    }
  }, [state, isEdit, onDone])

  return (
    <form
      ref={formRef}
      action={action}
      className="flex h-fit flex-col gap-4 rounded-xl border bg-background p-4"
      aria-labelledby="pet-form-title"
    >
      <h2 id="pet-form-title" className="font-semibold">
        {isEdit ? `Editar ${noun}: ${pet?.name}` : `Registrar ${noun}`}
      </h2>

      <input type="hidden" name="type" value={type} />
      {pet && (
        <>
          <input type="hidden" name="petId" value={pet.petId} />
          <input type="hidden" name="childId" value={pet.childId} />
        </>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Field label="Código" htmlFor="code">
          <input id="code" name="code" required maxLength={20} defaultValue={pet?.code} className={inputClass} />
        </Field>
        <Field label="Año de nacimiento" htmlFor="bornYear">
          <input
            id="bornYear"
            name="bornYear"
            type="number"
            required
            min={1980}
            max={new Date().getFullYear()}
            defaultValue={pet?.bornYear ?? new Date().getFullYear()}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Nombre" htmlFor="name">
        <input id="name" name="name" required maxLength={60} defaultValue={pet?.name} className={inputClass} />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Color" htmlFor="color">
          <input id="color" name="color" maxLength={40} defaultValue={pet?.color} className={inputClass} />
        </Field>
        <Field label="Raza" htmlFor="breed">
          <input id="breed" name="breed" maxLength={60} defaultValue={pet?.breed} className={inputClass} />
        </Field>
      </div>

      <Field label="Estado de salud" htmlFor="healthStatus">
        <select
          id="healthStatus"
          name="healthStatus"
          defaultValue={pet?.healthStatus ?? 'Healthy'}
          className={inputClass}
        >
          {HEALTH_STATUSES.map((s) => (
            <option key={s} value={s}>
              {HEALTH_LABELS[s]}
            </option>
          ))}
        </select>
      </Field>

      {type === 'dog' && (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="pedigree"
            defaultChecked={pet?.pedigree}
            className="size-4 accent-teal-600"
          />
          Tiene pedigrí
        </label>
      )}

      {state && (
        <p
          role="status"
          className={cn(
            'rounded-md px-3 py-2 text-sm',
            state.ok ? 'bg-teal-50 text-teal-800' : 'bg-rose-50 text-rose-800',
          )}
        >
          {state.message}
        </p>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending} className="flex-1 bg-teal-600 text-white hover:bg-teal-700">
          {pending ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Registrar'}
        </Button>
        {isEdit && (
          <Button type="button" variant="outline" onClick={onDone}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  )
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      {children}
    </div>
  )
}

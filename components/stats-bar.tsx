import { Cat, Dog, PawPrint } from 'lucide-react'

export function StatsBar({ total, dogs, cats }: { total: number; dogs: number; cats: number }) {
  const items = [
    { label: 'Mascotas registradas', value: total, Icon: PawPrint },
    { label: 'Perros', value: dogs, Icon: Dog },
    { label: 'Gatos', value: cats, Icon: Cat },
  ]
  return (
    <dl className="grid gap-4 sm:grid-cols-3">
      {items.map(({ label, value, Icon }) => (
        <div key={label} className="flex items-center gap-4 rounded-xl border bg-background p-4">
          <div className="flex size-10 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
            <Icon className="size-5" aria-hidden="true" />
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="text-2xl font-semibold tabular-nums">{value}</dd>
          </div>
        </div>
      ))}
    </dl>
  )
}

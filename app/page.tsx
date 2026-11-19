import { PawPrint } from 'lucide-react'
import { buildHealthReport, listPets } from '@/lib/pets'
import { PetManager } from '@/components/pet-manager'
import { HealthReport } from '@/components/health-report'
import { StatsBar } from '@/components/stats-bar'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const [dogs, cats] = await Promise.all([listPets('dog'), listPets('cat')])
  const all = [...dogs, ...cats]

  return (
    <div className="min-h-dvh bg-muted/40">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4">
          <div className="flex size-10 items-center justify-center rounded-lg bg-teal-600 text-white">
            <PawPrint className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-tight">Pet Manager</h1>
            <p className="text-sm text-muted-foreground">Gestión de pacientes veterinarios</p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6">
        <StatsBar total={all.length} dogs={dogs.length} cats={cats.length} />
        <PetManager dogs={dogs} cats={cats} />
        <section aria-labelledby="reports-title" className="flex flex-col gap-4">
          <h2 id="reports-title" className="text-base font-semibold">
            Reportes por estado de salud
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <HealthReport title="Todas las mascotas" rows={buildHealthReport(all)} />
            <HealthReport title="Perros" rows={buildHealthReport(dogs)} />
            <HealthReport title="Gatos" rows={buildHealthReport(cats)} />
          </div>
        </section>
      </main>
    </div>
  )
}

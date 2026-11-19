import { HEALTH_LABELS, HEALTH_STATUSES, type HealthReportRow } from '@/lib/pet-types'
import { cn } from '@/lib/utils'

export const HEALTH_COLORS: Record<string, string> = {
  Healthy: 'bg-teal-600',
  Sick: 'bg-amber-500',
  'In Surgery': 'bg-rose-600',
}

export function HealthReport({ title, rows }: { title: string; rows: HealthReportRow[] }) {
  const total = rows.reduce((sum, r) => sum + r.amount, 0)
  const ordered = HEALTH_STATUSES.map(
    (status) => rows.find((r) => r.healthStatus === status) ?? { healthStatus: status, amount: 0 },
  )

  return (
    <article className="flex flex-col gap-4 rounded-xl border bg-background p-4">
      <header className="flex items-baseline justify-between">
        <h3 className="font-medium">{title}</h3>
        <span className="text-sm text-muted-foreground">{total} en total</span>
      </header>
      <ul className="flex flex-col gap-3">
        {ordered.map((row) => {
          const pct = total ? Math.round((row.amount / total) * 100) : 0
          return (
            <li key={row.healthStatus} className="flex flex-col gap-1.5">
              <div className="flex justify-between text-sm">
                <span>{HEALTH_LABELS[row.healthStatus] ?? row.healthStatus}</span>
                <span className="tabular-nums text-muted-foreground">
                  {row.amount} ({pct}%)
                </span>
              </div>
              <div
                className="h-2 overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${HEALTH_LABELS[row.healthStatus]}: ${pct}%`}
              >
                <div
                  className={cn('h-full rounded-full', HEALTH_COLORS[row.healthStatus] ?? 'bg-foreground')}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </article>
  )
}

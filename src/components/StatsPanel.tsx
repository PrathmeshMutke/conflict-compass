import { ConflictEvent, EventType, EVENT_COLORS, EVENT_LABELS } from '@/data/mockEvents';
import { motion } from 'framer-motion';

interface StatsPanelProps {
  events: ConflictEvent[];
}

export default function StatsPanel({ events }: StatsPanelProps) {
  const typeCounts = events.reduce<Record<EventType, number>>(
    (acc, e) => ({ ...acc, [e.type]: (acc[e.type] || 0) + 1 }),
    { missile: 0, drone: 0, airstrike: 0, interception: 0 }
  );

  const uniqueRegions = new Set(events.map((e) => e.location)).size;
  const avgConfidence = events.length
    ? Math.round(events.reduce((s, e) => s + e.confidence, 0) / events.length)
    : 0;

  const stats = [
    { label: 'Total Events', value: events.length, color: 'hsl(var(--primary))' },
    { label: 'Regions', value: uniqueRegions, color: 'hsl(var(--info))' },
    { label: 'Avg Confidence', value: `${avgConfidence}%`, color: 'hsl(var(--warning))' },
  ];

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="status-dot bg-primary" />
        Situation Overview
      </div>
      <div className="p-3 space-y-4">
        {/* Top stats */}
        <div className="grid grid-cols-3 gap-2">
          {stats.map((s) => (
            <div key={s.label} className="bg-secondary/50 rounded p-2 text-center">
              <div className="font-mono text-lg font-bold" style={{ color: s.color }}>
                {s.value}
              </div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Event type breakdown */}
        <div className="space-y-2">
          {(Object.keys(typeCounts) as EventType[]).map((type) => {
            const count = typeCounts[type];
            const pct = events.length ? (count / events.length) * 100 : 0;
            return (
              <div key={type} className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono uppercase tracking-wider">
                  <span style={{ color: EVENT_COLORS[type] }}>{EVENT_LABELS[type]}</span>
                  <span className="text-muted-foreground">{count}</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: EVENT_COLORS[type] }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

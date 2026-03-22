import { EventType, EVENT_COLORS, EVENT_LABELS } from '@/data/mockEvents';

interface FilterBarProps {
  activeFilters: EventType[];
  onToggleFilter: (type: EventType) => void;
}

const allTypes: EventType[] = ['missile', 'drone', 'airstrike', 'interception', 'flight', 'vessel'];

export default function FilterBar({ activeFilters, onToggleFilter }: FilterBarProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {allTypes.map((type) => {
        const active = activeFilters.includes(type);
        return (
          <button
            key={type}
            onClick={() => onToggleFilter(type)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded font-mono text-[11px] uppercase tracking-wider
              border transition-all duration-200
              ${active
                ? 'border-current bg-secondary'
                : 'border-border text-muted-foreground opacity-40 hover:opacity-70'
              }
            `}
            style={active ? { color: EVENT_COLORS[type] } : undefined}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: EVENT_COLORS[type], opacity: active ? 1 : 0.4 }}
            />
            {EVENT_LABELS[type]}
          </button>
        );
      })}
    </div>
  );
}

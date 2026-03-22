import { ConflictEvent, EVENT_COLORS, EVENT_LABELS } from '@/data/mockEvents';
import { motion, AnimatePresence } from 'framer-motion';

interface EventFeedProps {
  events: ConflictEvent[];
  selectedEvent: ConflictEvent | null;
  onSelectEvent: (event: ConflictEvent) => void;
}

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function EventFeed({ events, selectedEvent, onSelectEvent }: EventFeedProps) {
  return (
    <div className="panel flex flex-col h-full">
      <div className="panel-header">
        <span className="status-dot bg-primary" />
        Live Intel Feed
        <span className="ml-auto text-muted-foreground normal-case tracking-normal">
          {events.length} events
        </span>
      </div>
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={i === 0 ? { opacity: 0, x: -20 } : false}
              animate={{ opacity: 1, x: 0 }}
              className={`px-3 py-2.5 border-b border-border cursor-pointer transition-colors hover:bg-secondary/50 ${
                selectedEvent?.id === event.id ? 'bg-secondary' : ''
              }`}
              onClick={() => onSelectEvent(event)}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: EVENT_COLORS[event.type] }}
                />
                <span
                  className="font-mono text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: EVENT_COLORS[event.type] }}
                >
                  {EVENT_LABELS[event.type]}
                </span>
                <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                  {timeAgo(event.timestamp)}
                </span>
              </div>
              <p className="text-xs text-foreground/80 leading-relaxed line-clamp-2">
                {event.description}
              </p>
              <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground font-mono">
                <span>📍 {event.location}</span>
                <span>📡 {event.source}</span>
                <span
                  className={
                    event.confidence >= 80
                      ? 'text-safe'
                      : event.confidence >= 60
                      ? 'text-warning'
                      : 'text-threat'
                  }
                >
                  {event.confidence}%
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

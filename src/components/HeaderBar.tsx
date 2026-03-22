import { useEffect, useState } from 'react';

export default function HeaderBar() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-12 border-b border-border bg-card flex items-center px-4 gap-4">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <h1 className="font-mono text-sm font-bold tracking-widest uppercase text-primary">
          OSINT Command
        </h1>
      </div>
      <div className="h-4 w-px bg-border" />
      <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
        Geopolitical Conflict Monitor
      </span>
      <div className="ml-auto flex items-center gap-4">
        <span className="font-mono text-[10px] text-safe flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-safe animate-pulse" />
          SYSTEM ONLINE
        </span>
        <span className="font-mono text-xs text-foreground/70">
          {time.toLocaleTimeString('en-US', { hour12: false })}
          <span className="animate-blink">:</span>
          {String(time.getMilliseconds()).padStart(3, '0').slice(0, 2)}
        </span>
        <span className="font-mono text-[10px] text-muted-foreground">
          UTC{time.getTimezoneOffset() <= 0 ? '+' : '-'}
          {Math.abs(Math.floor(time.getTimezoneOffset() / 60))}
        </span>
      </div>
    </header>
  );
}

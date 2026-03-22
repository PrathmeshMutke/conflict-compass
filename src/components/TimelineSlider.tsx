interface TimelineSliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
}

export default function TimelineSlider({ value, onChange, min, max }: TimelineSliderProps) {
  const pct = max > min ? ((value - min) / (max - min)) * 100 : 0;

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="status-dot bg-warning" />
        Timeline
        <span className="ml-auto text-muted-foreground normal-case tracking-normal font-mono text-[10px]">
          {new Date(value).toLocaleString()}
        </span>
      </div>
      <div className="px-4 py-3">
        <div className="relative">
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-1 appearance-none bg-secondary rounded-full cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-primary
              [&::-webkit-slider-thumb]:shadow-[0_0_8px_hsl(142_70%_45%/0.5)]
              [&::-webkit-slider-thumb]:cursor-pointer"
            style={{
              background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${pct}%, hsl(var(--secondary)) ${pct}%, hsl(var(--secondary)) 100%)`,
            }}
          />
        </div>
        <div className="flex justify-between mt-1 text-[9px] font-mono text-muted-foreground">
          <span>{new Date(min).toLocaleDateString()}</span>
          <span>NOW</span>
        </div>
      </div>
    </div>
  );
}

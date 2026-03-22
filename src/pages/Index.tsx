import { useState, useMemo, useEffect } from 'react';
import { mockEvents, ConflictEvent, EventType } from '@/data/mockEvents';
import ConflictMap from '@/components/ConflictMap';
import EventFeed from '@/components/EventFeed';
import FilterBar from '@/components/FilterBar';
import StatsPanel from '@/components/StatsPanel';
import TimelineSlider from '@/components/TimelineSlider';
import HeaderBar from '@/components/HeaderBar';

const allTypes: EventType[] = ['missile', 'drone', 'airstrike', 'interception', 'flight', 'vessel'];

export default function Index() {
  const [activeFilters, setActiveFilters] = useState<EventType[]>([...allTypes]);
  const [selectedEvent, setSelectedEvent] = useState<ConflictEvent | null>(null);
  const [events, setEvents] = useState(mockEvents);
  const [searchQuery, setSearchQuery] = useState('');

  const timestamps = events.map((e) => new Date(e.timestamp).getTime());
  const minTime = Math.min(...timestamps);
  const maxTime = Math.max(...timestamps);
  const [timelineValue, setTimelineValue] = useState(maxTime);

  const filteredEvents = useMemo(
    () =>
      events.filter(
        (e) =>
          activeFilters.includes(e.type) &&
          new Date(e.timestamp).getTime() <= timelineValue &&
          (searchQuery === '' || 
           e.location.toLowerCase().includes(searchQuery.toLowerCase()) || 
           e.id.toLowerCase().includes(searchQuery.toLowerCase()))
      ),
    [events, activeFilters, timelineValue, searchQuery]
  );

  const toggleFilter = (type: EventType) => {
    setActiveFilters((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // Simulate incoming events
  useEffect(() => {
    const interval = setInterval(() => {
      const types: EventType[] = ['missile', 'drone', 'airstrike', 'interception', 'vessel']; // Exclude flight from mock since we have live
      const locs = [
        { name: 'Gaza City', lat: 31.5, lng: 34.47 },
        { name: 'Beirut', lat: 33.89, lng: 35.5 },
        { name: 'Damascus', lat: 33.51, lng: 36.29 },
        { name: 'Sana\'a', lat: 15.37, lng: 44.19 },
      ];
      const loc = locs[Math.floor(Math.random() * locs.length)];
      const type = types[Math.floor(Math.random() * types.length)];

      const newEvent: ConflictEvent = {
        id: `EVT-${String(Date.now()).slice(-4)}`,
        type,
        timestamp: new Date().toISOString(),
        lat: loc.lat + (Math.random() - 0.5) * 0.3,
        lng: loc.lng + (Math.random() - 0.5) * 0.3,
        location: loc.name,
        source: 'OSINT Telegram',
        confidence: Math.floor(Math.random() * 30) + 70,
        description: `New ${type} activity detected near ${loc.name}`,
      };

      setEvents((prev) => {
        // limit total events to prevent memory issues
        const updated = [newEvent, ...prev];
        return updated.length > 200 ? updated.slice(0, 200) : updated;
      });
      setTimelineValue(Date.now());
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Fetch Live Flights from OpenSky API
  useEffect(() => {
    const fetchFlights = async () => {
      try {
        // Bounding box mapping roughly the Middle East area
        const res = await fetch('https://opensky-network.org/api/states/all?lamin=28&lomin=32&lamax=36&lomax=40');
        if (!res.ok) return;
        const data = await res.json();
        
        if (data && data.states) {
          const liveFlights: ConflictEvent[] = data.states
            .filter((s: any) => s[5] !== null && s[6] !== null) // Ensure lat/lng exist
            .map((s: any) => ({
              id: `FLT-${s[1]?.trim() || s[0]}`,
              type: 'flight' as EventType,
              timestamp: new Date().toISOString(),
              lat: s[6],
              lng: s[5],
              location: 'Live Airspace',
              source: 'OpenSky Network API',
              confidence: 99,
              description: `Live tracking. Aircraft: ${s[1]?.trim() || 'Unknown'} | Origin: ${s[2]} | Altitude: ${Math.round(s[13] || 0)}m`,
            }));
          
          setEvents(prev => {
            const nonLiveFlights = prev.filter(e => e.source !== 'OpenSky Network API');
            return [...liveFlights.slice(0, 100), ...nonLiveFlights];
          });
          setTimelineValue(Date.now());
        }
      } catch (e) {
        console.error('Failed to fetch OpenSky data:', e);
      }
    };
    
    fetchFlights();
    // Fetch every 30 seconds to respect rate limits
    const openskyInterval = setInterval(fetchFlights, 30000);
    return () => clearInterval(openskyInterval);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-background grid-overlay">
      <HeaderBar />
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Feed */}
        <div className="w-80 border-r border-border flex flex-col">
          <EventFeed
            events={filteredEvents}
            selectedEvent={selectedEvent}
            onSelectEvent={setSelectedEvent}
          />
        </div>

        {/* Center: Map + Controls */}
        <div className="flex-1 flex flex-col">
          <div className="px-4 py-2 border-b border-border flex items-center justify-between gap-4">
            <FilterBar activeFilters={activeFilters} onToggleFilter={toggleFilter} />
            <input 
              type="text" 
              placeholder="Search INTEL (Location, ID)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-card border border-border rounded-md px-3 py-1.5 text-xs font-mono w-64 text-foreground focus:outline-none focus:border-primary shadow-sm transition-colors placeholder:text-muted-foreground/50"
            />
          </div>
          <div className="flex-1 relative">
            <ConflictMap
              events={filteredEvents}
              selectedEvent={selectedEvent}
              onSelectEvent={setSelectedEvent}
            />
            <div className="absolute inset-0 pointer-events-none scanline" />
          </div>
          <div className="border-t border-border">
            <TimelineSlider
              value={timelineValue}
              onChange={setTimelineValue}
              min={minTime}
              max={Date.now()}
            />
          </div>
        </div>

        {/* Right: Stats */}
        <div className="w-72 border-l border-border overflow-y-auto">
          <StatsPanel events={filteredEvents} />
        </div>
      </div>
    </div>
  );
}

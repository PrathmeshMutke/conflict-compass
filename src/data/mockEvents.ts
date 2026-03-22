export type EventType = 'missile' | 'drone' | 'airstrike' | 'interception' | 'flight' | 'vessel';

export interface ConflictEvent {
  id: string;
  type: EventType;
  timestamp: string;
  lat: number;
  lng: number;
  location: string;
  source: string;
  confidence: number; // 0-100
  description: string;
  trajectory?: { fromLat: number; fromLng: number };
}

const locations = [
  { name: 'Gaza City', lat: 31.5, lng: 34.47 },
  { name: 'Khan Yunis', lat: 31.34, lng: 34.3 },
  { name: 'Rafah', lat: 31.28, lng: 34.25 },
  { name: 'Beirut', lat: 33.89, lng: 35.5 },
  { name: 'Damascus', lat: 33.51, lng: 36.29 },
  { name: 'Sana\'a', lat: 15.37, lng: 44.19 },
  { name: 'Baghdad', lat: 33.31, lng: 44.37 },
  { name: 'Aleppo', lat: 36.2, lng: 37.15 },
  { name: 'Hodeida', lat: 14.8, lng: 42.95 },
  { name: 'Aden', lat: 12.8, lng: 45.03 },
  { name: 'Tripoli (Libya)', lat: 32.9, lng: 13.18 },
  { name: 'Benghazi', lat: 32.12, lng: 20.07 },
  { name: 'Idlib', lat: 35.93, lng: 36.63 },
  { name: 'Mosul', lat: 36.34, lng: 43.12 },
  { name: 'Tel Aviv', lat: 32.08, lng: 34.78 },
];

const sources = [
  'OSINT Telegram', 'Reuters', 'Al Jazeera', 'BBC Arabic',
  'Satellite FIRMS', 'Local Report', 'AP News', 'Sentinel Hub',
  'Military Analyst', 'Social Media GEOINT'
];

const types: EventType[] = ['missile', 'drone', 'airstrike', 'interception', 'flight', 'vessel'];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateEvent(id: number, hoursAgo: number): ConflictEvent {
  const loc = randomFrom(locations);
  const type = randomFrom(types);
  const date = new Date();
  date.setHours(date.getHours() - hoursAgo);
  date.setMinutes(Math.floor(Math.random() * 60));

  const event: ConflictEvent = {
    id: `EVT-${String(id).padStart(4, '0')}`,
    type,
    timestamp: date.toISOString(),
    lat: loc.lat + (Math.random() - 0.5) * 0.2,
    lng: loc.lng + (Math.random() - 0.5) * 0.2,
    location: loc.name,
    source: randomFrom(sources),
    confidence: Math.floor(Math.random() * 40) + 60,
    description: getDescription(type, loc.name),
  };

  if (type === 'missile' || type === 'drone' || type === 'flight' || type === 'vessel') {
    const origin = randomFrom(locations.filter(l => l.name !== loc.name));
    event.trajectory = { fromLat: origin.lat, fromLng: origin.lng };
  }

  return event;
}

function getDescription(type: EventType, location: string): string {
  const descs: Record<EventType, string[]> = {
    missile: [
      `Ballistic missile launch detected targeting ${location}`,
      `Multiple rocket impacts reported near ${location}`,
      `Short-range missile strike confirmed in ${location} area`,
    ],
    drone: [
      `UAV strike reported in ${location} district`,
      `Reconnaissance drone activity detected over ${location}`,
      `Armed drone engagement near ${location}`,
    ],
    airstrike: [
      `Aerial bombardment reported in ${location}`,
      `Fighter jet sortie over ${location} confirmed`,
      `Precision airstrike targeting infrastructure in ${location}`,
    ],
    interception: [
      `Incoming projectile intercepted over ${location}`,
      `Air defense system activated near ${location}`,
      `Successful interception reported above ${location}`,
    ],
    flight: [
      `Civilian aircraft transiting near ${location}`,
      `Commercial passenger jet detected over ${location}`,
      `Flight route deviation observed near ${location}`,
    ],
    vessel: [
      `Commercial cargo ship navigating near ${location}`,
      `Tanker vessel anchoring off the coast of ${location}`,
      `Maritime traffic detected in ${location} waters`,
    ],
  };
  return randomFrom(descs[type]);
}

// Generate 50 mock events spread over 48 hours
export const mockEvents: ConflictEvent[] = Array.from({ length: 50 }, (_, i) =>
  generateEvent(i + 1, Math.random() * 48)
).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

export const EVENT_COLORS: Record<EventType, string> = {
  missile: '#ef4444',
  drone: '#f59e0b',
  airstrike: '#a855f7',
  interception: '#22c55e',
  flight: '#3b82f6',
  vessel: '#0ea5e9',
};

export const EVENT_LABELS: Record<EventType, string> = {
  missile: 'Missile',
  drone: 'Drone/UAV',
  airstrike: 'Airstrike',
  interception: 'Interception',
  flight: 'FlightRadar',
  vessel: 'MarineTraffic',
};

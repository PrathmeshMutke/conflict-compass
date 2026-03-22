import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap, LayersControl, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ConflictEvent, EVENT_COLORS, EventType } from '@/data/mockEvents';

interface ConflictMapProps {
  events: ConflictEvent[];
  selectedEvent: ConflictEvent | null;
  onSelectEvent: (event: ConflictEvent) => void;
}

const EVENT_ICONS: Record<EventType, string> = {
  missile: '🚀',
  drone: '🛸',
  airstrike: '✈️',
  interception: '🛡️',
  flight: '🛩️',
  vessel: '🚢',
};

function createEventIcon(type: EventType, isSelected: boolean) {
  const size = isSelected ? 36 : 26;
  const color = EVENT_COLORS[type];
  return L.divIcon({
    className: 'custom-event-icon',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${isSelected ? 22 : 16}px;
        background: ${color}22;
        border: 2px solid ${color};
        border-radius: 50%;
        box-shadow: 0 0 ${isSelected ? 20 : 10}px ${color}88, 0 0 ${isSelected ? 40 : 20}px ${color}44;
        animation: ${isSelected ? 'marker-pulse 1.5s ease-out infinite' : 'marker-subtle-pulse 3s ease-out infinite'};
        position: relative;
        z-index: ${isSelected ? 1000 : 1};
      ">
        ${EVENT_ICONS[type]}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function FlyToEvent({ event }: { event: ConflictEvent | null }) {
  const map = useMap();
  useEffect(() => {
    if (event) {
      map.flyTo([event.lat, event.lng], 11, { duration: 1.5 });
    }
  }, [event, map]);
  return null;
}

export default function ConflictMap({ events, selectedEvent, onSelectEvent }: ConflictMapProps) {
  return (
    <MapContainer
      center={[30, 40]}
      zoom={5}
      className="w-full h-full rounded-md"
      zoomControl={true}
      attributionControl={false}
    >
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Tactical (Dark)">
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            maxZoom={20}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Satellite">
          <TileLayer
            url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
            maxZoom={20}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Terrain">
          <TileLayer
            url="https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}"
            maxZoom={20}
          />
        </LayersControl.BaseLayer>
      </LayersControl>

      <FlyToEvent event={selectedEvent} />

      {selectedEvent && (
        <Circle
          center={[selectedEvent.lat, selectedEvent.lng]}
          radius={
            selectedEvent.type === 'missile' ? 50000 :
            selectedEvent.type === 'interception' ? 40000 :
            selectedEvent.type === 'airstrike' ? 30000 :
            selectedEvent.type === 'drone' ? 15000 :
            10000 // Flight/Vessel
          }
          pathOptions={{
            color: EVENT_COLORS[selectedEvent.type],
            fillColor: EVENT_COLORS[selectedEvent.type],
            fillOpacity: 0.1,
            weight: 2,
            dashArray: '5 15'
          }}
        />
      )}

      {events.map((event) => (
        <Marker
          key={event.id}
          position={[event.lat, event.lng]}
          icon={createEventIcon(event.type, selectedEvent?.id === event.id)}
          eventHandlers={{
            click: () => onSelectEvent(event),
          }}
        >
          <Popup className="osint-popup">
            <div className="text-xs space-y-1" style={{ color: '#c8d6c5', minWidth: 220 }}>
              <div className="font-bold text-sm flex items-center gap-2" style={{ color: EVENT_COLORS[event.type] }}>
                <span style={{ fontSize: 18 }}>{EVENT_ICONS[event.type]}</span>
                {event.type.toUpperCase()} — {event.id}
              </div>
              <div>{event.description}</div>
              <div className="opacity-70">📍 {event.location}</div>
              <div className="opacity-70">🕐 {new Date(event.timestamp).toLocaleString()}</div>
              <div className="opacity-70">📡 {event.source}</div>
              <div className="opacity-70">
                Confidence: {event.confidence}%
              </div>
            </div>
          </Popup>
        </Marker>
      ))}

      {events
        .filter((e) => e.trajectory)
        .map((event) => (
          <Polyline
            key={`traj-${event.id}`}
            positions={[
              [event.trajectory!.fromLat, event.trajectory!.fromLng],
              [event.lat, event.lng],
            ]}
            pathOptions={{
              color: EVENT_COLORS[event.type],
              weight: 2,
              opacity: 0.5,
              dashArray: '8 6',
            }}
          />
        ))}
    </MapContainer>
  );
}

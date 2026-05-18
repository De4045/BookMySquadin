import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const iconUrl = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png";
const iconRetinaUrl = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png";
const shadowUrl = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png";

const CITY_COORDS: Record<string, [number, number]> = {
  "Agra":       [27.18, 78.01],  "Alwar":      [27.56, 76.61],
  "Bangalore":  [12.97, 77.59],  "Bareilly":   [28.35, 79.43],
  "Bikaner":    [28.01, 73.31],  "Chennai":    [13.08, 80.27],
  "Dehradun":   [30.32, 78.03],  "Delhi":      [28.61, 77.21],
  "Faridabad":  [28.41, 77.32],  "Ghaziabad":  [28.67, 77.43],
  "Goa":        [15.30, 74.12],  "Gurgaon":    [28.46, 77.03],
  "Hyderabad":  [17.38, 78.47],  "Jaipur":     [26.91, 75.79],
  "Jaisalmer":  [26.91, 70.91],  "Jhansi":     [25.45, 78.57],
  "Jodhpur":    [26.29, 73.01],  "Kanpur":     [26.46, 80.33],
  "Leh":        [34.17, 77.58],  "Lucknow":    [26.85, 80.95],
  "Manali":     [32.24, 77.19],  "Meerut":     [28.98, 77.71],
  "Mumbai":     [19.07, 72.87],  "Noida":      [28.54, 77.39],
  "Prayagraj":  [25.43, 81.84],  "Ramnagar":   [29.39, 79.13],
  "Rishikesh":  [30.09, 78.27],  "Shimla":     [31.10, 77.17],
  "Udaipur":    [24.58, 73.68],  "Varanasi":   [25.32, 83.01],
};

const goldIcon = new L.Icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [20, 32],
  iconAnchor: [10, 32],
  popupAnchor: [1, -28],
  shadowSize: [32, 32],
});

export interface MapVenue {
  property_name: string;
  city_sheet: string;
  type: string;
  max_banquet_capacity?: number | string;
}

interface Props {
  venues: MapVenue[];
  onVenueClick?: (name: string) => void;
}

export function VenueMap({ venues, onVenueClick }: Props) {
  useEffect(() => {
    delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)["_getIconUrl"];
    L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });
  }, []);

  const byCityMap: Record<string, MapVenue[]> = {};
  venues.forEach(v => {
    const city = v.city_sheet || "Unknown";
    if (!byCityMap[city]) byCityMap[city] = [];
    byCityMap[city].push(v);
  });

  const markers = Object.entries(byCityMap)
    .map(([city, cityVenues]) => ({ city, venues: cityVenues, coords: CITY_COORDS[city] }))
    .filter(m => m.coords);

  return (
    <div className="w-full h-[580px] relative border border-white/10 overflow-hidden">
      <MapContainer
        center={[22.5, 78.9] as [number, number]}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map(({ city, venues: cityVenues, coords }) => (
          <Marker key={city} position={coords as [number, number]} icon={goldIcon as L.Icon}>
            <Popup>
              <div style={{ background: "#0d0a07", minWidth: 180, padding: "10px 14px", margin: "-13px -20px" }}>
                <p style={{ color: "#d4af37", fontFamily: "Cinzel, serif", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 6 }}>
                  {city}
                </p>
                <p style={{ color: "#aaa", fontFamily: "Manrope, sans-serif", fontSize: 11, marginBottom: 6 }}>
                  {cityVenues.length} venue{cityVenues.length !== 1 ? "s" : ""} available
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 3, maxHeight: 110, overflowY: "auto" }}>
                  {cityVenues.slice(0, 5).map(v => (
                    <button
                      key={v.property_name}
                      onClick={() => onVenueClick?.(v.property_name)}
                      style={{ color: "#d4af3790", fontFamily: "Manrope, sans-serif", fontSize: 11, textAlign: "left", background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 1.4 }}
                    >
                      {v.property_name}
                    </button>
                  ))}
                  {cityVenues.length > 5 && (
                    <span style={{ color: "#ffffff30", fontFamily: "Manrope, sans-serif", fontSize: 10 }}>
                      +{cityVenues.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

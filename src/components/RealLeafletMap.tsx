import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Navigation, Compass, MapPin, Phone, ShieldCheck, Layers, Bike, Clock, CheckCircle2 } from 'lucide-react';

interface RealLeafletMapProps {
  orderStatus: string;
  orderId?: string;
  customerCity?: string;
  riderName?: string;
  riderPhone?: string;
  vehicleNumber?: string;
  deliveryOtp?: string;
}

// Coordinates along Express Highway (Waypoints to Destination)
const ROUTE_WAYPOINTS: [number, number][] = [
  [16.7050, 74.2433], // MS Masale Central Facility
  [16.8524, 74.2810], // Vathar
  [17.0862, 74.2703], // Peth Naka
  [17.2777, 74.2334], // Karad
  [17.4812, 74.1523], // Umbraj
  [17.6805, 74.0183], // Satara
  [17.8920, 73.9870], // Bhuinj
  [18.1500, 73.9800], // Shirwal
  [18.3040, 73.8740], // Shindewadi
  [18.4480, 73.8640], // Katraj Pune
  [18.5204, 73.8567]  // Pune Customer Destination
];

export const RealLeafletMap: React.FC<RealLeafletMapProps> = ({
  orderStatus,
  orderId = 'MS-89421',
  customerCity = 'Pune',
  riderName = 'विक्रम मोहिते (Vikram Mohite)',
  riderPhone = '+91 98901 12345',
  vehicleNumber = 'MH 09 DX 7712',
  deliveryOtp
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const riderMarkerRef = useRef<L.Marker | null>(null);
  const [mapType, setMapType] = useState<'streets' | 'satellite'>('streets');
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Progress index along waypoints: 0 = Origin Hub, last = Destination
  const [progressIndex, setProgressIndex] = useState(() => {
    if (orderStatus === 'delivered') return ROUTE_WAYPOINTS.length - 1;
    if (orderStatus === 'out_for_delivery') return 7; // Shirwal - Katraj stretch
    if (orderStatus === 'packed_in_airtight_jar') return 2;
    return 0;
  });

  // Calculate live dynamic info based on progress
  const currentCoord = ROUTE_WAYPOINTS[Math.min(progressIndex, ROUTE_WAYPOINTS.length - 1)];
  const isDelivered = orderStatus === 'delivered';
  const isOutForDelivery = orderStatus === 'out_for_delivery';

  // Initialize and update Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Prevent re-initialization if already mounted
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [17.6, 74.1],
        zoom: 8,
        zoomControl: false,
        attributionControl: false
      });

      // Add zoom control at top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Attribution
      L.control.attribution({ position: 'bottomright', prefix: '© OpenStreetMap | MS Masale Live Fleet' }).addTo(map);

      // Default street tiles
      const streetsLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);
      tileLayerRef.current = streetsLayer;

      // Draw polyline route
      const polyline = L.polyline(ROUTE_WAYPOINTS, {
        color: '#991B1B',
        weight: 5,
        opacity: 0.85,
        dashArray: '10, 8'
      }).addTo(map);

      // 1. Origin Marker: Central Spice Facility
      const originIcon = L.divIcon({
        className: 'custom-origin-icon',
        html: `
          <div style="background:#7F1D1D; color:#FFE79A; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:3px solid #D4AF37; box-shadow:0 4px 10px rgba(0,0,0,0.4); font-size:18px;">
            🌶️
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      L.marker(ROUTE_WAYPOINTS[0], { icon: originIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family:sans-serif; padding:4px;">
            <b style="color:#7F1D1D;">🚩 MS Masale Central Hub</b><br/>
            <span style="font-size:12px; color:#555;">Central Spice Processing &amp; Roasting Unit</span>
          </div>
        `);

      // 2. Destination Marker: Customer Address
      const destIcon = L.divIcon({
        className: 'custom-dest-icon',
        html: `
          <div style="background:#15803D; color:#FFFFFF; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:3px solid #FFFFFF; box-shadow:0 4px 10px rgba(0,0,0,0.4); font-size:18px;">
            🏠
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      L.marker(ROUTE_WAYPOINTS[ROUTE_WAYPOINTS.length - 1], { icon: destIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family:sans-serif; padding:4px;">
            <b style="color:#15803D;">📍 Customer Destination</b><br/>
            <span style="font-size:12px; color:#555;">${customerCity} Delivery Area</span>
          </div>
        `);

      // 3. Live Rider Delivery Marker
      const riderIcon = L.divIcon({
        className: 'custom-rider-icon',
        html: `
          <div style="position:relative; width:44px; height:44px;">
            <div style="position:absolute; inset:0; background:rgba(220,38,38,0.3); border-radius:50%; animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
            <div style="position:absolute; inset:4px; background:#DC2626; color:#FFFFFF; border-radius:50%; display:flex; align-items:center; justify-content:center; border:3px solid #FFFFFF; box-shadow:0 6px 14px rgba(0,0,0,0.45); font-size:18px;">
              🛵
            </div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });

      const riderMarker = L.marker(currentCoord, { icon: riderIcon }).addTo(map);
      riderMarker.bindPopup(`
        <div style="font-family:sans-serif; padding:4px;">
          <b style="color:#B91C1C;">🛵 MS Masale Express Rider</b><br/>
          <span>${riderName}</span><br/>
          <span style="font-size:11px; color:#666;">Veh: ${vehicleNumber}</span>
        </div>
      `);
      riderMarkerRef.current = riderMarker;

      map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
      mapInstanceRef.current = map;
    } else {
      // Update rider location
      if (riderMarkerRef.current) {
        riderMarkerRef.current.setLatLng(currentCoord);
      }
    }

    // Leaflet needs invalidateSize after container renders
    const timer = setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 250);

    return () => clearTimeout(timer);
  }, [currentCoord, customerCity, riderName, vehicleNumber]);

  // Handle tile layer toggle
  const toggleMapLayer = () => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    mapInstanceRef.current.removeLayer(tileLayerRef.current);

    if (mapType === 'streets') {
      const satLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18,
      }).addTo(mapInstanceRef.current);
      tileLayerRef.current = satLayer;
      setMapType('satellite');
    } else {
      const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);
      tileLayerRef.current = streetLayer;
      setMapType('streets');
    }
  };

  // Center map on rider
  const centerOnRider = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(currentCoord, 12, { animate: true });
    }
  };

  // Reset full route view
  const resetRouteView = () => {
    if (mapInstanceRef.current) {
      const bounds = L.latLngBounds(ROUTE_WAYPOINTS);
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
    }
  };

  // Live simulation tick when order is out_for_delivery
  useEffect(() => {
    if (orderStatus !== 'out_for_delivery') return;
    const interval = setInterval(() => {
      setProgressIndex(prev => {
        if (prev >= ROUTE_WAYPOINTS.length - 2) return 5;
        return prev + 1;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, [orderStatus]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-stone-200 shadow-lg bg-stone-900">
      {/* Real Map Canvas */}
      <div
        ref={mapContainerRef}
        className="w-full h-80 sm:h-96 z-0"
        style={{ minHeight: '320px' }}
      />

      {/* Floating Interactive Map Controls */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        <button
          onClick={toggleMapLayer}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-lg text-xs font-bold text-stone-800 shadow-md border border-stone-200 hover:bg-stone-50 transition"
          title="Toggle Satellite / Streets view"
        >
          <Layers className="w-3.5 h-3.5 text-red-700" />
          <span>{mapType === 'streets' ? 'Satellite' : 'Roads'}</span>
        </button>

        <button
          onClick={centerOnRider}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-lg text-xs font-bold text-stone-800 shadow-md border border-stone-200 hover:bg-stone-50 transition"
          title="Center on Rider"
        >
          <Compass className="w-3.5 h-3.5 text-blue-600 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Locate Rider</span>
        </button>

        <button
          onClick={resetRouteView}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-lg text-xs font-bold text-stone-800 shadow-md border border-stone-200 hover:bg-stone-50 transition"
          title="Fit full NH-48 route"
        >
          <Navigation className="w-3.5 h-3.5 text-stone-600" />
          <span>Full Route</span>
        </button>
      </div>

      {/* Top Right Live Telemetry Badge */}
      <div className="absolute top-3 right-12 z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-950/90 backdrop-blur-md text-white rounded-full text-xs font-semibold shadow-md border border-red-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>LIVE GPS TRACKING</span>
        </div>
      </div>

      {/* Bottom Floating Delivery Status Banner */}
      <div className="absolute bottom-3 inset-x-3 z-10 bg-white/95 backdrop-blur-md rounded-xl p-3 sm:p-4 shadow-xl border border-stone-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-700 flex-shrink-0">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-stone-900">{riderName}</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-stone-100 text-stone-700 rounded">
                  {vehicleNumber}
                </span>
              </div>
              <p className="text-xs text-stone-600 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-red-600" />
                <span>
                  {isDelivered
                    ? `Delivered at destination (${customerCity})`
                    : isOutForDelivery
                    ? `En Route via Express Highway • Speed 42 km/h`
                    : `Dispatched from Central Warehouse Hub`}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {deliveryOtp && (
              <div className="px-3 py-1.5 bg-amber-50 border border-amber-300 rounded-lg text-center">
                <div className="text-[10px] uppercase font-bold text-amber-800">Delivery OTP</div>
                <div className="text-sm font-black tracking-widest text-amber-950">{deliveryOtp}</div>
              </div>
            )}
            <a
              href={`tel:${riderPhone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow transition"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Rider</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

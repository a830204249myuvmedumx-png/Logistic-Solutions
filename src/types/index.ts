export type ActiveScreen = 'navigator' | 'dashboard' | 'tracking' | 'ship' | 'inventory' | 'analytics';

export interface Shipment {
  id: string;
  trackingNumber: string;
  carrier: string;
  origin: string;
  destination: string;
  mode: 'sea' | 'air' | 'road';
  status: 'In Transit' | 'Processing' | 'Exception' | 'Delivered';
  eta: string;
  delayNotice?: string;
  weightKg: number;
}

export interface Waypoint {
  id: string;
  name: string;
  subLocation: string;
  timeLabel: string;
  status: 'arrived' | 'delayed' | 'upcoming' | 'destination';
  note?: string;
  coordinates?: { x: number; y: number };
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  warehouse: string;
  stockLevel: number;
  minThreshold: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  imageUrl: string;
  category: string;
  unitPrice: number;
}

export interface WarehouseHub {
  id: string;
  name: string;
  location: string;
  capacityUsedPercent: number;
  status: 'Optimal' | 'Near Capacity' | 'Critical';
  icon: string;
  totalCapacityUnits: number;
  activeShipments: number;
}

export interface TelemetryData {
  speedKmh: number;
  fuelPercent: number;
  engineStatus: 'OPTIMAL' | 'NORMAL' | 'WARNING';
  temperatureC: number;
  windSpeedMs: number;
  windDirection: string;
  conditionsText: string;
  latitude: number;
  longitude: number;
  heading: number;
}

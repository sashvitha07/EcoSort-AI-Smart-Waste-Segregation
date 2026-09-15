export type WasteCategory = 'Biodegradable' | 'Non-Biodegradable';

export interface ScannedWasteItem {
  id: string;
  itemName: string;
  category: WasteCategory;
  confidence: number; // e.g. 96.4
  timestamp: string;
  imageUrl?: string;
  location?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  recommendation: string;
  decompositionTime?: string;
}

export type DustbinStatus = 'Normal' | 'Almost Full' | 'Cleaning Required';

export interface Dustbin {
  id: string;
  binNumber: string; // e.g. "Bin 01"
  name: string;      // e.g. "Central Market - West Wing"
  fillLevel: number; // percentage 0-100
  status: DustbinStatus;
  lastEmptied: string;
  location: string;
  capacityLiters: number;
}

export interface RemoteWasteReport {
  id: string;
  locationName: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  wasteCategory: WasteCategory;
  detectedItems: string[];
  severity: 'Low' | 'Medium' | 'Critical';
  imageUrl?: string;
  notes?: string;
  status: 'Pending Verification' | 'Sanitation Dispatched' | 'Cleared';
}

export type AlertPriority = 'Urgent' | 'High' | 'Medium' | 'Low';

export interface AlertItem {
  id: string;
  title: string;
  targetId: string;       // e.g. "Bin 03" or "Remote-02"
  location: string;
  requiredAction: string;
  priority: AlertPriority;
  timestamp: string;
  status: 'Active' | 'Completed';
  category: 'Dustbin Fill' | 'Remote Waste' | 'System';
}

export interface WasteStatistics {
  totalScanned: number;
  biodegradable: number;
  nonBiodegradable: number;
  activeAlerts: number;
  landfillDivertedKg: number;
  carbonReducedKg: number;
  compostPotentialKg: number;
}

export type NavScreen = 
  | 'dashboard' 
  | 'scan' 
  | 'dustbins' 
  | 'remote' 
  | 'alerts' 
  | 'reports'
  | 'code';

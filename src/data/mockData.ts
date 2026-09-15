import { Dustbin, AlertItem, RemoteWasteReport, ScannedWasteItem, WasteStatistics } from '../types';

export const INITIAL_STATS: WasteStatistics = {
  totalScanned: 129,
  biodegradable: 76,
  nonBiodegradable: 53,
  activeAlerts: 1,
  landfillDivertedKg: 64.2,
  carbonReducedKg: 28.5,
  compostPotentialKg: 42.8,
};

export const INITIAL_DUSTBINS: Dustbin[] = [
  {
    id: 'bin-01',
    binNumber: 'Bin 01',
    name: 'Town Square Green Zone',
    fillLevel: 45,
    status: 'Normal',
    lastEmptied: '4 hours ago',
    location: 'Sector 4, Main Street',
    capacityLiters: 240,
  },
  {
    id: 'bin-02',
    binNumber: 'Bin 02',
    name: 'Metro Station Plaza',
    fillLevel: 76,
    status: 'Almost Full',
    lastEmptied: '8 hours ago',
    location: 'Gate 2, Metro Corridor',
    capacityLiters: 240,
  },
  {
    id: 'bin-03',
    binNumber: 'Bin 03',
    name: 'Central Commercial Market',
    fillLevel: 91,
    status: 'Cleaning Required',
    lastEmptied: '14 hours ago',
    location: 'Crossroad 7, Market Avenue',
    capacityLiters: 240,
  },
  {
    id: 'bin-04',
    binNumber: 'Bin 04',
    name: 'University Campus Library',
    fillLevel: 32,
    status: 'Normal',
    lastEmptied: '2 hours ago',
    location: 'North Quad Walkway',
    capacityLiters: 180,
  },
];

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'alert-01',
    title: 'Critical Fill Level (91%) Reached',
    targetId: 'Bin 03',
    location: 'Crossroad 7, Central Commercial Market',
    requiredAction: 'Dispatch municipal cleaning truck to empty container immediately',
    priority: 'Urgent',
    timestamp: '25 mins ago',
    status: 'Active',
    category: 'Dustbin Fill',
  },
  {
    id: 'alert-02',
    title: 'Threshold Warning (76%)',
    targetId: 'Bin 02',
    location: 'Gate 2, Metro Station Plaza',
    requiredAction: 'Prepare sanitation crew route for next collection cycle',
    priority: 'Medium',
    timestamp: '2 hours ago',
    status: 'Completed',
    category: 'Dustbin Fill',
  },
];

export const INITIAL_REMOTE_REPORTS: RemoteWasteReport[] = [
  {
    id: 'remote-01',
    locationName: 'Silver Beach Coastal Trail, Sector 4',
    latitude: 13.0475,
    longitude: 80.2824,
    timestamp: 'Today, 10:15 AM',
    wasteCategory: 'Non-Biodegradable',
    detectedItems: ['Plastic beverage bottles', 'Polythene carry covers', 'Discarded soda cans'],
    severity: 'Critical',
    imageUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=500&auto=format&fit=crop&q=80',
    notes: 'Accumulation near tidal line. Needs volunteer beach cleanup squad.',
    status: 'Sanitation Dispatched',
  },
  {
    id: 'remote-02',
    locationName: 'Pine Forest Nature Reserve - East Ridge',
    latitude: 11.4102,
    longitude: 76.6950,
    timestamp: 'Yesterday, 04:40 PM',
    wasteCategory: 'Biodegradable',
    detectedItems: ['Organic fruit rinds', 'Cardboard lunch carton', 'Fallen plant foliage'],
    severity: 'Low',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&auto=format&fit=crop&q=80',
    notes: 'Natural organic waste composting naturally along the perimeter path.',
    status: 'Cleared',
  },
];

export const RECENT_SCANS: ScannedWasteItem[] = [
  {
    id: 'scan-101',
    itemName: 'Plastic Water Bottle (PET)',
    category: 'Non-Biodegradable',
    confidence: 97.8,
    timestamp: '12 mins ago',
    recommendation: 'Crush and place in Blue Dry Recyclables Bin. Takes ~450 years to decompose.',
    decompositionTime: '450 years',
  },
  {
    id: 'scan-102',
    itemName: 'Banana Peel & Vegetable Scraps',
    category: 'Biodegradable',
    confidence: 98.4,
    timestamp: '34 mins ago',
    recommendation: 'Deposit into Green Organic Compost Bin. Turns into rich soil compost in 2-4 weeks.',
    decompositionTime: '2 to 5 weeks',
  },
  {
    id: 'scan-103',
    itemName: 'Corrugated Cardboard Box',
    category: 'Biodegradable',
    confidence: 94.2,
    timestamp: '1 hour ago',
    recommendation: 'Flatten and place in Paper/Cardboard recycling container or compost pile.',
    decompositionTime: '2 months',
  },
  {
    id: 'scan-104',
    itemName: 'Aluminum Soda Can',
    category: 'Non-Biodegradable',
    confidence: 96.1,
    timestamp: '2 hours ago',
    recommendation: '100% infinitely recyclable metal. Rinse clean and drop in Metal recycling.',
    decompositionTime: '200 - 500 years',
  },
];

// Sample waste items database for intelligent demo matching & fallback
export const SAMPLE_WASTE_ITEMS: Array<{
  name: string;
  category: 'Biodegradable' | 'Non-Biodegradable';
  confidence: number;
  recommendation: string;
  decompositionTime: string;
  keywords: string[];
}> = [
  {
    name: 'Vegetable & Fruit Kitchen Waste',
    category: 'Biodegradable',
    confidence: 97.4,
    recommendation: 'Transfer to household organic compost pile or community vermicomposting unit.',
    decompositionTime: '1 - 4 weeks',
    keywords: ['vegetable', 'fruit', 'banana', 'apple', 'peel', 'food', 'salad', 'organic', 'leaf', 'carrot'],
  },
  {
    name: 'Paper & Cardboard Packaging',
    category: 'Biodegradable',
    confidence: 95.8,
    recommendation: 'Keep dry and separate for paper recycling mill or direct organic shredding.',
    decompositionTime: '2 - 6 weeks',
    keywords: ['paper', 'cardboard', 'box', 'carton', 'newspaper', 'envelope', 'napkin', 'tissue'],
  },
  {
    name: 'Leftover Food & Cooked Rice',
    category: 'Biodegradable',
    confidence: 98.1,
    recommendation: 'Add to biogas digester or anaerobic green waste composting bucket.',
    decompositionTime: '1 - 2 weeks',
    keywords: ['rice', 'bread', 'meal', 'lunch', 'dinner', 'scraps', 'food waste'],
  },
  {
    name: 'Coffee Grounds & Tea Leaves',
    category: 'Biodegradable',
    confidence: 99.2,
    recommendation: 'Excellent nitrogen-rich additive directly for soil fertilizing and potting plants.',
    decompositionTime: '1 - 3 months',
    keywords: ['coffee', 'tea', 'tea bag', 'grounds'],
  },
  {
    name: 'Plastic Water Bottle / PET Container',
    category: 'Non-Biodegradable',
    confidence: 96.7,
    recommendation: 'Uncap, flatten, and deposit in dry recyclable blue bin for polymer pelletizing.',
    decompositionTime: '450 years',
    keywords: ['plastic', 'bottle', 'pet', 'coke', 'pepsi', 'water bottle', 'polyester'],
  },
  {
    name: 'Polythene Bags & Plastic Wrapper Covers',
    category: 'Non-Biodegradable',
    confidence: 94.3,
    recommendation: 'Hazardous to wildlife and storm drains. Hand over to specialized soft-plastic recycling hub.',
    decompositionTime: '300 - 500 years',
    keywords: ['bag', 'cover', 'polythene', 'wrapper', 'snack', 'chip', 'chips', 'packet', 'pouch'],
  },
  {
    name: 'Aluminum Beverage Can',
    category: 'Non-Biodegradable',
    confidence: 98.6,
    recommendation: 'Rinse and compress. Aluminum is infinitely recyclable with 95% energy savings over virgin ore.',
    decompositionTime: '200 - 500 years',
    keywords: ['can', 'soda can', 'aluminum', 'metal', 'tin', 'beer can'],
  },
  {
    name: 'Electronic Scrap & Battery Cells',
    category: 'Non-Biodegradable',
    confidence: 99.1,
    recommendation: 'Do NOT toss in normal dustbin. Toxic heavy metals require authorized E-Waste drop center.',
    decompositionTime: 'Non-degradable (Toxic)',
    keywords: ['battery', 'electronic', 'cable', 'charger', 'phone', 'chip', 'wire'],
  },
];

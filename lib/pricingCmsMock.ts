export type PricingOffice = "Tokyo" | "Osaka" | "Nagoya" | "Sapporo";

export interface SightseeingPriceRow {
  id: string;
  vehicleType: string;
  vehicleName: string;
  office: PricingOffice;
  owner: string;
  available: boolean;
  halfDayPrice: number;
  fullDayPrice: number;
}

export const SIGHTSEEING_PRICE_SEED: SightseeingPriceRow[] = [
  {
    id: "sp-1",
    vehicleType: "Commuter Van",
    vehicleName: "Toyota Hiace Commuter",
    office: "Tokyo",
    owner: "Self",
    available: true,
    halfDayPrice: 10000,
    fullDayPrice: 12000,
  },
  {
    id: "sp-2",
    vehicleType: "Commuter Van",
    vehicleName: "Toyota Hiace Commuter",
    office: "Osaka",
    owner: "Self",
    available: true,
    halfDayPrice: 47000,
    fullDayPrice: 66000,
  },
  {
    id: "sp-3",
    vehicleType: "Commuter Van",
    vehicleName: "Toyota Hiace Commuter",
    office: "Nagoya",
    owner: "Self",
    available: true,
    halfDayPrice: 47000,
    fullDayPrice: 66000,
  },
  {
    id: "sp-4",
    vehicleType: "Premium Minivan",
    vehicleName: "Toyota Alphard 40Gen",
    office: "Tokyo",
    owner: "Self",
    available: true,
    halfDayPrice: 49000,
    fullDayPrice: 68000,
  },
  {
    id: "sp-5",
    vehicleType: "Premium Minivan",
    vehicleName: "Toyota Alphard 40Gen",
    office: "Osaka",
    owner: "Self",
    available: false,
    halfDayPrice: 47000,
    fullDayPrice: 62000,
  },
  {
    id: "sp-6",
    vehicleType: "Crossover EV",
    vehicleName: "Tesla Model Y",
    office: "Tokyo",
    owner: "Self",
    available: true,
    halfDayPrice: 42000,
    fullDayPrice: 59000,
  },
  {
    id: "sp-7",
    vehicleType: "Premium Minivan",
    vehicleName: "Toyota Alphard 30Gen",
    office: "Tokyo",
    owner: "Self",
    available: true,
    halfDayPrice: 47000,
    fullDayPrice: 66000,
  },
  {
    id: "sp-11",
    vehicleType: "Premium Minivan",
    vehicleName: "Toyota Alphard 30Gen",
    office: "Osaka",
    owner: "Self",
    available: true,
    halfDayPrice: 48000,
    fullDayPrice: 64000,
  },
  {
    id: "sp-12",
    vehicleType: "Crossover EV",
    vehicleName: "Tesla Model Y",
    office: "Osaka",
    owner: "Self",
    available: true,
    halfDayPrice: 43000,
    fullDayPrice: 60000,
  },
  {
    id: "sp-14",
    vehicleType: "Premium Minivan",
    vehicleName: "Toyota Alphard 40Gen",
    office: "Sapporo",
    owner: "Self",
    available: true,
    halfDayPrice: 52000,
    fullDayPrice: 72000,
  },
];

export interface MapLocationSuggestion {
  title: string;
  address: string;
}

export interface AirportPriceZone {
  id: string;
  name: string;
  radiusKm: number | null;
  center: MapLocationSuggestion | null;
  fixedFee: number;
}

export interface AirportPriceLeg {
  airport: string;
  fixedFee: number;
  distanceCapKm: number;
  excessRatePerKm: number;
  /** Fix-rate bands drawn on the range picker. Absent/empty means the leg
   * hasn't been split yet — legZones() derives a single "Standard" band
   * from fixedFee so older seed data still renders. */
  zones?: AirportPriceZone[];
}

export interface AirportPriceRow {
  id: string;
  vehicleType: string;
  vehicleName: string;
  office: PricingOffice;
  owner: string;
  available: boolean;
  legs: AirportPriceLeg[];
}

export const OFFICE_AIRPORTS: Record<PricingOffice, string[]> = {
  Tokyo: ["Narita Airport", "Haneda Airport"],
  Osaka: ["Kansai Airport", "Osaka Itami Airport"],
  Nagoya: ["Chubu Centrair Airport"],
  Sapporo: ["New Chitose Airport"],
};

/** IATA codes for display only — the airport name itself (used as the
 * data key for pricing legs, OFFICE_AIRPORTS, etc.) never changes. */
export const AIRPORT_CODES: Record<string, string> = {
  "Narita Airport": "NRT",
  "Haneda Airport": "HND",
  "Kansai Airport": "KIX",
  "Osaka Itami Airport": "ITM",
  "Chubu Centrair Airport": "NGO",
  "New Chitose Airport": "CTS",
};

export const AIRPORT_DISTANCE_CAP_KM: Record<string, number> = {
  "Narita Airport": 85,
  "Haneda Airport": 35,
  "Kansai Airport": 60,
  "Osaka Itami Airport": 30,
  "Chubu Centrair Airport": 60,
  "New Chitose Airport": 60,
};

export const MAP_LOCATION_SUGGESTIONS: MapLocationSuggestion[] = [
  { title: "Osaka Station", address: "3 Chome-1-1 Umeda, Kita Ward, Osaka, Japan" },
  { title: "THE OSAKA STATION HOTEL, Autograph Collection", address: "3 Chome-2-2 Umeda, Kita Ward, Osaka, Japan" },
  { title: "Tōdai-ji", address: "406-1 Zōshichō, Nara, Japan" },
  { title: "Nara Park", address: "Nara, Nara Prefecture, Japan" },
  { title: "Mount Wakakusa", address: "469 Zōshichō, Nara, Japan" },
  { title: "Yotsuya Station", address: "1 Chome Yotsuya, Shinjuku City, Tokyo, Japan" },
  { title: "Kamakura Station", address: "1 Onari, Kamakura, Kanagawa, Japan" },
  { title: "Great Buddha (Daibutsu)", address: "4 Chome-2-28 Hase, Kamakura, Kanagawa, Japan" },
  { title: "Narita Airport", address: "1-1 Furugome, Narita, Chiba, Japan" },
  { title: "Haneda Airport", address: "2-6-5 Hanedakuko, Ota City, Tokyo, Japan" },
  { title: "Kansai Airport", address: "1 Senshukuko Kita, Izumisano, Osaka, Japan" },
  { title: "Osaka Itami Airport", address: "3-555 Hotarugaike Nishimachi, Toyonaka, Osaka, Japan" },
  { title: "Chubu Centrair Airport", address: "1-1 Centrair, Tokoname, Aichi, Japan" },
  { title: "New Chitose Airport", address: "Bibi, Chitose, Hokkaido, Japan" },
];

export const AIRPORT_MAP_LOCATIONS: Record<string, MapLocationSuggestion> = {};
MAP_LOCATION_SUGGESTIONS.filter((l) => /Airport$/.test(l.title)).forEach((l) => {
  AIRPORT_MAP_LOCATIONS[l.title] = l;
});

/** Fix-rate bands belong to the leg — each vehicle configures its own bands
 * per airport. A leg without `zones` yet carries one flat fixedFee, which
 * becomes the first "Standard" band until edited. */
export function legZones(leg: AirportPriceLeg): AirportPriceZone[] {
  if (leg.zones && leg.zones.length) return leg.zones;
  return [
    {
      id: leg.airport + "::z1",
      name: "Standard",
      radiusKm: AIRPORT_DISTANCE_CAP_KM[leg.airport] ?? null,
      center: null,
      fixedFee: leg.fixedFee,
    },
  ];
}

export function nextZoneId(zones: AirportPriceZone[], airport: string): string {
  let n = zones.length + 1;
  while (zones.some((z) => z.id === airport + "::z" + n)) n++;
  return airport + "::z" + n;
}

export const AIRPORT_PRICE_SEED: AirportPriceRow[] = [
  {
    id: "ap-1",
    vehicleType: "Commuter Van",
    vehicleName: "Hiace Commuter",
    office: "Tokyo",
    owner: "Partner",
    available: true,
    legs: [
      { airport: "Narita Airport", fixedFee: 29318, distanceCapKm: 85, excessRatePerKm: 145 },
      { airport: "Haneda Airport", fixedFee: 21977, distanceCapKm: 35, excessRatePerKm: 145 },
    ],
  },
  {
    id: "ap-2",
    vehicleType: "Premium Van",
    vehicleName: "Toyota Alphard 40 Gen",
    office: "Tokyo",
    owner: "Self",
    available: true,
    legs: [
      { airport: "Narita Airport", fixedFee: 19318, distanceCapKm: 85, excessRatePerKm: 140 },
      { airport: "Haneda Airport", fixedFee: 14705, distanceCapKm: 35, excessRatePerKm: 140 },
    ],
  },
  {
    id: "ap-3",
    vehicleType: "Crossover EV",
    vehicleName: "Tesla Model Y",
    office: "Tokyo",
    owner: "Self",
    available: true,
    legs: [
      { airport: "Narita Airport", fixedFee: 13864, distanceCapKm: 85, excessRatePerKm: 135 },
      { airport: "Haneda Airport", fixedFee: 7432, distanceCapKm: 35, excessRatePerKm: 135 },
    ],
  },
  {
    id: "ap-4",
    vehicleType: "Premium Van",
    vehicleName: "Toyota Alphard 30G",
    office: "Tokyo",
    owner: "Self",
    available: true,
    legs: [
      { airport: "Narita Airport", fixedFee: 17500, distanceCapKm: 85, excessRatePerKm: 140 },
      { airport: "Haneda Airport", fixedFee: 13300, distanceCapKm: 35, excessRatePerKm: 140 },
    ],
  },
  {
    id: "ap-5",
    vehicleType: "Luxury Sedan",
    vehicleName: "Mercedes Benz S-Class 4 Matic",
    office: "Tokyo",
    owner: "Partner",
    available: true,
    legs: [
      { airport: "Narita Airport", fixedFee: 24500, distanceCapKm: 85, excessRatePerKm: 150 },
      { airport: "Haneda Airport", fixedFee: 18200, distanceCapKm: 35, excessRatePerKm: 150 },
    ],
  },
  {
    id: "ap-6",
    vehicleType: "Commuter Van",
    vehicleName: "Hiace Grand Cabin",
    office: "Tokyo",
    owner: "Self",
    available: true,
    legs: [
      { airport: "Narita Airport", fixedFee: 18409, distanceCapKm: 85, excessRatePerKm: 145 },
      { airport: "Haneda Airport", fixedFee: 13795, distanceCapKm: 35, excessRatePerKm: 145 },
    ],
  },
  {
    id: "ap-7",
    vehicleType: "Premium Van",
    vehicleName: "Mercedes Benz V-Class",
    office: "Tokyo",
    owner: "Partner",
    available: true,
    legs: [
      { airport: "Narita Airport", fixedFee: 21500, distanceCapKm: 85, excessRatePerKm: 140 },
      { airport: "Haneda Airport", fixedFee: 16000, distanceCapKm: 35, excessRatePerKm: 140 },
    ],
  },
  {
    id: "ap-8",
    vehicleType: "Luxury Sedan",
    vehicleName: "Mercedes Benz S-Class Executive",
    office: "Tokyo",
    owner: "Partner",
    available: true,
    legs: [
      { airport: "Narita Airport", fixedFee: 27800, distanceCapKm: 85, excessRatePerKm: 150 },
      { airport: "Haneda Airport", fixedFee: 20500, distanceCapKm: 35, excessRatePerKm: 150 },
    ],
  },
  {
    id: "ap-9",
    vehicleType: "Luxury Sedan",
    vehicleName: "Lexus LS",
    office: "Tokyo",
    owner: "Partner",
    available: true,
    legs: [
      { airport: "Narita Airport", fixedFee: 23200, distanceCapKm: 85, excessRatePerKm: 150 },
      { airport: "Haneda Airport", fixedFee: 17400, distanceCapKm: 35, excessRatePerKm: 150 },
    ],
  },
  {
    id: "ap-10",
    vehicleType: "Commuter Van",
    vehicleName: "Hiace Fine Tech Tourer",
    office: "Tokyo",
    owner: "Partner",
    available: true,
    legs: [
      { airport: "Narita Airport", fixedFee: 19800, distanceCapKm: 85, excessRatePerKm: 145 },
      { airport: "Haneda Airport", fixedFee: 14200, distanceCapKm: 35, excessRatePerKm: 145 },
    ],
  },
  {
    id: "ap-11",
    vehicleType: "Commuter Van",
    vehicleName: "Hiace Commuter",
    office: "Osaka",
    owner: "Partner",
    available: true,
    legs: [
      { airport: "Kansai Airport", fixedFee: 23000, distanceCapKm: 60, excessRatePerKm: 145 },
      { airport: "Osaka Itami Airport", fixedFee: 19000, distanceCapKm: 30, excessRatePerKm: 145 },
    ],
  },
  {
    id: "ap-12",
    vehicleType: "Premium Van",
    vehicleName: "Toyota Alphard 40 Gen",
    office: "Osaka",
    owner: "Partner",
    available: true,
    legs: [
      { airport: "Kansai Airport", fixedFee: 14773, distanceCapKm: 60, excessRatePerKm: 140 },
      { airport: "Osaka Itami Airport", fixedFee: 12866, distanceCapKm: 30, excessRatePerKm: 140 },
    ],
  },
  {
    id: "ap-13",
    vehicleType: "Premium Van",
    vehicleName: "Toyota Alphard 30G",
    office: "Osaka",
    owner: "Self",
    available: true,
    legs: [
      { airport: "Kansai Airport", fixedFee: 13500, distanceCapKm: 60, excessRatePerKm: 140 },
      { airport: "Osaka Itami Airport", fixedFee: 11600, distanceCapKm: 30, excessRatePerKm: 140 },
    ],
  },
  {
    id: "ap-14",
    vehicleType: "Commuter Van",
    vehicleName: "Hiace Grand Cabin",
    office: "Osaka",
    owner: "Self",
    available: true,
    legs: [
      { airport: "Kansai Airport", fixedFee: 14500, distanceCapKm: 60, excessRatePerKm: 145 },
      { airport: "Osaka Itami Airport", fixedFee: 12000, distanceCapKm: 30, excessRatePerKm: 145 },
    ],
  },
  {
    id: "ap-15",
    vehicleType: "Luxury Sedan",
    vehicleName: "Mercedes Benz S-Class 4 Matic",
    office: "Osaka",
    owner: "Self",
    available: true,
    legs: [
      { airport: "Kansai Airport", fixedFee: 19000, distanceCapKm: 60, excessRatePerKm: 150 },
      { airport: "Osaka Itami Airport", fixedFee: 15800, distanceCapKm: 30, excessRatePerKm: 150 },
    ],
  },
  {
    id: "ap-16",
    vehicleType: "Premium Van",
    vehicleName: "Mercedes Benz V-Class",
    office: "Osaka",
    owner: "Self",
    available: false,
    legs: [],
  },
  {
    id: "ap-17",
    vehicleType: "Commuter Van",
    vehicleName: "Hiace Fine Tech Tourer",
    office: "Osaka",
    owner: "Partner",
    available: true,
    legs: [
      { airport: "Kansai Airport", fixedFee: 15200, distanceCapKm: 60, excessRatePerKm: 145 },
      { airport: "Osaka Itami Airport", fixedFee: 12400, distanceCapKm: 30, excessRatePerKm: 145 },
    ],
  },
  {
    id: "ap-18",
    vehicleType: "Commuter Van",
    vehicleName: "Hiace Commuter",
    office: "Nagoya",
    owner: "Partner",
    available: true,
    legs: [
      { airport: "Chubu Centrair Airport", fixedFee: 18500, distanceCapKm: 60, excessRatePerKm: 145 },
    ],
  },
  {
    id: "ap-19",
    vehicleType: "Commuter Van",
    vehicleName: "Hiace Grand Cabin",
    office: "Nagoya",
    owner: "Partner",
    available: true,
    legs: [
      { airport: "Chubu Centrair Airport", fixedFee: 17291, distanceCapKm: 60, excessRatePerKm: 140 },
    ],
  },
  {
    id: "ap-20",
    vehicleType: "Premium Van",
    vehicleName: "Toyota Alphard 30G",
    office: "Nagoya",
    owner: "Partner",
    available: true,
    legs: [
      { airport: "Chubu Centrair Airport", fixedFee: 13000, distanceCapKm: 60, excessRatePerKm: 140 },
    ],
  },
  {
    id: "ap-21",
    vehicleType: "Commuter Van",
    vehicleName: "Hiace Commuter",
    office: "Sapporo",
    owner: "Partner",
    available: true,
    legs: [
      { airport: "New Chitose Airport", fixedFee: 20000, distanceCapKm: 60, excessRatePerKm: 145 },
    ],
  },
  {
    id: "ap-22",
    vehicleType: "Premium Van",
    vehicleName: "Toyota Alphard 40 Gen",
    office: "Sapporo",
    owner: "Self",
    available: true,
    legs: [
      { airport: "New Chitose Airport", fixedFee: 15000, distanceCapKm: 60, excessRatePerKm: 140 },
    ],
  },
];

export interface CustomizedPriceRow {
  id: string;
  vehicleType: string;
  vehicleName: string;
  office: PricingOffice;
  owner: string;
  available: boolean;
  minDurationHrs: number | null;
  tieredPricing: boolean;
  unitPrice: number | null;
  unit1to4: number | null;
  unit4to7: number | null;
  unit7to10: number | null;
  fixedRateAvailable: boolean;
  fixedRateFromHrs: number | null;
  fixedRateToHrs: number | null;
  fixedRate: number | null;
  overtimeCharge: number | null;
  dispatchFee: number | null;
  dispatchFreeKm: number | null;
  returnFee: number | null;
  returnFreeKm: number | null;
  longDistanceMaxKm: number | null;
  longDistanceOverchargeRate: number | null;
}

/** Per-vehicle-type charter pricing defaults, keyed off the same Vehicle
 * Lineup identity (type/name/office/owner) that Sightseeing Price uses —
 * Customized Price never invents its own vehicles. */
const CUSTOMIZED_PRICE_BASE: Record<
  string,
  {
    minDurationHrs: number;
    unit1to4: number;
    unit4to7: number;
    unit7to10: number;
    fixedRate: number;
    overtimeCharge: number;
    dispatchFee: number;
    dispatchFreeKm: number;
  }
> = {
  "Commuter Van": {
    minDurationHrs: 4,
    unit1to4: 12000,
    unit4to7: 10500,
    unit7to10: 9500,
    fixedRate: 66000,
    overtimeCharge: 4500,
    dispatchFee: 2000,
    dispatchFreeKm: 20,
  },
  "Premium Minivan": {
    minDurationHrs: 3,
    unit1to4: 14000,
    unit4to7: 12500,
    unit7to10: 11000,
    fixedRate: 72000,
    overtimeCharge: 5200,
    dispatchFee: 2500,
    dispatchFreeKm: 25,
  },
  "Crossover EV": {
    minDurationHrs: 2,
    unit1to4: 11000,
    unit4to7: 9800,
    unit7to10: 8800,
    fixedRate: 60000,
    overtimeCharge: 4000,
    dispatchFee: 1500,
    dispatchFreeKm: 15,
  },
};

export const CUSTOMIZED_PRICE_SEED: CustomizedPriceRow[] = SIGHTSEEING_PRICE_SEED.map(
  (r) => {
    const base =
      CUSTOMIZED_PRICE_BASE[r.vehicleType] ?? CUSTOMIZED_PRICE_BASE["Commuter Van"];
    return {
      id: r.id.replace("sp-", "cp-"),
      vehicleType: r.vehicleType,
      vehicleName: r.vehicleName,
      office: r.office,
      owner: r.owner,
      available: r.available,
      minDurationHrs: base.minDurationHrs,
      tieredPricing: true,
      unitPrice: null,
      unit1to4: base.unit1to4,
      unit4to7: base.unit4to7,
      unit7to10: base.unit7to10,
      fixedRateAvailable: true,
      fixedRateFromHrs: 4,
      fixedRateToHrs: 10,
      fixedRate: base.fixedRate,
      overtimeCharge: base.overtimeCharge,
      dispatchFee: base.dispatchFee,
      dispatchFreeKm: base.dispatchFreeKm,
      returnFee: base.dispatchFee,
      returnFreeKm: base.dispatchFreeKm,
      longDistanceMaxKm: null,
      longDistanceOverchargeRate: null,
    };
  },
);

export const PRICING_CMS_TABS = [
  "Offices",
  "Airports",
  "Vehicle Lineup",
  "Vehicle Detail",
  "Tour Charters",
  "Customized Price",
  "Airport Price",
  "Value-Add Services",
] as const;

export type PricingCmsTab = (typeof PRICING_CMS_TABS)[number];

export const PRICING_OFFICES: PricingOffice[] = [
  "Tokyo",
  "Osaka",
  "Nagoya",
  "Sapporo",
];

export function officeCounts(rows: { office: PricingOffice }[]) {
  const counts: Record<PricingOffice | "All", number> = {
    All: rows.length,
    Tokyo: 0,
    Osaka: 0,
    Nagoya: 0,
    Sapporo: 0,
  };
  for (const row of rows) counts[row.office]++;
  return counts;
}

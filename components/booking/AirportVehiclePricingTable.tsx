"use client";

import { DollarSign, RefreshCw, TriangleAlert } from "lucide-react";
import type {
  AirportVehiclePriceRow,
  AirportVehiclePricing,
  OfficeLocation,
} from "@/lib/types";
import { AIRPORT_PRICE_SEED } from "@/lib/pricingCmsMock";
import { airportDisplayName } from "@/lib/tourUtils";

interface AirportVehiclePricingTableProps {
  officeLocation: OfficeLocation;
  airport: string;
  pricing: AirportVehiclePricing | null;
  onChange: (pricing: AirportVehiclePricing | null) => void;
  locked?: boolean;
}

function rowKey(row: { vehicleType: string; vehicleName: string }): string {
  return `${row.vehicleType}::${row.vehicleName}`;
}

function loadRowsForOfficeAirport(
  office: OfficeLocation,
  airport: string,
): AirportVehiclePriceRow[] {
  return AIRPORT_PRICE_SEED.filter(
    (row) => row.office === office && row.available,
  ).flatMap((row) => {
    const leg = row.legs.find((l) => l.airport === airport);
    if (!leg) return [];
    return [
      {
        vehicleType: row.vehicleType,
        vehicleName: row.vehicleName,
        owner: row.owner,
        fixedFee: leg.fixedFee,
        distanceCapKm: leg.distanceCapKm,
        excessRatePerKm: leg.excessRatePerKm,
        custom: false,
        customPrice: "",
      },
    ];
  });
}

export default function AirportVehiclePricingTable({
  officeLocation,
  airport,
  pricing,
  onChange,
  locked = false,
}: AirportVehiclePricingTableProps) {
  const stale =
    pricing !== null &&
    (pricing.office !== officeLocation || pricing.airport !== airport);

  /** Nothing has been customized/reloaded yet — show the live Pricing CMS
   * list for the current office+airport without requiring an explicit load. */
  const activeRows =
    pricing?.rows ?? loadRowsForOfficeAirport(officeLocation, airport);

  const handleReload = () => {
    const freshRows = loadRowsForOfficeAirport(officeLocation, airport);
    const prevByKey = new Map(activeRows.map((r) => [rowKey(r), r]));
    const rows = freshRows.map((row) => {
      const prev = prevByKey.get(rowKey(row));
      return prev
        ? { ...row, custom: prev.custom, customPrice: prev.customPrice }
        : row;
    });
    onChange({ office: officeLocation, airport, rows });
  };

  return (
    <div className="relative rounded-xl border border-gray-200 p-4">
      <button
        type="button"
        title="Reload from CMS"
        disabled={locked}
        onClick={handleReload}
        className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 transition hover:border-gray-900 hover:text-gray-900 disabled:cursor-default disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-gray-400"
      >
        <RefreshCw className="h-3.5 w-3.5" />
      </button>

      <div className="flex items-start justify-between gap-4 pr-9">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold text-gray-800">
            <DollarSign className="h-4 w-4 text-gray-500" />
            Vehicle Pricing
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Airport category · {officeLocation} office ·{" "}
            {airportDisplayName(airport)} · available vehicles only
          </p>
        </div>
        {pricing && !locked && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="h-8 shrink-0 rounded-lg border border-gray-200 bg-white px-3 text-[13px] font-medium text-gray-600 transition hover:bg-gray-50"
          >
            Clear
          </button>
        )}
      </div>

      {stale && (
        <div className="mt-3.5 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          <TriangleAlert className="h-3.5 w-3.5 shrink-0" />
          Loaded for {pricing.office} office ·{" "}
          {airportDisplayName(pricing.airport)} — this template is now set to{" "}
          {officeLocation} · {airportDisplayName(airport)}. Reload to refresh
          the list.
        </div>
      )}

      {activeRows.length === 0 ? (
        <div className="mt-3.5 rounded-[10px] border border-dashed border-gray-200 bg-gray-50/60 p-5 text-center text-xs text-gray-500">
          No available Airport vehicles found for {officeLocation} ·{" "}
          {airportDisplayName(airport)}.
        </div>
      ) : (
        <div className="mt-3.5 overflow-hidden rounded-[10px] border border-gray-200">
          <table className="w-full border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="whitespace-nowrap px-2 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  Vehicle Type
                </th>
                <th className="whitespace-nowrap px-2 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  Vehicle Name
                </th>
                <th className="px-2 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  Owner
                </th>
                <th className="px-2 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  Fixed Fee ¥
                </th>
                <th className="px-2 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  Dist. Cap km
                </th>
                <th className="px-2 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  Excess ¥/km
                </th>
              </tr>
            </thead>
            <tbody>
              {activeRows.map((row) => (
                <tr
                  key={rowKey(row)}
                  className="border-b border-gray-100 last:border-b-0"
                >
                  <td className="whitespace-nowrap px-2 py-[9px] text-gray-700">
                    {row.vehicleType}
                  </td>
                  <td className="whitespace-nowrap px-2 py-[9px] font-medium text-gray-900">
                    {row.vehicleName}
                  </td>
                  <td className="px-2 py-[9px] text-gray-600">{row.owner}</td>
                  <td className="px-2 py-[9px] text-right tabular-nums text-gray-600">
                    {row.fixedFee}
                  </td>
                  <td className="px-2 py-[9px] text-right tabular-nums text-gray-600">
                    {row.distanceCapKm}
                  </td>
                  <td className="px-2 py-[9px] text-right tabular-nums text-gray-600">
                    {row.excessRatePerKm}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between gap-3 border-t border-gray-200 bg-gray-50 px-3 py-[9px]">
            <p className="text-xs text-gray-500">
              {activeRows.length} available vehicles from Pricing CMS
            </p>
            <p className="whitespace-nowrap text-xs font-semibold text-gray-900">
              Fixed fee ¥ applies to this template ({airportDisplayName(airport)})
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

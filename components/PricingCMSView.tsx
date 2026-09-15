"use client";

import { useMemo, useState } from "react";
import { Pencil, RefreshCw, X } from "lucide-react";
import {
  AIRPORT_DISTANCE_CAP_KM,
  AIRPORT_PRICE_SEED,
  CUSTOMIZED_PRICE_SEED,
  OFFICE_AIRPORTS,
  officeCounts,
  PRICING_CMS_TABS,
  PRICING_OFFICES,
  SIGHTSEEING_PRICE_SEED,
  type AirportPriceLeg,
  type AirportPriceRow,
  type CustomizedPriceRow,
  type PricingCmsTab,
  type PricingOffice,
  type SightseeingPriceRow,
} from "@/lib/pricingCmsMock";
import { formatPrice } from "@/lib/tourUtils";

function formatHrs(v: number | null): string {
  return v === null ? "—" : `${v}h`;
}

function formatFeePerKm(fee: number | null, km: number | null): string {
  if (fee === null || km === null) return "—";
  return `${formatPrice(fee)} / ${km}km`;
}

function AvailabilityToggle({
  available,
  onToggle,
}: {
  available: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={available}
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
        available ? "bg-emerald-500" : "bg-gray-300"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 translate-y-0.5 rounded-full bg-white shadow transition-transform ${
          available ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function OfficeFilterChips({
  officeFilter,
  onChange,
  counts,
}: {
  officeFilter: PricingOffice | "All";
  onChange: (office: PricingOffice | "All") => void;
  counts: Record<PricingOffice | "All", number>;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {(["All", ...PRICING_OFFICES] as const).map((office) => (
        <button
          key={office}
          type="button"
          onClick={() => onChange(office)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            officeFilter === office
              ? "bg-[#121621] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {office} ({counts[office]})
        </button>
      ))}
    </div>
  );
}

export default function PricingCMSView() {
  const [activeTab, setActiveTab] = useState<PricingCmsTab>("Tour Charters");
  const [rows, setRows] = useState<SightseeingPriceRow[]>(SIGHTSEEING_PRICE_SEED);
  const [airportRows, setAirportRows] =
    useState<AirportPriceRow[]>(AIRPORT_PRICE_SEED);
  const [officeFilter, setOfficeFilter] = useState<PricingOffice | "All">("All");
  const [editingAirportRow, setEditingAirportRow] =
    useState<AirportPriceRow | null>(null);
  const [editingSightseeingRow, setEditingSightseeingRow] =
    useState<SightseeingPriceRow | null>(null);
  const [customRows, setCustomRows] =
    useState<CustomizedPriceRow[]>(CUSTOMIZED_PRICE_SEED);
  const [editingCustomRow, setEditingCustomRow] =
    useState<CustomizedPriceRow | null>(null);

  const sightseeingCounts = useMemo(() => officeCounts(rows), [rows]);
  const airportCounts = useMemo(() => officeCounts(airportRows), [airportRows]);
  const customCounts = useMemo(() => officeCounts(customRows), [customRows]);

  const filteredSightseeing = useMemo(() => {
    if (officeFilter === "All") return rows;
    return rows.filter((r) => r.office === officeFilter);
  }, [rows, officeFilter]);

  const filteredAirport = useMemo(() => {
    if (officeFilter === "All") return airportRows;
    return airportRows.filter((r) => r.office === officeFilter);
  }, [airportRows, officeFilter]);

  const filteredCustom = useMemo(() => {
    if (officeFilter === "All") return customRows;
    return customRows.filter((r) => r.office === officeFilter);
  }, [customRows, officeFilter]);

  const toggleAvailable = (id: string) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, available: !r.available } : r,
      ),
    );
  };

  const toggleAirportAvailable = (id: string) => {
    setAirportRows((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, available: !r.available } : r,
      ),
    );
  };

  const handleRefresh = () => {
    setRows(SIGHTSEEING_PRICE_SEED);
    setAirportRows(AIRPORT_PRICE_SEED);
    setCustomRows(CUSTOMIZED_PRICE_SEED);
    setOfficeFilter("All");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Pricing CMS</h1>
        <button
          type="button"
          onClick={handleRefresh}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-gray-200">
        {PRICING_CMS_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium transition ${
              activeTab === tab
                ? "border-b-2 border-[#FACC15] text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Tour Charters" ? (
        <>
          <OfficeFilterChips
            officeFilter={officeFilter}
            onChange={setOfficeFilter}
            counts={sightseeingCounts}
          />

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  {[
                    "Vehicle Type",
                    "Vehicle Name",
                    "Office",
                    "Owner",
                    "Available",
                    "Half Day ¥",
                    "Full Day ¥",
                    "Action",
                  ].map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredSightseeing.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-50 transition hover:bg-gray-50/60"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {row.vehicleType}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{row.vehicleName}</td>
                    <td className="px-4 py-3 text-gray-700">{row.office}</td>
                    <td className="px-4 py-3 text-gray-600">{row.owner}</td>
                    <td className="px-4 py-3">
                      <AvailabilityToggle
                        available={row.available}
                        onToggle={() => toggleAvailable(row.id)}
                      />
                    </td>
                    <td className="px-4 py-3 tabular-nums text-gray-900">
                      {formatPrice(row.halfDayPrice)}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-gray-900">
                      {formatPrice(row.fullDayPrice)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        title="Edit row"
                        onClick={() => setEditingSightseeingRow(row)}
                        className="rounded p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-blue-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {editingSightseeingRow && (
            <SightseeingPriceModal
              row={editingSightseeingRow}
              onClose={() => setEditingSightseeingRow(null)}
              onSave={(updated) => {
                setRows((prev) =>
                  prev.map((r) => (r.id === updated.id ? updated : r)),
                );
                setEditingSightseeingRow(null);
              }}
            />
          )}
        </>
      ) : activeTab === "Airport Price" ? (
        <>
          <OfficeFilterChips
            officeFilter={officeFilter}
            onChange={setOfficeFilter}
            counts={airportCounts}
          />

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  {[
                    "Vehicle Type",
                    "Vehicle Name",
                    "Office",
                    "Airports",
                    "Owner",
                    "Available",
                    "Action",
                  ].map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredAirport.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-50 transition hover:bg-gray-50/60"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {row.vehicleType}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{row.vehicleName}</td>
                    <td className="px-4 py-3 text-gray-700">{row.office}</td>
                    <td className="px-4 py-3">
                      {row.legs.length === 0 ? (
                        <span className="text-gray-300">—</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {row.legs.map((leg) => (
                            <span
                              key={leg.airport}
                              className="inline-flex whitespace-nowrap rounded-md border border-gray-200 bg-gray-50/80 px-2 py-0.5 text-xs font-medium text-gray-600"
                            >
                              {leg.airport}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{row.owner}</td>
                    <td className="px-4 py-3">
                      <AvailabilityToggle
                        available={row.available}
                        onToggle={() => toggleAirportAvailable(row.id)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        title="Edit row"
                        onClick={() => setEditingAirportRow(row)}
                        className="rounded p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-blue-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {editingAirportRow && (
            <AirportPriceModal
              row={editingAirportRow}
              onClose={() => setEditingAirportRow(null)}
              onSave={(updated) => {
                setAirportRows((prev) =>
                  prev.map((r) => (r.id === updated.id ? updated : r)),
                );
                setEditingAirportRow(null);
              }}
            />
          )}
        </>
      ) : activeTab === "Customized Price" ? (
        <>
          <OfficeFilterChips
            officeFilter={officeFilter}
            onChange={setOfficeFilter}
            counts={customCounts}
          />

          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full min-w-[1500px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  {[
                    "Vehicle Name",
                    "Office",
                    "Owner",
                    "Availability",
                    "Min. Duration",
                    "Unit Price (1-4h)",
                    "Unit Price (4-7h)",
                    "Unit Price (7-10h)",
                    "Fixed Rate",
                    "Overtime Charge",
                    "Dispatch Free Km",
                    "Return Free Km",
                    "Action",
                  ].map((col) => (
                    <th
                      key={col}
                      className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCustom.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-50 transition hover:bg-gray-50/60"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {row.vehicleName}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{row.office}</td>
                    <td className="px-4 py-3 text-gray-600">{row.owner}</td>
                    <td className="px-4 py-3">
                      <AvailabilityToggle
                        available={row.available}
                        onToggle={() =>
                          setCustomRows((prev) =>
                            prev.map((r) =>
                              r.id === row.id
                                ? { ...r, available: !r.available }
                                : r,
                            ),
                          )
                        }
                      />
                    </td>
                    <td className="px-4 py-3 tabular-nums text-gray-700">
                      {formatHrs(row.minDurationHrs)}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-gray-900">
                      {formatPrice(
                        row.tieredPricing === false ? row.unitPrice : row.unit1to4,
                      )}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-gray-900">
                      {row.tieredPricing === false ? (
                        <span className="text-gray-300">—</span>
                      ) : (
                        formatPrice(row.unit4to7)
                      )}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-gray-900">
                      {row.tieredPricing === false ? (
                        <span className="text-gray-300">—</span>
                      ) : (
                        formatPrice(row.unit7to10)
                      )}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-gray-900">
                      {!row.fixedRateAvailable ? (
                        <span className="text-gray-300">—</span>
                      ) : (
                        formatPrice(row.fixedRate)
                      )}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-gray-600">
                      {formatPrice(row.overtimeCharge)}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-gray-600">
                      {formatFeePerKm(row.dispatchFee, row.dispatchFreeKm)}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-gray-600">
                      {formatFeePerKm(row.returnFee, row.returnFreeKm)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        title="Edit row"
                        onClick={() => setEditingCustomRow(row)}
                        className="rounded p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-blue-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {editingCustomRow && (
            <CustomizedPriceModal
              row={editingCustomRow}
              onClose={() => setEditingCustomRow(null)}
              onSave={(updated) => {
                setCustomRows((prev) =>
                  prev.map((r) => (r.id === updated.id ? updated : r)),
                );
                setEditingCustomRow(null);
              }}
            />
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white py-24 text-gray-400">
          <p className="text-lg font-medium text-gray-600">{activeTab}</p>
          <p className="mt-1 text-sm">No records yet — prototype placeholder.</p>
        </div>
      )}
    </div>
  );
}

function AirportPriceModal({
  row,
  onClose,
  onSave,
}: {
  row: AirportPriceRow;
  onClose: () => void;
  onSave: (row: AirportPriceRow) => void;
}) {
  const [draft, setDraft] = useState<AirportPriceRow>(row);
  const availableAirports = OFFICE_AIRPORTS[row.office] ?? [];

  const toggleAirport = (airport: string) => {
    setDraft((prev) => {
      const exists = prev.legs.some((l) => l.airport === airport);
      if (exists) {
        return { ...prev, legs: prev.legs.filter((l) => l.airport !== airport) };
      }
      const newLeg: AirportPriceLeg = {
        airport,
        fixedFee: 0,
        distanceCapKm: AIRPORT_DISTANCE_CAP_KM[airport] ?? 60,
        excessRatePerKm: 0,
      };
      return { ...prev, legs: [...prev.legs, newLeg] };
    });
  };

  const updateLeg = (airport: string, patch: Partial<AirportPriceLeg>) => {
    setDraft((prev) => ({
      ...prev,
      legs: prev.legs.map((l) =>
        l.airport === airport ? { ...l, ...patch } : l,
      ),
    }));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[calc(100vh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-bold text-gray-900">Edit Airport Price</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-5 overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Vehicle Type
              </p>
              <p className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500">
                {draft.vehicleType}
              </p>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Vehicle Name
              </p>
              <p className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500">
                {draft.vehicleName}
              </p>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Office
              </p>
              <p className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500">
                {draft.office}
              </p>
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Airports
            </p>
            <div className="flex flex-wrap gap-1.5">
              {availableAirports.map((airport) => {
                const active = draft.legs.some((l) => l.airport === airport);
                return (
                  <button
                    key={airport}
                    type="button"
                    onClick={() => toggleAirport(airport)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                      active
                        ? "bg-[#121621] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {airport}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Owner
            </p>
            <div className="flex gap-1.5">
              {(["Self", "Partner"] as const).map((owner) => (
                <button
                  key={owner}
                  type="button"
                  onClick={() => setDraft((prev) => ({ ...prev, owner }))}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                    draft.owner === owner
                      ? "border-[#121621] bg-[#121621] text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {owner}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Available
            </p>
            <AvailabilityToggle
              available={draft.available}
              onToggle={() =>
                setDraft((prev) => ({ ...prev, available: !prev.available }))
              }
            />
          </div>

          {draft.legs.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Pricing Map
              </p>
              <div className="flex flex-col gap-3">
                {draft.legs.map((leg) => (
                  <div
                    key={leg.airport}
                    className="rounded-lg border border-gray-200 p-3"
                  >
                    <p className="mb-2 text-sm font-semibold text-gray-800">
                      {leg.airport}
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="mb-1 block text-[11px] text-gray-500">
                          Fixed Fee ¥
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={leg.fixedFee}
                          onChange={(e) =>
                            updateLeg(leg.airport, {
                              fixedFee: parseInt(e.target.value, 10) || 0,
                            })
                          }
                          className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm tabular-nums outline-none focus:border-gray-400"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[11px] text-gray-500">
                          Distance Cap km
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={leg.distanceCapKm}
                          onChange={(e) =>
                            updateLeg(leg.airport, {
                              distanceCapKm: parseInt(e.target.value, 10) || 0,
                            })
                          }
                          className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm tabular-nums outline-none focus:border-gray-400"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[11px] text-gray-500">
                          Excess ¥/km
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={leg.excessRatePerKm}
                          onChange={(e) =>
                            updateLeg(leg.airport, {
                              excessRatePerKm: parseInt(e.target.value, 10) || 0,
                            })
                          }
                          className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm tabular-nums outline-none focus:border-gray-400"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave(draft)}
            className="rounded-lg bg-[#FACC15] px-5 py-2 text-sm font-semibold text-[#121621] transition hover:bg-[#eab308]"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

function SightseeingPriceModal({
  row,
  onClose,
  onSave,
}: {
  row: SightseeingPriceRow;
  onClose: () => void;
  onSave: (row: SightseeingPriceRow) => void;
}) {
  const [draft, setDraft] = useState<SightseeingPriceRow>(row);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[calc(100vh-2rem)] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-bold text-gray-900">Edit Vehicle Pricing</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-5 overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Vehicle Type
              </p>
              <p className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500">
                {draft.vehicleType}
              </p>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Vehicle Name
              </p>
              <p className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500">
                {draft.vehicleName}
              </p>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Office
              </p>
              <p className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500">
                {draft.office}
              </p>
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Owner
            </p>
            <div className="flex gap-1.5">
              {(["Self", "Partner"] as const).map((owner) => (
                <button
                  key={owner}
                  type="button"
                  onClick={() => setDraft((prev) => ({ ...prev, owner }))}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                    draft.owner === owner
                      ? "border-[#121621] bg-[#121621] text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {owner}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Available
            </p>
            <AvailabilityToggle
              available={draft.available}
              onToggle={() =>
                setDraft((prev) => ({ ...prev, available: !prev.available }))
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-400">
                Half Day ¥
              </label>
              <input
                type="number"
                min="0"
                value={draft.halfDayPrice}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    halfDayPrice: parseInt(e.target.value, 10) || 0,
                  }))
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm tabular-nums outline-none focus:border-gray-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-400">
                Full Day ¥
              </label>
              <input
                type="number"
                min="0"
                value={draft.fullDayPrice}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    fullDayPrice: parseInt(e.target.value, 10) || 0,
                  }))
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm tabular-nums outline-none focus:border-gray-400"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave(draft)}
            className="rounded-lg bg-[#FACC15] px-5 py-2 text-sm font-semibold text-[#121621] transition hover:bg-[#eab308]"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

const CP_NUM_FIELD =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm tabular-nums outline-none focus:border-gray-400";
const CP_LABEL =
  "mb-1 block text-[11px] font-semibold uppercase tracking-wide text-gray-500";

function numOrNull(v: string): number | null {
  const digits = v.replace(/[^0-9]/g, "");
  return digits === "" ? null : parseInt(digits, 10);
}

function CustomizedPriceModal({
  row,
  onClose,
  onSave,
}: {
  row: CustomizedPriceRow;
  onClose: () => void;
  onSave: (row: CustomizedPriceRow) => void;
}) {
  const [draft, setDraft] = useState<CustomizedPriceRow>(row);
  const patch = (p: Partial<CustomizedPriceRow>) =>
    setDraft((prev) => ({ ...prev, ...p }));
  const minDurBad =
    draft.minDurationHrs !== null &&
    (draft.minDurationHrs < 1 || draft.minDurationHrs > 10);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[calc(100vh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-bold text-gray-900">
            Edit Customized Price
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-5 overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Vehicle Type
              </p>
              <p className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500">
                {draft.vehicleType}
              </p>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Vehicle Name
              </p>
              <p className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500">
                {draft.vehicleName}
              </p>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Office
              </p>
              <p className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500">
                {draft.office}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Owner
            </p>
            <div className="flex gap-1.5">
              {(["Self", "Partner"] as const).map((owner) => (
                <button
                  key={owner}
                  type="button"
                  onClick={() => patch({ owner })}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                    draft.owner === owner
                      ? "border-[#121621] bg-[#121621] text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {owner}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Availability
            </p>
            <AvailabilityToggle
              available={draft.available}
              onToggle={() => patch({ available: !draft.available })}
            />
          </div>

          <div>
            <label className={CP_LABEL}>Min. Duration (1–10h)</label>
            <input
              type="text"
              inputMode="numeric"
              value={draft.minDurationHrs ?? ""}
              onChange={(e) => patch({ minDurationHrs: numOrNull(e.target.value) })}
              onBlur={() => {
                if (draft.minDurationHrs !== null) {
                  patch({ minDurationHrs: Math.min(10, Math.max(1, draft.minDurationHrs)) });
                }
              }}
              placeholder="1–10"
              className={`${CP_NUM_FIELD} max-w-[110px] ${
                minDurBad ? "border-red-300 bg-red-50" : ""
              }`}
            />
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Tiered Pricing
            </p>
            <AvailabilityToggle
              available={draft.tieredPricing !== false}
              onToggle={() => patch({ tieredPricing: !(draft.tieredPricing !== false) })}
            />
          </div>
          {draft.tieredPricing !== false ? (
            <div className="grid grid-cols-3 gap-3">
              {(
                [
                  { key: "unit1to4", label: "Unit Price (1-4h) ¥" },
                  { key: "unit4to7", label: "Unit Price (4-7h) ¥" },
                  { key: "unit7to10", label: "Unit Price (7-10h) ¥" },
                ] as const
              ).map((t) => (
                <div key={t.key}>
                  <label className={CP_LABEL}>{t.label}</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={draft[t.key] ?? ""}
                    onChange={(e) => patch({ [t.key]: numOrNull(e.target.value) })}
                    placeholder="0"
                    className={CP_NUM_FIELD}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div>
              <label className={CP_LABEL}>Unit Price/Hour</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  inputMode="numeric"
                  value={draft.unitPrice ?? ""}
                  onChange={(e) => patch({ unitPrice: numOrNull(e.target.value) })}
                  placeholder="0"
                  className={CP_NUM_FIELD}
                />
                <span className="text-[11px] font-semibold text-gray-400">Hour</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Fixed Rate Availability
            </p>
            <AvailabilityToggle
              available={draft.fixedRateAvailable}
              onToggle={() => patch({ fixedRateAvailable: !draft.fixedRateAvailable })}
            />
          </div>
          {draft.fixedRateAvailable && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={CP_LABEL}>Fixed Rate Range</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={draft.fixedRateFromHrs ?? ""}
                    onChange={(e) => patch({ fixedRateFromHrs: numOrNull(e.target.value) })}
                    placeholder="4"
                    className={`${CP_NUM_FIELD} max-w-[72px]`}
                  />
                  <span className="text-sm font-semibold text-gray-400">~</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={draft.fixedRateToHrs ?? ""}
                    onChange={(e) => patch({ fixedRateToHrs: numOrNull(e.target.value) })}
                    placeholder="10"
                    className={`${CP_NUM_FIELD} max-w-[72px]`}
                  />
                  <span className="text-[11px] font-semibold text-gray-400">h</span>
                </div>
              </div>
              <div>
                <label className={CP_LABEL}>Fixed Rate ¥</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={draft.fixedRate ?? ""}
                  onChange={(e) => patch({ fixedRate: numOrNull(e.target.value) })}
                  placeholder="0"
                  className={CP_NUM_FIELD}
                />
              </div>
            </div>
          )}

          <div className="border-t border-gray-100 pt-4">
            <label className={CP_LABEL}>Overtime Charge ¥ /30mins</label>
            <input
              type="text"
              inputMode="numeric"
              value={draft.overtimeCharge ?? ""}
              onChange={(e) => patch({ overtimeCharge: numOrNull(e.target.value) })}
              placeholder="0"
              className={CP_NUM_FIELD}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {(
              [
                { label: "Dispatch Free Km", feeKey: "dispatchFee", kmKey: "dispatchFreeKm" },
                { label: "Return Free Km", feeKey: "returnFee", kmKey: "returnFreeKm" },
              ] as const
            ).map((k) => (
              <div key={k.feeKey}>
                <label className={CP_LABEL}>{k.label}</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={draft[k.feeKey] ?? ""}
                    onChange={(e) => patch({ [k.feeKey]: numOrNull(e.target.value) })}
                    placeholder="2000"
                    className={CP_NUM_FIELD}
                  />
                  <span className="text-sm font-semibold text-gray-400">/</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={draft[k.kmKey] ?? ""}
                    onChange={(e) => patch({ [k.kmKey]: numOrNull(e.target.value) })}
                    placeholder="20"
                    className={`${CP_NUM_FIELD} max-w-[80px]`}
                  />
                  <span className="text-[11px] font-semibold text-gray-400">km</span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-4">
            <label className={CP_LABEL}>Long Distance Charge</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-[11px] text-gray-500">Max Distance</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={draft.longDistanceMaxKm ?? ""}
                    onChange={(e) => patch({ longDistanceMaxKm: numOrNull(e.target.value) })}
                    placeholder="0"
                    className={CP_NUM_FIELD}
                  />
                  <span className="text-[11px] font-semibold text-gray-400">km</span>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-gray-500">Overcharge Rate ¥</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={draft.longDistanceOverchargeRate ?? ""}
                    onChange={(e) =>
                      patch({ longDistanceOverchargeRate: numOrNull(e.target.value) })
                    }
                    placeholder="0"
                    className={CP_NUM_FIELD}
                  />
                  <span className="text-[11px] font-semibold text-gray-400">/km</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={minDurBad}
            onClick={() => onSave(draft)}
            className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${
              minDurBad
                ? "cursor-not-allowed bg-[#FACC15]/45 text-[#121621]/60"
                : "bg-[#FACC15] text-[#121621] hover:bg-[#eab308]"
            }`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

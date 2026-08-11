"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Studio } from "@/lib/types";
import { formatMoney } from "@/lib/pricing";
import { GradientPhoto } from "@/components/visuals";

/** FR3 — area + max-price filtering, entirely client-side (no reload). */
export function StudioBrowser({
  studios,
  areas,
  priceCeilings,
}: {
  studios: Studio[];
  areas: string[];
  priceCeilings: number[];
}) {
  const [area, setArea] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const visible = useMemo(
    () =>
      studios.filter(
        (s) =>
          (area === "" || s.area === area) &&
          (maxPrice === "" || s.hourlyRate <= Number(maxPrice))
      ),
    [studios, area, maxPrice]
  );

  const filtered = area !== "" || maxPrice !== "";

  return (
    <div className="space-y-6">
      <div className="panel flex flex-col gap-4 p-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="min-w-0 sm:w-52">
            <label htmlFor="area" className="eyebrow block">
              Area
            </label>
            <select
              id="area"
              className="field mt-2"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            >
              <option value="">All areas</option>
              {areas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-0 sm:w-52">
            <label htmlFor="max-price" className="eyebrow block">
              Max hourly price
            </label>
            <select
              id="max-price"
              className="field mt-2"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            >
              <option value="">Any price</option>
              {priceCeilings.map((p) => (
                <option key={p} value={String(p)}>
                  Up to ${p}/hr
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <p data-testid="result-count" className="text-sm text-white/60">
            <span className="font-semibold text-white">{visible.length}</span>{" "}
            {visible.length === 1 ? "studio" : "studios"}
          </p>
          <button
            type="button"
            data-testid="clear-filters"
            onClick={() => {
              setArea("");
              setMaxPrice("");
            }}
            className="btn-ghost"
            disabled={!filtered}
          >
            Clear filters
          </button>
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="panel p-8 text-center text-sm text-white/60">
          No studio in {area || "the catalogue"} sits under ${maxPrice}/hr. Widen the price ceiling
          or clear the filters.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((studio) => (
            <Link
              key={studio.id}
              href={`/studios/${studio.slug}`}
              data-testid="studio-card"
              className="panel panel-hover flex flex-col p-3"
            >
              <GradientPhoto seed={studio.slug} caption={studio.area} className="h-40" />
              <div className="flex flex-1 flex-col px-1.5 pb-1 pt-4">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-base font-semibold text-white">{studio.name}</h2>
                  <p className="whitespace-nowrap text-sm font-semibold text-white">
                    {formatMoney(studio.hourlyRate)}
                    <span className="text-xs font-normal text-white/45">/hr</span>
                  </p>
                </div>
                <p className="mt-1 text-xs text-neon-cyan/80">{studio.area}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {studio.amenities.slice(0, 3).map((a) => (
                    <span key={a} className="chip">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

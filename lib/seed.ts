import type { EventItem, Slot, Studio } from "./types";

/** FR2 — 6 seeded studios across 3 areas. Read-only. */
export const STUDIOS: Studio[] = [
  {
    id: "st-neon-a",
    slug: "neon-room-studio-a",
    name: "Neon Room Studio A",
    area: "Downtown",
    hourlyRate: 110,
    description:
      "The flagship tracking room under the Riviera marquee. Floating floor, 4.2m ceiling and a control room voiced for late-night mixes — booked most often for vocal takes between 8pm and 3am.",
    amenities: ["24/7 access", "Green room + bar", "Street-level load-in", "Engineer on call"],
    equipment: [
      "Neve 1073 preamp pair",
      "Neumann U87 Ai",
      "Universal Audio Apollo x8p",
      "Yamaha NS-10M + Focal Twin monitoring",
      "Rhodes Mark II",
    ],
    images: ["Live room", "Control desk", "Vocal booth"],
  },
  {
    id: "st-velvet",
    slug: "velvet-basement",
    name: "Velvet Basement",
    area: "Downtown",
    hourlyRate: 95,
    description:
      "A tight, dry basement room three doors down from the Riviera stage door. Favoured by DJs cutting edits before a set — you can be on stage nine minutes after you bounce.",
    amenities: ["Late-night access", "Soundproofed to 3am", "Free guest list", "Coffee bar"],
    equipment: [
      "Pioneer CDJ-3000 pair + DJM-A9",
      "Allen & Heath Xone:96",
      "Adam A7X monitors",
      "Shure SM7B",
    ],
    images: ["DJ booth", "Lounge", "Rack wall"],
  },
  {
    id: "st-sable",
    slug: "sable-and-salt",
    name: "Sable & Salt",
    area: "Downtown",
    hourlyRate: 120,
    description:
      "Warm mid-century room with a plate reverb chamber built into the old stairwell. Best-rated space in the catalogue for live drums and small string sections.",
    amenities: ["Plate reverb chamber", "Drum kit included", "Parking for two", "Daylight windows"],
    equipment: [
      "EMT 140 plate reverb",
      "Gretsch Broadkaster kit",
      "API 512c preamps ×4",
      "Coles 4038 ribbon pair",
    ],
    images: ["Drum floor", "Chamber stairs", "Piano corner"],
  },
  {
    id: "st-aurora",
    slug: "aurora-penthouse-suite",
    name: "Aurora Penthouse Suite",
    area: "Downtown",
    hourlyRate: 185,
    description:
      "Top-floor writing suite with a wraparound terrace over the strip. Camera-ready for content days: the skyline behind the desk is the reason artists book it.",
    amenities: ["Terrace", "Lighting rig for video", "Private lift", "Catering on request"],
    equipment: [
      "SSL Big SiX console",
      "Barefoot Footprint 01 monitors",
      "Aston Spirit ×2",
      "Nord Stage 4",
    ],
    images: ["Terrace view", "Writing desk", "Lounge"],
  },
  {
    id: "st-marina",
    slug: "marina-quarter-tape-room",
    name: "Marina Quarter Tape Room",
    area: "Marina Quarter",
    hourlyRate: 140,
    description:
      "Two-inch tape, aligned weekly, in a room overlooking the moorings. The only studio on the platform still tracking to a Studer as a first-class option.",
    amenities: ["Tape aligned weekly", "Harbour view", "Tech on site", "Bike storage"],
    equipment: [
      "Studer A800 MkIII 24-track",
      "Trident 88 console",
      "Fairchild 670 clone",
      "Genelec 1032C",
    ],
    images: ["Tape machine", "Console", "Harbour window"],
  },
  {
    id: "st-harbour",
    slug: "harbour-arches-live-room",
    name: "Harbour Arches Live Room",
    area: "Harbour Arches",
    hourlyRate: 165,
    description:
      "A brick railway arch converted into a 90-capacity live room. Used for showcase sets and band rehearsals that need a PA rather than a headphone mix.",
    amenities: ["90-capacity floor", "Full PA + FOH", "Backline included", "Loading bay"],
    equipment: [
      "d&b audiotechnik Y-Series PA",
      "Midas M32 FOH console",
      "Ampeg SVT + Fender Twin backline",
      "Shure wireless ×4",
    ],
    images: ["Arch floor", "FOH position", "Backline"],
  },
];

/** FR4 — ~5 slots per studio. Fixed UTC instants keep the demo deterministic. */
export const SLOTS: Slot[] = [
  { id: "sl-neon-1", studioId: "st-neon-a", startsAt: "2026-09-04T20:00:00Z", hours: 3 },
  { id: "sl-neon-2", studioId: "st-neon-a", startsAt: "2026-09-05T14:00:00Z", hours: 4 },
  { id: "sl-neon-3", studioId: "st-neon-a", startsAt: "2026-09-06T18:00:00Z", hours: 2 },
  { id: "sl-neon-4", studioId: "st-neon-a", startsAt: "2026-09-10T21:00:00Z", hours: 3 },
  { id: "sl-neon-5", studioId: "st-neon-a", startsAt: "2026-09-11T20:00:00Z", hours: 5 },

  { id: "sl-velvet-1", studioId: "st-velvet", startsAt: "2026-09-04T22:00:00Z", hours: 4 },
  { id: "sl-velvet-2", studioId: "st-velvet", startsAt: "2026-09-07T19:00:00Z", hours: 2 },
  { id: "sl-velvet-3", studioId: "st-velvet", startsAt: "2026-09-09T20:00:00Z", hours: 3 },
  { id: "sl-velvet-4", studioId: "st-velvet", startsAt: "2026-09-12T23:00:00Z", hours: 4 },
  { id: "sl-velvet-5", studioId: "st-velvet", startsAt: "2026-09-14T18:00:00Z", hours: 2 },

  { id: "sl-sable-1", studioId: "st-sable", startsAt: "2026-09-05T10:00:00Z", hours: 6 },
  { id: "sl-sable-2", studioId: "st-sable", startsAt: "2026-09-06T13:00:00Z", hours: 4 },
  { id: "sl-sable-3", studioId: "st-sable", startsAt: "2026-09-08T17:00:00Z", hours: 3 },
  { id: "sl-sable-4", studioId: "st-sable", startsAt: "2026-09-11T11:00:00Z", hours: 5 },
  { id: "sl-sable-5", studioId: "st-sable", startsAt: "2026-09-13T15:00:00Z", hours: 3 },

  { id: "sl-aurora-1", studioId: "st-aurora", startsAt: "2026-09-04T16:00:00Z", hours: 4 },
  { id: "sl-aurora-2", studioId: "st-aurora", startsAt: "2026-09-07T12:00:00Z", hours: 6 },
  { id: "sl-aurora-3", studioId: "st-aurora", startsAt: "2026-09-09T18:00:00Z", hours: 3 },
  { id: "sl-aurora-4", studioId: "st-aurora", startsAt: "2026-09-12T14:00:00Z", hours: 5 },
  { id: "sl-aurora-5", studioId: "st-aurora", startsAt: "2026-09-15T19:00:00Z", hours: 2 },

  { id: "sl-marina-1", studioId: "st-marina", startsAt: "2026-09-05T09:00:00Z", hours: 8 },
  { id: "sl-marina-2", studioId: "st-marina", startsAt: "2026-09-08T13:00:00Z", hours: 4 },
  { id: "sl-marina-3", studioId: "st-marina", startsAt: "2026-09-10T10:00:00Z", hours: 6 },
  { id: "sl-marina-4", studioId: "st-marina", startsAt: "2026-09-13T12:00:00Z", hours: 5 },
  { id: "sl-marina-5", studioId: "st-marina", startsAt: "2026-09-16T17:00:00Z", hours: 3 },

  { id: "sl-harbour-1", studioId: "st-harbour", startsAt: "2026-09-04T18:00:00Z", hours: 5 },
  { id: "sl-harbour-2", studioId: "st-harbour", startsAt: "2026-09-06T15:00:00Z", hours: 4 },
  { id: "sl-harbour-3", studioId: "st-harbour", startsAt: "2026-09-09T19:00:00Z", hours: 3 },
  { id: "sl-harbour-4", studioId: "st-harbour", startsAt: "2026-09-11T17:00:00Z", hours: 6 },
  { id: "sl-harbour-5", studioId: "st-harbour", startsAt: "2026-09-14T20:00:00Z", hours: 4 },
];

/** FR1 — display-only events strip. */
export const EVENTS: EventItem[] = [
  {
    id: "ev-1",
    title: "Riviera Rooftop: Sunset Sessions",
    date: "2026-09-12T18:00:00Z",
    venue: "Sky Lantern Terrace, Downtown",
    image: "sunset",
    priceFrom: 35,
  },
  {
    id: "ev-2",
    title: "Midnight Bass Cathedral",
    date: "2026-09-19T22:00:00Z",
    venue: "Harbour Arches, Arch 14",
    image: "bass",
    priceFrom: 28,
  },
  {
    id: "ev-3",
    title: "Neon Noir: Live Room Takeover",
    date: "2026-10-03T21:00:00Z",
    venue: "Neon Room Studio A, Downtown",
    image: "noir",
    priceFrom: 45,
  },
];

export const AREAS: string[] = Array.from(new Set(STUDIOS.map((s) => s.area)));

export const PRICE_CEILINGS = [100, 120, 150, 200];

export function studioBySlug(slug: string): Studio | undefined {
  return STUDIOS.find((s) => s.slug === slug);
}

export function studioById(id: string): Studio | undefined {
  return STUDIOS.find((s) => s.id === id);
}

export function slotsForStudio(studioId: string): Slot[] {
  return SLOTS.filter((s) => s.studioId === studioId);
}

export function slotById(id: string): Slot | undefined {
  return SLOTS.find((s) => s.id === id);
}

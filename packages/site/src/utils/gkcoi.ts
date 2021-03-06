import { Fleet, getDeckItems, Org, Ship } from "@fleethub/core";
import { Mutable } from "@fleethub/utils";
import { DeckBuilder, DeckBuilderFleet, DeckBuilderShip } from "gkcoi";

const getGkcoiShip = (ship: Ship): DeckBuilderShip => {
  const items = getDeckItems(ship.equipment);

  return {
    id: ship.shipId,
    lv: ship.level,
    items,
    hp: ship.maxHp.value,
    fp: ship.firepower.value,
    tp: ship.torpedo.value,
    aa: ship.antiAir.value,
    ar: ship.armor.value,
    asw: ship.asw.value,
    ev: ship.evasion.value,
    los: ship.los.value,
    luck: ship.luck.value,
  };
};

const getGkcoiFleet = (fleet: Fleet): DeckBuilderFleet => {
  const deckFleet: Mutable<DeckBuilderFleet> = {};

  fleet.entries.forEach(([key, ship]) => {
    if (!ship) return;
    deckFleet[key] = getGkcoiShip(ship);
  });

  return deckFleet;
};

export type GkcoiTheme = DeckBuilder["theme"];
export const GkcoiThemes = [
  "dark",
  "dark-ex",
  "official",
  "74lc",
  "74mc",
  "74sb",
] as const;

export type GkcoiLang = DeckBuilder["lang"];
export const GkcoiLangs = ["jp", "en", "kr", "scn"] as const;

export type GkcoiOptions = Partial<Pick<DeckBuilder, "theme" | "lang" | "cmt">>;

const defaultOptions = { lang: "jp", theme: "dark" } as const;

export const getGkcoiDeck = (org: Org, options?: GkcoiOptions) => {
  const deck: Mutable<DeckBuilder> = {
    hqlv: org.hqLevel,
    ...defaultOptions,
    ...options,
  };

  org.fleetEntries.forEach(([key, fleet]) => {
    if (fleet.ships.length === 0) return;
    deck[key] = getGkcoiFleet(fleet);
  });

  org.airbaseEntries.forEach(([key, airbase]) => {
    if (airbase.equipment.gears.length === 0) return;
    const items = getDeckItems(airbase.equipment);
    deck[key] = { items };
  });

  return deck;
};

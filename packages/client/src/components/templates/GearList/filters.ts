import { GearState, GearBase } from "@fleethub/core"

export type GearFilterFn = (gear: GearBase) => boolean

const filterSet = new Set<GearFilterFn>([
  (gear) => gear.categoryIn("CbFighter", "JetFighter"),
  (gear) => gear.categoryIn("CbDiveBomber", "CbTorpedoBomber", "JetFighterBomber", "JetTorpedoBomber"),
])

const basicFilterRecord: Record<string, GearFilterFn> = {
  fighter: (gear) => gear.categoryIn("CbFighter", "JetFighter"),

  bomber: (gear) => gear.categoryIn("CbDiveBomber", "CbTorpedoBomber", "JetFighterBomber", "JetTorpedoBomber"),

  recon: (gear) =>
    gear.is("Recon") || gear.is("Seaplane") || gear.categoryIn("Autogyro", "AntiSubmarinePatrolAircraft"),

  mainGun: (gear) => gear.is("MainGun"),

  secondary: (gear) => gear.categoryIn("SecondaryGun", "AntiAirGun"),

  torpedo: (gear) => gear.categoryIn("Torpedo", "SubmarineTorpedo", "MidgetSubmarine"),

  antiSubmarine: (gear) => gear.categoryIn("Sonar", "LargeSonar", "DepthCharge"),

  radar: (gear) => gear.is("Radar"),

  landing: (gear) => gear.categoryIn("LandingCraft", "SpecialAmphibiousTank", "SupplyTransportContainer"),

  ration: (gear) => gear.categoryIn("CombatRation", "Supplies"),

  landBased: (gear) => gear.is("LbAircraft"),
}

const filterRecord: Record<string, GearFilterFn> = {
  all: () => true,
  ...basicFilterRecord,
  other: (gear) => Object.values(basicFilterRecord).every((fn) => !fn(gear)),
}

export const getFilter = (key: string): GearFilterFn => {
  const fn = filterRecord[key]
  return fn || filterRecord.all
}

export const getVisibleFilterKeys = (gears: GearBase[]) =>
  Object.entries(filterRecord)
    .filter(([key, filterFn]) => gears.some(filterFn))
    .map(([key]) => key)
import { DeckBuilder, DeckBuilderFleet, DeckBuilderShip } from "gkcoi"
import { Ship, Fleet, Plan } from "@fleethub/core"

const shipToDeck = (ship: Ship): DeckBuilderShip => {
  const items: DeckBuilderShip["items"] = {}
  ship.equipment.forEach((gear, index) => {
    items[index.replace("g", "i") as keyof typeof items] = {
      id: gear.gearId,
      rf: gear.stars,
      mas: gear.ace,
    }
  })

  return {
    id: ship.shipId,
    lv: ship.level,
    items,
    hp: ship.maxHp.displayed,
    fp: ship.firepower.displayed,
    tp: ship.torpedo.displayed,
    aa: ship.antiAir.displayed,
    ar: ship.armor.displayed,
    asw: ship.asw.displayed,
    ev: ship.evasion.displayed,
    los: ship.los.displayed,
    luck: ship.luck.displayed,
  }
}

const fleetToDeck = (fleet: Fleet): DeckBuilderFleet => {
  const deckFleet: DeckBuilderFleet = {}

  fleet.entries.forEach(([key, ship]) => {
    if (!ship) return
    deckFleet[key] = shipToDeck(ship)
  })

  return deckFleet
}

export const planToDeck = (plan: Plan) => {
  const deck: DeckBuilder = { lang: "en", theme: "dark", hqlv: 120 }

  plan.fleetEntries.forEach(([key, fleet]) => {
    if (!fleet) return
    deck[key] = fleetToDeck(fleet)
  })

  return deck
}

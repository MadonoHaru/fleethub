import { createImprovement } from "./Improvement"

import { GearName, GearCategory, GearCategoryKey } from "@fleethub/data"
import { range } from "lodash-es"

import { GearBaseStub } from "../utils/GearBaseStub"
import { makeGear } from "../utils/testUtils"

type Case = [GearName, number, number]

const starsRange = range(11)

const expectMultiplierSqrtStars = (getBonus: (stars: number) => number, multiplier: number) => {
  const bonuses = starsRange.map(getBonus)
  const expected = starsRange.map((stars) => multiplier * Math.sqrt(stars))
  expect(bonuses).toEqual(expected)
}

const expectMultiplierStars = (getBonus: (stars: number) => number, multiplier: number) => {
  const bonuses = starsRange.map(getBonus)
  const expected = starsRange.map((stars) => multiplier * stars)
  expect(bonuses).toEqual(expected)
}

const expectNoBonus = (getBonus: (stars: number) => number) => {
  expectMultiplierStars(getBonus, 0)
}

describe("createImprovement", () => {
  it("デフォルトの戻り値は0", () => {
    const gear = new GearBaseStub()
    expect(createImprovement(gear, 0)).toEqual<ReturnType<typeof createImprovement>>({
      contactSelectionBonus: 0,
      fighterPowerBonus: 0,
      adjustedAntiAirBonus: 0,
      fleetAntiAirBonus: 0,
      shellingPowerBonus: 0,
      shellingAccuracyBonus: 0,
      aswPowerBonus: 0,
      aswAccuracyBonus: 0,
      torpedoPowerBonus: 0,
      torpedoAccuracyBonus: 0,
      torpedoEvasionBonus: 0,
      nightPowerBonus: 0,
      nightAccuracyBonus: 0,
      effectiveLosBonus: 0,
      defensePowerBonus: 0,
    })
  })

  describe("contactSelectionBonus", () => {
    it.each<[GearName, number]>([
      ["二式艦上偵察機", 0.25],
      ["試製景雲(艦偵型)", 0.4],
      ["零式水上観測機", 0.2],
      ["零式水上偵察機", 0.14],
      ["Ro.43水偵", 0.14],
      ["九八式水上偵察機(夜偵)", 0.1],
    ])("%s -> %s * ☆", (name, expected) => {
      const gear = makeGear(name)
      expectMultiplierStars((stars) => createImprovement(gear, stars).contactSelectionBonus, expected)
    })
  })

  describe("fighterPowerBonus ", () => {
    it("戦闘機 -> 0.2 * ☆", () => {
      const gear = GearBaseStub.fromAttrs("Fighter")
      const expected = 0.2

      expectMultiplierStars((stars) => createImprovement(gear, stars).fighterPowerBonus, expected)
    })

    it("爆戦 -> 0.25 * ☆", () => {
      const gear = GearBaseStub.fromAttrs("FighterBomber")
      const expected = 0.25

      expectMultiplierStars((stars) => createImprovement(gear, stars).fighterPowerBonus, expected)
    })

    it("陸攻 -> 0.5 * sqrt(☆)", () => {
      const gear = GearBaseStub.fromCategory("LbAttacker")
      const expected = 0.5

      expectMultiplierSqrtStars((stars) => createImprovement(gear, stars).fighterPowerBonus, expected)
    })
  })

  describe("adjustedAntiAirBonus", () => {
    it("対空8以上の対空機銃 -> 6 * sqrt(☆)", () => {
      const gear = GearBaseStub.fromCategory("AntiAirGun")
      gear.antiAir = 8
      const expected = 6

      expectMultiplierSqrtStars((stars) => createImprovement(gear, stars).adjustedAntiAirBonus, expected)
    })

    it("対空7以下の対空機銃 -> 4 * sqrt(☆)", () => {
      const gear = GearBaseStub.fromCategory("AntiAirGun")
      gear.antiAir = 7
      const expected = 4

      expectMultiplierSqrtStars((stars) => createImprovement(gear, stars).adjustedAntiAirBonus, expected)
    })

    it("対空8以上の高射装置,高角砲 -> 3 * sqrt(☆)", () => {
      const aafd = GearBaseStub.fromCategory("AntiAirFireDirector")
      aafd.antiAir = 8
      const ham = GearBaseStub.fromAttrs("HighAngleMount")
      ham.antiAir = 8

      const expected = 3

      expectMultiplierSqrtStars((stars) => createImprovement(aafd, stars).adjustedAntiAirBonus, expected)
      expectMultiplierSqrtStars((stars) => createImprovement(ham, stars).adjustedAntiAirBonus, expected)
    })

    it("対空7以下の高射装置,高角砲 -> 2 * sqrt(☆)", () => {
      const aafd = GearBaseStub.fromCategory("AntiAirFireDirector")
      aafd.antiAir = 7
      const ham = GearBaseStub.fromAttrs("HighAngleMount")
      ham.antiAir = 7

      const expected = 2

      expectMultiplierSqrtStars((stars) => createImprovement(aafd, stars).adjustedAntiAirBonus, expected)
      expectMultiplierSqrtStars((stars) => createImprovement(ham, stars).adjustedAntiAirBonus, expected)
    })
  })

  describe("fleetAntiAirBonus", () => {
    it("対空8以上の高射装置,高角砲 -> 3 * sqrt(☆)", () => {
      const aafd = GearBaseStub.fromCategory("AntiAirFireDirector")
      aafd.antiAir = 8
      const ham = GearBaseStub.fromAttrs("HighAngleMount")
      ham.antiAir = 8

      const expected = 3

      expectMultiplierSqrtStars((stars) => createImprovement(aafd, stars).fleetAntiAirBonus, expected)
      expectMultiplierSqrtStars((stars) => createImprovement(ham, stars).fleetAntiAirBonus, expected)
    })

    it("対空7以下の高射装置,高角砲 -> 2 * sqrt(☆)", () => {
      const aafd = GearBaseStub.fromCategory("AntiAirFireDirector")
      aafd.antiAir = 7
      const ham = GearBaseStub.fromAttrs("HighAngleMount")
      ham.antiAir = 7

      const expected = 2

      expectMultiplierSqrtStars((stars) => createImprovement(aafd, stars).fleetAntiAirBonus, expected)
      expectMultiplierSqrtStars((stars) => createImprovement(ham, stars).fleetAntiAirBonus, expected)
    })

    it("対空電探 -> 1.5 * sqrt(☆)", () => {
      const gear = GearBaseStub.fromAttrs("AirRadar")
      const expected = 1.5

      expectMultiplierSqrtStars((stars) => createImprovement(gear, stars).fleetAntiAirBonus, expected)
    })
  })

  describe("shellingPowerBonus", () => {
    it("火力13以上 -> 1.5 * sqrt(☆)", () => {
      const fire12 = GearBaseStub.from({ firepower: 12 })
      const fire13 = GearBaseStub.from({ firepower: 13 })

      expectMultiplierSqrtStars((stars) => createImprovement(fire12, stars).shellingPowerBonus, 0)
      expectMultiplierSqrtStars((stars) => createImprovement(fire13, stars).shellingPowerBonus, 1.5)
    })

    it("艦上攻撃機 -> 0.2 * ☆", () => {
      const gear = GearBaseStub.fromCategory("CbTorpedoBomber")

      expectMultiplierStars((stars) => createImprovement(gear, stars).shellingPowerBonus, 0.2)
    })

    it.each<GearName>(["12.7cm連装高角砲", "8cm高角砲", "8cm高角砲改+増設機銃", "10cm連装高角砲改+増設機銃"])(
      "%s -> 0.2 * ☆",
      (name) => {
        const gear = makeGear(name)
        expectMultiplierStars((stars) => createImprovement(gear, stars).shellingPowerBonus, 0.2)
      }
    )

    it.each<GearName>(["15.5cm三連装副砲", "15.5cm三連装副砲改", "15.2cm三連装砲"])("%s -> 0.3 * ☆", (name) => {
      const gear = makeGear(name)
      expectMultiplierStars((stars) => createImprovement(gear, stars).shellingPowerBonus, 0.3)
    })

    it.each<GearCategoryKey>([
      "SmallCaliberMainGun",
      "MediumCaliberMainGun",
      "SecondaryGun",
      "ApShell",
      "AntiAirShell",
      "AntiAirFireDirector",
      "AntiAirGun",
      "Searchlight",
      "LargeSearchlight",
      "AntiGroundEquipment",
      "LandingCraft",
      "SpecialAmphibiousTank",
    ])("%s -> sqrt(☆)", (category) => {
      const gear = GearBaseStub.fromCategory(category)
      expectMultiplierSqrtStars((stars) => createImprovement(gear, stars).shellingPowerBonus, 1)
    })

    it("ソナー,大型ソナー,爆雷投射機,迫撃砲 -> 0.75 * sqrt(☆)", () => {
      const sonor = GearBaseStub.fromCategory("Sonar")
      const largeSonar = GearBaseStub.fromCategory("LargeSonar")
      const depthChargeProjector = GearBaseStub.fromAttrs("DepthChargeProjector")
      const mortar = GearBaseStub.fromAttrs("Mortar")

      ;[sonor, largeSonar, depthChargeProjector, mortar].forEach((gear) => {
        expectMultiplierSqrtStars((stars) => createImprovement(gear, stars).shellingPowerBonus, 0.75)
      })
    })
  })

  describe("shellingAccuracyBonus", () => {
    it("水上電探 -> 1.7 * sqrt(☆)", () => {
      const gear = GearBaseStub.fromAttrs("SurfaceRadar")
      expectMultiplierSqrtStars((stars) => createImprovement(gear, stars).shellingAccuracyBonus, 1.7)
    })

    it("電探, 徹甲弾, 対空弾, 高射装置 -> 1 * sqrt(☆)", () => {
      const radar = GearBaseStub.fromAttrs("Radar")
      const aps = GearBaseStub.fromCategory("ApShell")
      const aas = GearBaseStub.fromCategory("AntiAirShell")
      const aafd = GearBaseStub.fromCategory("AntiAirFireDirector")

      ;[radar, aps, aas, aafd].forEach((gear) => {
        expectMultiplierSqrtStars((stars) => createImprovement(gear, stars).shellingAccuracyBonus, 1)
      })
    })
  })
})
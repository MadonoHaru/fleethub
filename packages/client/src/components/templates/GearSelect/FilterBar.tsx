import React from "react"
import styled from "styled-components"
import { GearCategory } from "@fleethub/data"
import { MasterGear } from "@fleethub/core"

import { AppBar, Toolbar, Checkbox } from "@material-ui/core"

import { useGearSelect } from "../../../hooks"
import { Flexbox, SelectButtons, Select } from "../../../components"

import FilterButtons, { filterNameToFn } from "./FilterButtons"
import CategorySelect from "./CategorySelect"
import { defaultComparer, idComparer } from "./comparers"

const allCategories = Object.values(GearCategory).filter(
  (category): category is GearCategory => typeof category === "number"
)

const createCategoryGearMap = (gears: MasterGear[]) => {
  const map = new Map<GearCategory, MasterGear[]>()
  allCategories.forEach((category) => {
    const filtered = gears.filter((gear) => gear.category === category)
    if (filtered.length > 0) map.set(category, filtered)
  })

  return map
}

const getVisibleCategories = (gears: MasterGear[]) => {
  const categories = [...new Set(gears.map((gear) => gear.category))]
  if (categories.length <= 1) return [0]
  return categories.concat(0).sort((a, b) => a - b)
}

type Props = {
  gears: MasterGear[]
  children: (entries: Array<[GearCategory, MasterGear[]]>) => React.ReactNode
}

const FilterBar: React.FCX<Props> = ({ className, gears, children }) => {
  const { state, setState, equippableFilter } = useGearSelect()

  const handleFilterChange = (filter: string) => {
    setState({ filter, category: 0 })
  }

  const handleCategoryChange = (category: number) => {
    setState({ category })
  }

  const equippableGears = gears
    .filter((gear) => {
      if (state.abyssal) return gear.is("Abyssal")
      return !gear.is("Abyssal")
    })
    .filter(equippableFilter)

  const visibleGears = equippableGears.filter(filterNameToFn(state.filter)).sort(idComparer)

  const visibleCategories = getVisibleCategories(visibleGears)

  const categoryFilter = (gear: MasterGear) => state.category === 0 || state.category === gear.category
  const entries = Array.from(createCategoryGearMap(visibleGears.filter(categoryFilter)))

  return (
    <>
      <div className={className}>
        <Flexbox>
          <FilterButtons value={state.filter} onChange={handleFilterChange} equippableGears={equippableGears} />
        </Flexbox>
        <Flexbox>
          <CategorySelect value={state.category} options={visibleCategories} onChange={handleCategoryChange} />
          <Checkbox checked={state.abyssal} onClick={() => setState({ abyssal: !state.abyssal })} />
        </Flexbox>
      </div>
      {children(entries)}
    </>
  )
}

export default FilterBar

import React, { useEffect } from "react"
import styled from "styled-components"
import { Formation, SingleFleetFormations, CombinedFleetFormations } from "@fleethub/core"

import { Select, SelectTextFieldProps } from "../../molecules"

const dict: Record<Formation, string> = {
  LineAhead: "単縦陣",
  DoubleLine: "複縦陣",
  Diamond: "輪形陣",
  Echelon: "梯形陣",
  LineAbreast: "単横陣",
  Vanguard: "警戒陣",
  CruisingFormation1: "第一航行",
  CruisingFormation2: "第二航行",
  CruisingFormation3: "第三航行",
  CruisingFormation4: "第四航行",
}

const getFormationName = (formation: Formation) => dict[formation]

type Props = SelectTextFieldProps & {
  formation: Formation
  onChange: (formation: Formation) => void
  isCombined?: boolean
}

const FormationSelect: React.FC<Props> = ({ formation, onChange, isCombined, ...rest }) => {
  const options: readonly Formation[] = isCombined ? CombinedFleetFormations : SingleFleetFormations

  useEffect(() => {
    if (options.includes(formation)) return
    onChange(isCombined ? "CruisingFormation4" : "LineAhead")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options])

  return <Select options={options} value={formation} onChange={onChange} getOptionLabel={getFormationName} {...rest} />
}

export default styled(FormationSelect)`
  min-width: 120px;
`
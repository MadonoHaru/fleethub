import styled from "@emotion/styled";
import { Plan } from "@fleethub/core";
import { Paper } from "@material-ui/core";
import React from "react";

import { Tabs, TabsProps } from "../../../components";
import AntiAirPanel from "./AntiAirPanel";
import ContactChancePanel from "./ContactChancePanel";
import DayAttackRateTable from "./DayAttackRateTable";
import MiscPanel from "./MiscPanel";
import NightCutinPanel from "./NightCutinPanel";

type Props = {
  plan: Plan;
};

const PlanAnalysisPanel: React.FCX<Props> = ({ className, plan }) => {
  const list: TabsProps["list"] = [
    { label: "弾着戦爆発動率", panel: <DayAttackRateTable plan={plan} /> },
    { label: "触接率", panel: <ContactChancePanel plan={plan} /> },
    { label: "夜戦CI率", panel: <NightCutinPanel plan={plan} /> },
    { label: "対空", panel: <AntiAirPanel plan={plan} /> },
    { label: "その他", panel: <MiscPanel plan={plan} /> },
  ];

  return (
    <Paper>
      <Tabs className={className} list={list} />
    </Paper>
  );
};

export default styled(PlanAnalysisPanel)`
  padding: 16px;
  min-height: 480px;
  > * {
    margin-right: auto;
    margin-left: auto;
  }
`;
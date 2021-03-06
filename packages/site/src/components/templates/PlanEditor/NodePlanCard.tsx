import styled from "@emotion/styled";
import { AirbaseKeys, NodePlan, Plan } from "@fleethub/core";
import {
  Button,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core";
import React from "react";
import { useMemo } from "react";

import {
  EnemyFleetContent,
  Flexbox,
  InfoButton,
  RemoveButton,
} from "../../../components";
import { useFhSystem, useModal } from "../../../hooks";
import { Update } from "../../../utils";
import { FormationSelect } from "../../organisms";
import NodeBattleAnalysisScreen from "../NodeBattleAnalysisScreen";

const AirbaseLable = styled(Typography)`
  margin: 8px;
`;

type NodeLbasFormProps = {
  lbas: NodePlan["lbas"];
  onChange: (lbas: NodePlan["lbas"]) => void;
};

const NodeLbasForm: React.FC<NodeLbasFormProps> = ({ lbas = {}, onChange }) => {
  return (
    <>
      {AirbaseKeys.map((key, index) => (
        <Flexbox key={key}>
          <AirbaseLable>{index + 1}</AirbaseLable>
          <RadioGroup
            value={lbas[key] || 0}
            onChange={(a, value) => onChange({ ...lbas, [key]: Number(value) })}
            row
          >
            <FormControlLabel
              value={0}
              label="無し"
              control={<Radio size="small" />}
            />
            <FormControlLabel
              value={1}
              label="分散"
              control={<Radio size="small" />}
            />
            <FormControlLabel
              value={2}
              label="集中"
              control={<Radio size="small" />}
            />
          </RadioGroup>
        </Flexbox>
      ))}
      <Flexbox>
        <Button onClick={() => onChange(undefined)}>使用しない</Button>
        <Button onClick={() => onChange({ a1: 2, a2: 2, a3: 2 })}>
          全集中
        </Button>
      </Flexbox>
    </>
  );
};

type NodePlanCardProps = {
  plan: Plan;
  node: NodePlan;
  update: Update<NodePlan>;
  onRemove?: () => void;
};

const getLbasLabel = ({ lbas }: NodePlan) => {
  if (!lbas) return "無し";
  const { a1, a2, a3 } = lbas;
  const as = [a1, a2, a3];
  if (as.every((a) => a === 2)) return "全集中";
  if (as.every((a) => !a)) return "無し";

  return as
    .map((a, i) => (a ? `${i + 1}: ${a >= 2 ? "集中" : "分散"}` : ""))
    .filter((str) => Boolean(str))
    .join(" ");
};

const NodePlanCard: React.FC<NodePlanCardProps> = ({
  plan,
  node,
  update,
  onRemove,
}) => {
  const { createEnemyFleet } = useFhSystem();
  const Modal = useModal();
  const handleLbasChange = (next: NodePlan["lbas"]) => {
    update((draft) => {
      if (next) {
        draft.lbas = next;
      } else {
        delete draft.lbas;
      }
    });
  };

  const lbas = node.d !== undefined;

  const enemyFleet = useMemo(() => node.enemy && createEnemyFleet(node.enemy), [
    node.enemy,
    createEnemyFleet,
  ]);

  return (
    <Paper>
      <Flexbox>
        <Typography>
          {node.name} {node.d !== undefined && `距離: ${node.d}`}
        </Typography>
        <InfoButton size="tiny" />
        <RemoveButton size="tiny" onClick={onRemove} />
      </Flexbox>

      <Button size="small" variant="outlined" onClick={Modal.show}>
        基地設定 {getLbasLabel(node)}
      </Button>
      {enemyFleet && (
        <EnemyFleetContent enemy={enemyFleet} visibleAlbFp={lbas} />
      )}

      <Modal>
        <NodeLbasForm lbas={node.lbas} onChange={handleLbasChange} />
      </Modal>

      {enemyFleet && (
        <NodeBattleAnalysisScreen plan={plan} enemy={enemyFleet} />
      )}
    </Paper>
  );
};

export default NodePlanCard;

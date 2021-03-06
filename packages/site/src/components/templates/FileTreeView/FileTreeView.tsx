import styled from "@emotion/styled";
import { Button, Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import CreateNewFolderIcon from "@material-ui/icons/CreateNewFolder";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import TreeItem from "@material-ui/lab/TreeItem";
import TreeView from "@material-ui/lab/TreeView";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  FileEntity,
  filesSlice,
  isDirectory,
  selectFilesState,
} from "../../../store";
import { FileDropZone } from "../../organisms";
import FolderLabel from "./FolderLabel";
import PlanFileLabel from "./PlanFileLabel";

const TransitionProps = { timeout: 150 };

const FileTreeView: React.FCX = ({ className }) => {
  const dispatch = useDispatch();
  const { entities, root, temp } = useSelector(selectFilesState);

  const [expanded, setExpanded] = React.useState<string[]>([]);
  const [selected, setSelected] = React.useState<string>("");

  const handleToggle = (e: React.SyntheticEvent, nodeIds: string[]) => {
    setExpanded(nodeIds);
  };

  const handleSelect = (e: React.SyntheticEvent, id: string) => {
    setSelected(id);
  };

  const handlePlanCreate = () => {
    dispatch(filesSlice.actions.createPlan({ to: "root" }));
  };

  const handleFolderCreate = () => {
    dispatch(filesSlice.actions.createFolder("root"));
  };

  const handleRootDrop = ({ id }: FileEntity) => {
    dispatch(filesSlice.actions.move({ id, to: "root" }));
  };

  const renderFile = (id: string) => {
    const file = entities[id];
    if (!file) return null;

    let label: React.ReactNode;

    if (file.type === "plan") {
      label = <PlanFileLabel file={file} />;
    } else if (file.type === "folder") {
      label = <FolderLabel file={file} />;
    }

    const children = isDirectory(file) ? file.children.map(renderFile) : null;

    return (
      <TreeItem
        key={file.id}
        nodeId={file.id}
        label={label}
        TransitionProps={TransitionProps}
      >
        {children}
      </TreeItem>
    );
  };

  return (
    <div className={className}>
      <div>
        <Button onClick={() => handlePlanCreate()} startIcon={<AddIcon />}>
          編成を作成
        </Button>
        <Button
          onClick={() => handleFolderCreate()}
          startIcon={<CreateNewFolderIcon />}
        >
          フォルダを作成
        </Button>
      </div>
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        expanded={expanded}
        selected={selected}
        onNodeToggle={handleToggle}
        onNodeSelect={handleSelect}
      >
        {root.children.map(renderFile)}

        {Boolean(temp.children.length) && (
          <TreeItem
            key="temp"
            nodeId="temp"
            label={<Typography variant="body2">一時ファイル</Typography>}
            TransitionProps={TransitionProps}
          >
            {temp.children.map(renderFile)}
          </TreeItem>
        )}
      </TreeView>
      <FileDropZone
        className={className}
        onDrop={handleRootDrop}
        canDrop={() => true}
      />
    </div>
  );
};

export default styled(FileTreeView)`
  display: flex;
  flex-direction: column;
  height: 100%;

  .MuiTreeItem-label {
    min-width: 0;
    flex-shrink: 1;
  }

  .MuiTreeItem-group {
    margin-left: 12px;
  }
`;

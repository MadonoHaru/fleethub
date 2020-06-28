import React from "react"
import styled from "styled-components"

import SvgIcon from "@material-ui/core/SvgIcon"
import IconButton, { IconButtonProps } from "@material-ui/core/IconButton"
import Tooltip, { TooltipProps } from "@material-ui/core/Tooltip"

export interface WithIconButtonProps extends IconButtonProps {
  label?: string
  title?: string
  tooltipProps?: Omit<TooltipProps, "title">
}

const withIconButton = (WrappedIcon: React.FC) => {
  const WithIconButton: React.FC<WithIconButtonProps> = ({ title, label, tooltipProps, ...iconButonProps }) => {
    const WrappedButton = (
      <IconButton {...iconButonProps}>
        <WrappedIcon />
        {label}
      </IconButton>
    )

    if (title) {
      return (
        <Tooltip title={title} {...tooltipProps}>
          {WrappedButton}
        </Tooltip>
      )
    }
    return WrappedButton
  }

  WithIconButton.displayName = `WithIconButton(${WrappedIcon.name || WrappedIcon.displayName})`
  return styled(WithIconButton)`
    svg {
      font-size: inherit;
    }
  `
}

export default withIconButton

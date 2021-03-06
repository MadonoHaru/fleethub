import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { round } from "@fleethub/utils";
import { Button, InputAdornment } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Input, InputProps } from "../../atoms";
import usePress from "./usePress";

const StyledButton = styled(Button)`
  display: flex;
  padding: 0;
  height: 20px;
  min-height: 0;
`;

const stepValue = (value: number, step: number) => {
  const precision = Math.ceil(-Math.log10(Math.abs(step)));
  return round(value + step, precision);
};

type AdornmentProps = {
  increase: () => void;
  decrease: () => void;
};

const Adornment: React.FCX<AdornmentProps> = ({
  className,
  increase,
  decrease,
}) => {
  const increaseProps = usePress(increase);
  const decreaseProps = usePress(decrease);

  return (
    <InputAdornment className={className} position="end">
      <div>
        <StyledButton {...increaseProps}>
          <ArrowDropUpIcon />
        </StyledButton>
        <StyledButton {...decreaseProps}>
          <ArrowDropDownIcon />
        </StyledButton>
      </div>
    </InputAdornment>
  );
};

const toHalf = (str: string) =>
  str.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0));

const isNumeric = (str: string) => {
  if (str === "") return false;

  const num = Number(str);
  return Number.isFinite(num);
};

export type NumberInputProps = {
  value: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
} & Omit<InputProps, "type" | "inputProps" | "onChange" | "onInput">;

const NumberInput: React.FC<NumberInputProps> = ({
  className,
  value,
  onChange,
  min,
  max,
  step = 1,
  variant,
  InputProps,
  ...textFieldProps
}) => {
  const changeValue = useCallback(
    (next: number) => {
      if (!onChange) return;

      next = typeof min === "number" ? Math.max(next, min) : next;
      next = typeof max === "number" ? Math.min(next, max) : next;

      onChange(next);
    },
    [min, max, onChange]
  );

  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = React.useCallback(() => setIsFocused(true), [
    setIsFocused,
  ]);
  const handleBlur = React.useCallback(() => setIsFocused(false), [
    setIsFocused,
  ]);

  const [inputStr, setInputStr] = React.useState(value.toString());

  useEffect(() => {
    if (!isFocused) setInputStr(value.toString());
  }, [value, isFocused, setInputStr]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const str = event.target.value;
      setInputStr(str);

      const next = Number(str);
      if (isNumeric(str)) {
        changeValue(next);
      }
    },
    [changeValue, setInputStr]
  );

  const mergedInputProps = useMemo(() => {
    const increase = () => changeValue(stepValue(value, step));
    const decrease = () => changeValue(stepValue(value, -step));

    const endAdornment = <Adornment increase={increase} decrease={decrease} />;

    return { endAdornment, ...InputProps };
  }, [value, step, changeValue, InputProps]);

  return (
    <div className={className}>
      <Input
        value={inputStr}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        InputProps={mergedInputProps}
        variant={variant}
        {...textFieldProps}
      />
    </div>
  );
};

export default styled(NumberInput)`
  .MuiInputAdornment-positionEnd {
    visibility: hidden;
  }

  :hover .MuiInputAdornment-positionEnd {
    visibility: visible;
  }

  .MuiInputLabel-root {
    white-space: nowrap;
  }
  .MuiOutlinedInput-adornedEnd {
    padding-right: 8px;
  }
`;

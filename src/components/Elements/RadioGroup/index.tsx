import { useState } from "react";
import { Flex } from "../../UI/Flex";
import { Radio } from "../../UI/Radio";
import { Spacing } from "../../UI/Spacing";
import { Typography } from "../../UI/Typography";
import "./style.scss";

export type RadioGroupProps = {
  label: string;
  options: {
    label: string;
    value: string;
  }[];
  defaultValue: string;
  handleClick: (value: string) => void;
};

export const RadioGroup = ({
  label,
  options,
  defaultValue = "",
  handleClick,
}: RadioGroupProps) => {
  const [selectedOption, setSelectedOption] = useState(defaultValue);

  function onClick(option: { label: string; value: string }) {
    setSelectedOption(option.value);
    handleClick(option.value);
  }

  return (
    <Flex direction="column" style={{ marginBottom: "32px" }}>
      <Typography as="p" variant="body1">
        {label}
      </Typography>
      <Spacing bottom={2.4} />
      <Flex gap={24}>
        {options.map((option) => (
          <Radio
            key={option.label}
            variant={selectedOption === option.value ? "checked" : "default"}
            onClick={() => onClick(option)}
            description={option.label}
          />
        ))}
      </Flex>
    </Flex>
  );
};

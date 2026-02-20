import { useState } from "react";
import { Flex } from "../Flex";
import { Radio } from "../Radio";
import { Spacing } from "../Spacing";
import { Typography } from "../Typography";
import "./style.scss";

export type RadioGroupProps = {
  label: string;
  options: {
    description: string;
  }[];
  defaultValue: string;
  handleClick: (value: string) => void;
};

export const RadioGroup = ({
  label,
  options,
  defaultValue = '',
  handleClick
}: RadioGroupProps) => {

  const [selectedOption, setSelectedOption] = useState(defaultValue);

  function onClick(option: { description: string }) {
    setSelectedOption(option.description);
    handleClick(option.description);
  }

  return (
    <Flex direction="column">
      <Typography as="p" variant="body1">
        {label}
      </Typography>
      <Spacing bottom={2.4} />
      <Flex gap={24}>
        {options.map((option) => (
          <Radio
            key={option.description}
            variant={
              selectedOption === option.description ? "checked" : "default"
            }
            onClick={() => onClick(option)}
            description={option.description}
          />
        ))}
      </Flex>
    </Flex>
  );
};

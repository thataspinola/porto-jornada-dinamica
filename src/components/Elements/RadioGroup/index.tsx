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
};

export const RadioGroup = ({ label, options }: RadioGroupProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

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
            onClick={() => setSelectedOption(option.description)}
            description={option.description}
          />
        ))}
      </Flex>
    </Flex>
  );
};

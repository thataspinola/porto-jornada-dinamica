import type { JourneyConfig, Step } from "../../types";
import { FormElement } from "../FormElement";

interface FormStepProps {
  config: JourneyConfig;
  step: Step;
  data: Record<string, any>;
  onChange: (id: string, value: any) => void;
}

export const FormStep = ({ step, data, onChange }: FormStepProps) => {
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateField = (element: any, value: any) => {
    if (element.validation?.required && !value) {
      return "Este campo é obrigatório";
    }
    if (element.validation?.pattern === "cpf" && !validarCPF(value)) {
      return "CPF inválido";
    }
    return "";
  };

  const handleChange = (id: string, value: any, element: any) => {
    onChange(id, value);

    const error = validateField(element, value);
    setErrors(prev => ({ ...prev, [id]: error }));
  };

  return (
    <div>
      {step.elements.map((element) => (
        <FormElement
          key={element.id}
          element={element}
          value={data[element.id]}
          error={errors[element.id]}
          onChange={(value) => handleChange(element.id, value, element)}
        />
      ))}
    </div>
  );
};

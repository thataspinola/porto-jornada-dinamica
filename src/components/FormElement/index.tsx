/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
"use client";
import { Button, ElementNotFound } from "@/components";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ElementRegistry } from "./elementRegistry";
import type { FormElementProps } from "./type";

export const FormElement = ({ element, action }: FormElementProps) => {
  const [values, setValue] = useState({});
  const router = useRouter();

  const Component = ElementRegistry[element.type];

  if (!Component) return <ElementNotFound />;

  function handleClick() {
    const isFormValid = true;
    console.log(`...validando campos`, values);
    console.log(`...Chamando serviço: ${action?.service}`);

    if (isFormValid) {
      router.push(action.onSuccess.target);
    }
  }

  if (element.type === "button") {
    return <Button width="fluid" onClick={handleClick} {...element.uiProps} />;
  }

  return (
    <Component
      value={values[element.id]}
      onChange={(value) => setValue({ ...value, [element.id]: value })}
      handleClick={(value) => setValue({ ...value, [element.id]: value })}
      errorMessage={""}
      {...element.uiProps}
    />
  );
};

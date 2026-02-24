'use client';
import type { JourneyProps } from "../../types";

import { Header } from "../Elements/Header";
import { ProgressBar } from "../Elements/ProgressBar";
import { FormStep } from "../FormStep";

export const Journey = ({
  slug,
  data,
}: JourneyProps) => {

  return (
    <>
      <Header goBackLink={data.step.backStepSlug} />
      <ProgressBar
        initialValue={0}
        value={data.progress}
        style={{ marginBottom: '40px' }}
      />
      <div style={{ maxWidth: '600px', margin: "0 auto" }}>
        <FormStep step={data.step} journeySlug={slug} />
      </div>
    </>
  );
};



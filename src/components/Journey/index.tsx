import Head from "next/head";
import type { JourneyProps } from "../../types";

import { Header } from "../Elements/Header";
import { ProgressBar } from "../Elements/ProgressBar";
import { FormStep } from "../FormStep";

export const Journey = ({
  journeySlug,
  step,
}: JourneyProps) => {
  return (
    <>
      <Head>
        <title>{step?.seo?.title}</title>
        <link rel="canonical" href={step?.seo?.canonical} />
        <meta name="keywords" content={step?.seo?.keywords} />
        <meta name="description" content={step?.seo?.description} />
      </Head>
      <Header {...step.layout.header} />
      {!!step?.layout?.progressbar && (
        <ProgressBar
          initialValue={step?.layout?.progressbar?.start}
          value={step?.layout?.progressbar?.end}
        />
      )}
      <div style={{ maxWidth: step?.layout?.width, margin: "0 auto" }}>
        <FormStep step={step} journeySlug={journeySlug} />
      </div>
    </>
  );
};

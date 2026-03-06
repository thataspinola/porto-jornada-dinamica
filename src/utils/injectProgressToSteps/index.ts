export const injectProgressToSteps = (journey: any) => {
  const totalSteps = journey.steps.length;
  const stepWeight = 100 / totalSteps;

  return {
    ...journey,
    steps: journey.steps.map((step: any, index: number) => {
      const initialValue = Math.round(index * stepWeight);
      const value = Math.round((index + 1) * stepWeight);

      return {
        ...step,
        progress: {
          initialValue,
          value,
        },
      };
    }),
  };
};

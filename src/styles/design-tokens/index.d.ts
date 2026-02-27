// src/types/design-tokens.d.ts
declare global {
  type RadiusToken = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";

  type SpacingToken =
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl";

  type BreakpointToken = "xs" | "sm" | "md" | "lg" | "xl";

  type GridContainerToken = BreakpointToken;

  type ShadowToken = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

  type FontSizeToken =
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl"
    | "8xl"
    | "9xl";

  type FontWeightToken = "light" | "regular" | "medium" | "semibold" | "bold";

  type FontStyleToken = "normal" | "italic";

  type FontFamilyToken = "primary" | "secondary";

  type ColorToken =
    | `insurance-${100 | 200 | 300 | 400 | 500 | 550 | 600 | 700 | 800 | 900}`
    | `banking-${100 | 200 | 300 | 400 | 500 | 550 | 600 | 700 | 800 | 900}`
    | `health-${100 | 200 | 300 | 400 | 500 | 550 | 600 | 700 | 800 | 900}`
    | `neutral-${0 | 100 | 200 | 300 | 400 | 500 | 550 | 600 | 700 | 800 | 900}`
    | `neutral-offwhite-${100 | 200 | 300}`
    | `violet-${300 | 400 | 500 | 900}`
    | `pink-${300 | 400 | 500 | 900}`
    | `yellow-${300 | 400 | 500 | 800 | 900}`
    | `green-${300 | 400 | 500 | 700 | 800 | 900}`
    | `red-${300 | 400 | 500 | 700 | 800 | 900}`
    | `alpha-${0 | 10 | 30 | 50 | 70}`
    | "alpha-transparent";
}

export { };


"use client";

import {
  CheckboxElement,
  ComposableCardElement,
  ConditionalWrapperElement,
  CpfInputElement,
  DropdownElement,
  NavigationElement,
  ParagraphElement,
  RadioElement,
  ServiceCallElement,
  SocialNamElement,
  TextInputElement,
  TextElement,
  TitleElement
} from '@/components/Elements';
import { journeyElementSchema } from "@/validation/schemaValidation/journey.schema";

import type {
  ElementRenderContext,
  ElementRenderer,
  JourneyElement,
} from "./types";

const renderers: {
  [K in JourneyElement["type"]]: ElementRenderer<
    Extract<JourneyElement, { type: K }>
  >;
} = {
  TEXT: (element) => <TextElement element={element} />,
  COMPOSABLE_CARD: (element, ctx) => (
   <ComposableCardElement
    element={element}
    renderElement={(child) => renderJourneyElement(journeyElementSchema.parse(child), ctx)}
   />
  ),
  CONDITIONAL_WRAPPER: (element, ctx) => (
   <ConditionalWrapperElement
    element={element}
    journeySlug={ctx.journeySlug}
    context={{ formErrors: ctx.errors, business: ctx.business, fields: ctx.fields, services: ctx.services }}
    renderElement={(child) => renderJourneyElement(journeyElementSchema.parse(child), ctx)}
   />
  ),
  TITLE: (element) => <TitleElement element={element} />,
  PARAGRAPH: (element) => <ParagraphElement element={element} />,
  TEXT_INPUT: (element, ctx) => (
    <TextInputElement element={element} control={ctx.control} />
  ),
  PHONE_INPUT: (element, ctx) => (
    <TextInputElement element={element} control={ctx.control} />
  ),
  CPF_INPUT: (element, ctx) => (
    <CpfInputElement element={element} control={ctx.control} />
  ),
  RADIO: (element, ctx) => (
    <RadioElement
      element={element}
      register={ctx.register}
      errors={ctx.errors}
    />
  ),
  SELECT: (element, ctx) => (
    <DropdownElement
      element={element}
      register={ctx.register}
      errors={ctx.errors}
    />
  ),
  CHECKBOX: (element, ctx) => (
    <CheckboxElement
      element={element}
      register={ctx.register}
      control={ctx.control}
      errors={ctx.errors}
    />
  ),
  SOCIAL_NAME: (element, ctx) => (
    <SocialNamElement
      element={element}
      register={ctx.register}
      control={ctx.control}
      errors={ctx.errors}
    />
  ),
  SERVICE_CALL: (element, ctx) => (
    <ServiceCallElement
      element={element}
      canProceed={ctx.canProceed}
      onCall={(serviceName, targetSlug) =>
        ctx.goNext({ type: "service", serviceName, targetSlug })
      }
    />
  ),
  NAVIGATION: (element, ctx) => (
    <NavigationElement
      element={element}
      onNavigate={(targetSlug) =>
        ctx.goNext({ type: "navigation", targetSlug })
      }
      bussines={ctx.business}
    />
  ),
};

export function renderJourneyElement(
  element: JourneyElement,
  ctx: ElementRenderContext,
) {
  const renderer = renderers[element.type] as ElementRenderer;
  return renderer(element, ctx) ?? null;
}

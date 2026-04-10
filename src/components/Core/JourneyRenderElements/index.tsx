"use client";

import {
  CheckboxElement,
  CpfInputElement,
  DropdownElement,
  NavigationElement,
  ParagraphElement,
  RadioElement,
  ServiceCallElement,
  SocialNamElement,
  TextInputElement,
  TitleElement
} from '@/components/Elements';

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
      business={ctx.business}
      canProceed={ctx.canProceed}
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

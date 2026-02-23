import type { Step } from "@/types";

type JourneyProps = { [slug: string]: { steps: Step[] } };

export const journeis: JourneyProps = {
  "financiamento-de-veiculos": {
    steps: [
      {
        id: "step_1",
        slug: "cpf",
        kind: "shortform",
        layout: {
          width: "600px",
          header: { goBackLink: "/", hasShoppingCart: false },
          progressbar: { start: 0, end: 20 },
        },
        elements: [
          {
            id: "title",
            type: "typography",
            layout: { marginTop: "40px", marginBottom: "32px" },
            uiProps: {
              variant: "title4",
              as: "h3",
              weight: "bold",
              children: "Qual é o seu CPF?",
            },
          },
          {
            id: "paragraph",
            type: "typography",
            layout: { marginBottom: "32px" },
            uiProps: {
              variant: "body1",
              as: "p",
              children:
                "Precisamos dele para confirmar se o financiamento está disponível para você.",
            },
          },
          {
            id: "cpf_input",
            type: "cpf",
            layout: { marginBottom: "32px" },
            uiProps: {
              label: "Digite seu CPF",
              placeholder: "000.000.000-00",
              name: "cpf",
              variant: "default",
              width: "fluid",
            },
            action: {
              service: "elegibilityService",
              trigger: "onChange",
            },
            rules: [{ type: "required", message: "CPF é obrigatório" }],
          },
          {
            id: "optin_marketing",
            type: "checkbox",
            layout: { marginBottom: "40px" },
            uiProps: {
              label:
                "Tenho interesse em receber comunicação com condições especiais e ofertas de Produtos e Serviços Porto.",
              variant: "default",
            },
            action: {
              service: "verificar_elegibilidade_optin",
              trigger: "onInit",
            },
            dependsOn: {
              field: "optin_marketing",
              value: "ELIGIBLE",
              operator: "===",
            },
          },
          {
            id: "btn_next_1",
            type: "button",
            uiProps: {
              children: "Continuar",
              styles: "primary",
              variant: "insurance",
              width: "fluid",
            },
          },
        ],
        action: {
          type: "SERVICE_CALL",
          service: "elegibilityService",
          onSuccess: {
            type: "NAVIGATE",
            target: "/contrate/financiamento-de-veiculos/placa",
          },
        },
      },
      {
        id: "step_2",
        slug: "placa",
        kind: "shortform",
        layout: {
          width: "600px",
          header: {
            goBackLink: "/contrate/financiamento-de-veiculos/cpf",
            hasShoppingCart: false,
          },
          progressbar: { start: 20, end: 40 },
        },
        elements: [
          {
            id: "title",
            type: "typography",
            layout: { marginTop: "40px", marginBottom: "32px" },
            uiProps: {
              variant: "title4",
              as: "h3",
              weight: "bold",
              children: "Qual veículo você quer financiar?",
            },
          },
          {
            id: "license",
            type: "licensePlate",
            layout: { marginBottom: "32px" },
          },
          {
            id: "btn_next_1",
            type: "link",
            layout: { marginBottom: "8px" },
            uiProps: {
              children: "Não sei a placa",
              styles: "ghost",
              href: "/contrate/financiamento-de-veiculos/nao-sei-a-placa",
            },
          },
          {
            id: "btn_next_2",
            type: "button",
            uiProps: {
              children: "Continuar",
              styles: "primary",
              variant: "insurance",
              width: "fluid",
            },
          },
        ],
        action: {
          type: "NAVIGATE",
          target: "/contrate/financiamento-de-veiculos/simulador-finaceiro",
        },
      },
      {
        id: "step_4",
        slug: "simulador-finaceiro",
        kind: "shortform",
        layout: {
          width: "600px",
          header: {
            goBackLink: "/contrate/financiamento-de-veiculos/placa",
            hasShoppingCart: false,
          },
          progressbar: { start: 40, end: 60 },
        },
        elements: [
          {
            id: "title",
            type: "typography",
            layout: { marginTop: "40px", marginBottom: "32px" },
            uiProps: {
              variant: "title4",
              as: "h3",
              weight: "bold",
              color: "insurance-900",
              children: "Vamos simular o financiamento",
            },
          },
          {
            id: "simulator",
            type: "financialSimulator",
          },
        ],
      },
    ],
  },
};

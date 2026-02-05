import type { JourneyConfig } from "../types";

export const journeyWithSingleStepMock: JourneyConfig = {
  slug: "equipamentos",
  title: "Equipamentos Portateis",
  steps: [
    {
      title: "Dados do equipamento",
      subtitle: "Selecione o equipamento que deseja fazer o seguro",
      slug: "dados-do-equipamentos",
      path: "/loja/equipamentos/dados-do-equipamento",
      kind: "form",
      seo: {
        title: "Dados do equipamentos",
        description: "Informe tipo do equipamento, marca e modelo",
        canonical: "/loja/equipamentos/dados-do-equipamento",
      },
      elements: [
        {
          id: "tipo",
          label: "Tipo do equipamento",
          type: "select",
          required: true,
          options: [
            {
              label: "Celular",
              value: "celular",
            },
            {
              label: "Notebook",
              value: "notebook",
            },
            {
              label: "Tablet",
              value: "tablet",
            },
          ],
        },
        {
          id: "marca",
          label: "Marca do equipamento",
          type: "select",
          required: true,
          options: [
            {
              label: "Apple",
              value: "apple",
            },
            {
              label: "Motorola",
              value: "motorola",
            },
            {
              label: "Xiaomi",
              value: "xiaomi",
            },
          ],
        },
        {
          id: "modelo",
          label: "Modelo",
          type: "text",
          required: true,
        },
      ],
      link: {
        back: "",
        next: "",
      },
      validators: [],
    },
  ],
};

export const journeyWithMultipleStepMock: JourneyConfig = {
  slug: "equipamentos",
  title: "Equipamentos Portáteis",
  steps: [
    {
      title: "Dados do equipamento",
      subtitle: "Selecione o equipamento que deseja fazer o seguro",
      slug: "dados-do-equipamentos",
      path: "/loja/equipamentos/dados-do-equipamento",
      kind: "form",
      seo: {
        title: "Dados do equipamentos",
        description: "Informe tipo do equipamento, marca e modelo",
        canonical: "/loja/equipamentos/dados-do-equipamento",
      },
      elements: [
        {
          id: "tipo",
          type: "select",
          validation: { required: true },
          uiProps: {
            label: "Tipo do equipamento",
            placeholder: "Selecione o tipo",
            options: [
              { label: "Celular", value: "celular" },
              { label: "Notebook", value: "notebook" },
              { label: "Tablet", value: "tablet" },
            ],
          },
        },
        {
          id: "marca",
          type: "select",
          validation: { required: true },
          uiProps: {
            label: "Marca do equipamento",
            placeholder: "Selecione a marca",
            options: [
              { label: "Apple", value: "apple" },
              { label: "Motorola", value: "motorola" },
              { label: "Xiaomi", value: "xiaomi" },
            ],
          },
        },
        {
          id: "modelo",
          type: "text",
          validation: { required: true },
          uiProps: {
            label: "Modelo",
            placeholder: "Digite o modelo",
          },
        },
      ],
      link: { back: "", next: "" },
      validators: [],
    },
    {
      title: "Dados do usuário",
      subtitle: "Insira seus dados principais",
      slug: "dados-do-usuario",
      path: "/loja/equipamentos/dados-do-usuario",
      kind: "longform",
      seo: {
        title: "Dados do usuário",
        description: "Informe CPF, telefone e data de nascimento",
        canonical: "/loja/equipamentos/dados-do-usuario",
      },
      elements: [
        {
          id: "Title",
          type: "typography",
          uiProps: {
            variant: "h3",
            children: "Identificação",
          },
        },
        {
          id: "cpf",
          type: "cpf", // O motor pode usar isso para aplicar a máscara da Ocean
          validation: { required: true, pattern: "cpf" },
          uiProps: {
            label: "CPF",
            placeholder: "000.000.000-00",
          },
        },
        {
          id: "telefone",
          type: "phone",
          validation: { required: true },
          uiProps: {
            label: "Telefone",
            placeholder: "(11) 99999-9999",
          },
        },
        {
          id: "modelo_confirmacao", // Evitei ID duplicado
          type: "text",
          validation: { required: true },
          uiProps: {
            label: "Confirme o modelo",
          },
        },
      ],
      link: { back: "", next: "" },
      validators: [],
    },
  ],
};

export const journeis = {
  'financiamento-de-veiculos': {
    "meta": {
      "journeyId": "financiamento-porto",
      "tenant": "porto-bank",
    },
    "seo": {
      "title": "Simulador de Financiamento | Porto Bank",
      "description": "Simule seu financiamento de veículo de forma rápida e segura com a Porto.",
      "slug": "simulador-veiculos",
      "canonical": "https://www.porto.com.br/financiamento-veiculos",
      "index": true
    },
    "steps": [
      {
        "id": "step_1_identificacao",
        "slug": "identificacao",
        "title": "Identificação",
        "elements": [
          {
            "id": "txt_intro",
            "component": "typography",
            "props": { "variant": "h2", "children": "Vamos começar?", "align": "left" }
          },
          {
            "id": "txt_sub",
            "component": "typography",
            "props": { "variant": "body1", "children": "Informe seu CPF para verificarmos ofertas pré-aprovadas." }
          },
          {
            "id": "cpf_input",
            "component": "cpf",
            "props": { "label": "Digite seu CPF", "placeholder": "000.000.000-00", "name": "documento" },
            "rules": [
              { "type": "required", "message": "O CPF é obrigatório para a simulação." },
              { "type": "cpf", "message": "Este CPF não parece válido." }
            ]
          },
          {
            "id": "btn_next_1",
            "component": "button",
            "props": { "children": "Continuar", "variant": "primary", "fullWidth": true },
            "action": {
              "type": "SUBMIT",
              "url": "/api/v1/finance/check-eligibility",
              "method": "POST",
              "onSuccess": { "type": "NAVIGATE_NEXT" },
              "onError": { "type": "SHOW_MODAL", "props": { "title": "Aviso", "text": "Infelizmente não encontramos ofertas para este CPF." } }
            }
          }
        ]
      },
      {
        "id": "step_2_veiculo",
        "slug": "dados-veiculo",
        "title": "Sobre o Veículo",
        "elements": [
          {
            "id": "placa_input",
            "component": "text",
            "props": { "label": "Placa do Veículo (Opcional)", "placeholder": "AAA-0000", "mask": "AAA-0X00", "name": "placa" },
            "rules": [
              { "type": "regex", "value": "^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$", "message": "Placa fora do padrão Mercosul/Brasil." }
            ]
          },
          {
            "id": "sabe_modelo_radio",
            "component": "radio",
            "props": {
              "label": "Já sabe o modelo?",
              "name": "knows_model",
              "options": [{ "label": "Sim", "value": "S" }, { "label": "Não", "value": "N" }]
            },
            "rules": [{ "type": "required", "message": "Selecione uma opção." }]
          },
          {
            "id": "marca_select",
            "component": "select",
            "props": {
              "label": "Marca",
              "name": "marca",
              "options": [{ "label": "Toyota", "value": "toyota" }, { "label": "Honda", "value": "honda" }]
            },
            "rules": [
              {
                "type": "conditional",
                "condition": { "field": "sabe_modelo_radio", "value": "S" },
                "rule": { "type": "required", "message": "Selecione a marca." }
              }
            ]
          },
          {
            "id": "btn_next_2",
            "component": "button",
            "props": { "children": "Próximo Passo", "variant": "primary" },
            "action": { "type": "NAVIGATE_NEXT" }
          }
        ]
      },
      {
        "id": "step_3_pessoais",
        "slug": "dados-pessoais",
        "title": "Dados Pessoais",
        "elements": [
          {
            "id": "nome_input",
            "component": "text",
            "props": { "label": "Nome Completo", "name": "nome_completo" },
            "rules": [
              { "type": "required", "message": "Precisamos do seu nome." },
              { "type": "minLength", "value": 10, "message": "Por favor, digite o nome completo." }
            ]
          },
          {
            "id": "renda_input",
            "component": "currency",
            "props": { "label": "Renda Mensal Estimada", "name": "renda", "prefix": "R$" },
            "rules": [
              { "type": "required", "message": "A renda é necessária para o cálculo de parcelas." },
              { "type": "min", "value": 1200, "message": "Renda mínima para simulação é R$ 1.200." }
            ]
          },
          {
            "id": "email_input",
            "component": "email",
            "props": { "label": "E-mail para contato", "name": "email" },
            "rules": [
              { "type": "required", "message": "O e-mail é obrigatório." },
              { "type": "email", "message": "E-mail inválido." }
            ]
          },
          {
            "id": "btn_submit_lead",
            "component": "button",
            "props": { "children": "Finalizar Simulação", "variant": "primary" },
            "action": {
              "type": "SUBMIT_FINAL",
              "url": "/api/v1/finance/capture-lead",
              "method": "POST",
              "onSuccess": {
                "type": "REDIRECT_EXTERNAL",
                "url": "https://porto.com.br/obrigado?leadId={{id}}"
              },
              "onError": {
                "type": "SHOW_MODAL",
                "props": { "title": "Erro", "text": "Houve um problema ao salvar seus dados. Tente novamente." }
              }
            }
          }
        ]
      }
    ]
  }
}

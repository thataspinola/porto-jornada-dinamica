
export const journeis = {
  "financiamento-de-veiculos": {
    steps: [
      {
        id: "step_1",
        slug: "cep",
        kind: "shortform",
        seo: {
          title: "financiamento de veículos | Porto",
          description: 'Financiamento de veículos',
          keywords: 'financiamento veicular, financiamento de veiculo, financiamento de veiculo porto',
          canonical: 'https://portoseguro.com.br/contrate/financiamento-de-veiculos/cep',
        },
        layout: {
          width: "600px",
          progressbar: {
            start: 0,
            end: 20,
          },
        },
        elements: [
          {
            id: "title",
            type: "typography",
            layout: {
              marginTop: '40px',
              marginBottom: '32px'
            },
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
            layout: {
              marginBottom: '32px'
            },
            uiProps: {
              variant: "body1",
              as: "p",
              weight: "",
              children:
                "Precisamos dele para confirmar se o financiamento está disponível para você.",
            },
          },
          {
            id: "cpf_input",
            type: "cpf",
            layout: {
              marginBottom: '32px'
            },
            uiProps: {
              label: "Digite seu CPF",
              placeholder: "000.000.000-00",
              name: "cpf",
              variant: "default",
              width: "fluid",
            },
            rules: [
              { type: 'required', message: '' }
            ]
          },
          {
            id: "marketingCommunication",
            type: "checkbox",
            layout: {
              marginBottom: '40px'
            },
            uiProps: {
              label:
                "Tenho interesse em receber comunicação com condições especiais e ofertas de Produtos e Serviços Porto.",
              variant: "default",
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
          type: 'SUBMIT',
          service: 'consultar_cpf',
          onSuccess: {
            type: 'NAVIGATE',
            target: '/contrate/financiamento-de-veiculos/placa'
          }
        }
      },
      {
        id: "step_2",
        slug: "placa",
        kind: "shortform",
        seo: {
          title: "financiamento de veículos | Porto",
          description: 'Financiamento de veículos',
          keywords: 'financiamento veicular, financiamento de veiculo, financiamento de veiculo porto',
          canonical: 'https://portoseguro.com.br/contrate/financiamento-de-veiculos/cep',
        },
        layout: {
          width: "600px",
          progressbar: {
            start: 0,
            end: 20,
          },
        },
        elements: [
          {
            id: "title",
            type: "typography",
            layout: {
              marginTop: '40px',
              marginBottom: '32px'
            },
            uiProps: {
              variant: "title4",
              as: "h3",
              weight: "bold",
              children: "Sobre o seu veículo",
            },
          },
          {
            id: "radio_input",
            type: "radio",
            layout: {
              marginBottom: '32px'
            },
            uiProps: {
              label: "Já sabe qual modelo quer financiar?",
              name: "financiamento_",
              options: [
                {
                  description: "Sim"
                },
                {
                  description: "Não"
                }
              ]
            },
            rules: [
              { type: 'required', message: '' }
            ]
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
          type: 'SUBMIT',
          service: 'consultar_cpf',
          onSuccess: {
            type: 'NAVIGATE',
            target: '/contrate/financiamento-de-veiculos/placa'
          }
        }
      },
    ],
  },
};

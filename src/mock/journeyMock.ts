
export const journeis = {
  "financiamento-de-veiculos": {
    seo: {
      title: "financiamento de veículos | Porto",
      description: 'Financiamento de veículos',
      keywords: 'financiamento veicular, financiamento de veiculo, financiamento de veiculo porto',
      canonical: 'https://portoseguro.com.br/contrate/financiamento-de-veiculos',
    },
    steps: [
      {
        id: "step_1",
        slug: "cpf",
        kind: "shortform",
        layout: {
          width: "600px",
          header: {
            goBackLink: '/',
            hasShoppingCart: false
          },
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
          type: 'SERVICE_CALL',
          service: 'elegibilityService',
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
          header: {
            goBackLink: '/contrate/financiamento-de-veiculos/cpf',
            hasShoppingCart: false
          },
          progressbar: {
            start: 20,
            end: 40,
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
              children: "Qual veículo você quer financiar?",
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
            id: 'license',
            type: 'licensePlate',
            layout: {
              marginBottom: '32px'
            },
            uiProps: {
            },
          },
          {
            id: "btn_next_1",
            type: "link",
            layout: {
              marginBottom: '8px'
            },
            uiProps: {
              children: "Não sei a placa",
              styles: "ghost",
              variant: "insurance",
              width: "fluid",
              href: '/contrate/financiamento-de-veiculos/nao-sei-a-placa',
              target: '_self'
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
          type: 'SUBMIT',
          service: 'consultar_cpf',
          onSuccess: {
            type: 'NAVIGATE',
            target: '/contrate/financiamento-de-veiculos/simulador-finaceiro'
          }
        }
      },
      {
        id: "step_3",
        slug: "nao-sei-a-placa",
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
            start: 20,
            end: 40,
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
              defaultValue: 'Sim',
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
              { type: 'email', message: '' },
              { type: 'required', message: '' },
            ]
          },
          {
            id: "ano_de_fabricação",
            type: "dropdown",
            layout: {
              marginBottom: '32px'
            },
            uiProps: {
              label: 'Ano de fabricação',
              options: [
                {
                  label: '2010',
                  value: '2010'
                },
                {
                  label: '2011',
                  value: '2011'
                },
                {
                  label: '2012',
                  value: '2012'
                },
                {
                  label: '2013',
                  value: '2013'
                },
              ]
            },
            dependsOn: {
              field: 'radio_input',
              operator: '===',
              value: 'Sim',
            }
          }, {
            id: "veiculo_0",
            type: "checkbox",
            layout: {
              marginBottom: '40px'
            },
            uiProps: {
              label:
                "Veículo 0km",
              variant: "default",
            },
            dependsOn: {
              field: 'radio_input',
              operator: '===',
              value: 'Sim',
            }
          },
          {
            id: "ano_de_modelo",
            type: "dropdown",
            layout: {
              marginBottom: '32px'
            },
            uiProps: {
              label: 'Ano de modelo',
              options: [
                {
                  label: '2010',
                  value: '2010'
                },
                {
                  label: '2011',
                  value: '2011'
                },
                {
                  label: '2012',
                  value: '2012'
                },
                {
                  label: '2013',
                  value: '2013'
                },
              ]
            },
            dependsOn: {
              field: 'radio_input',
              operator: '===',
              value: 'Sim',
            }
          },
          {
            id: "marca",
            type: "dropdown",
            layout: {
              marginBottom: '32px'
            },
            uiProps: {
              label: 'Marca',
              options: [
                {
                  label: 'Honda',
                  value: 'honda'
                },
                {
                  label: 'Fiat',
                  value: 'fiat'
                },
                {
                  label: 'Ford',
                  value: 'ford'
                },
              ]
            },
            dependsOn: {
              field: 'radio_input',
              operator: '===',
              value: 'Sim',
            }
          },
          {
            id: 'modelo',
            type: 'text',
            layout: {
              marginBottom: '32px'
            },
            uiProps: {
              label: 'Modelo'
            },
            dependsOn: {
              field: 'radio_input',
              operator: '===',
              value: 'Sim',
            }
          },
          {
            id: 'valor_veiculo',
            type: 'currency',
            layout: {
              marginBottom: '32px'
            },
            uiProps: {
              label: 'Valor do veículo'
            },
            dependsOn: {
              field: 'radio_input',
              operator: '===',
              value: 'Não',
            }
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
            target: '/contrate/financiamento-de-veiculos/simulador-finaceiro'
          }
        }
      },
      {
        id: "step_4",
        slug: "simulador-finaceiro",
        kind: "shortform",
        layout: {
          width: "600px",
          header: {
            goBackLink: '/contrate/financiamento-de-veiculos/placa',
            hasShoppingCart: false
          },
          progressbar: {
            start: 40,
            end: 60,
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
              color: 'insurance-900',
              children: "Vamos simular o financiamento",
            },
          },
          {
            id: 'simulator',
            type: 'financialSimulator',
          }
        ]
      }
    ],
  },
};

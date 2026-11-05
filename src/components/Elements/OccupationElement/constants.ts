export const OCCUPATION_FIELD_NAMES = {
  occupation: 'occupationCode',
  occupationIncome: 'netSalary',
  occupationProfession: 'occupationProfession'
} as const

type Option = { value: string; label: string }

export const OCCUPATION_OPTIONS: Option[] = [
  { value: 'OCC_RETIRED', label: 'Aposentado(a)' },
  { value: 'OCC_SALARY_EMPLOYED', label: 'Assalariado(a)' },
  { value: 'OCC_SELF_EMPLOYED', label: 'Autônomo(a)' },
  { value: 'OCC_ENTREPRENEUR', label: 'Empresário(a)' }
]

const SALARY_EMPLOYED_PROFESSIONS: Option[] = [
  {
    value: 'administrador / economista',
    label: 'Administrador / Economista'
  },
  { value: 'analista', label: 'Analista' },
  { value: 'consultor', label: 'Consultor' },
  { value: 'diretor de empresa', label: 'Diretor de Empresa' },
  {
    value: 'funcionário de empresas públicas',
    label: 'Funcionário de Empresas Públicas'
  },
  { value: 'gerente', label: 'Gerente' },
  { value: 'operador em geral', label: 'Operador em Geral' },
  {
    value: 'outras profissões da indústria',
    label: 'Outras Profissões da Indústria'
  },
  {
    value: 'outras profissões no comércio',
    label: 'Outras Profissões no Comércio'
  },
  { value: 'professor', label: 'Professor' },
  { value: 'promotor', label: 'Promotor' },
  {
    value: 'vendedor / representante / intermediário',
    label: 'Vendedor / Representante / Intermediário'
  },
  { value: 'outros', label: 'Outros' }
]

const SELF_EMPLOYED_PROFESSIONS: Option[] = [
  { value: 'advogado', label: 'Advogado' },
  { value: 'arquiteto', label: 'Arquiteto' },
  { value: 'engenheiro', label: 'Engenheiro' },
  {
    value: 'médico e cirurgião dentista',
    label: 'Médico e Cirurgião Dentista'
  },
  { value: 'professor', label: 'Professor' },
  { value: 'outros', label: 'Outros' }
]

export const PROFESSIONS_BY_OCCUPATION: Record<string, Option[]> = {
  OCC_SELF_EMPLOYED: SELF_EMPLOYED_PROFESSIONS,
  OCC_SALARY_EMPLOYED: SALARY_EMPLOYED_PROFESSIONS
}

export const OCCUPATIONS_WITH_PROFESSION = Object.keys(
  PROFESSIONS_BY_OCCUPATION
)

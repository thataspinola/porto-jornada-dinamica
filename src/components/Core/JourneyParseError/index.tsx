import { Typography } from '@porto-stack/ui'

import s from './styles.module.scss'

export type JourneyParseIssue = {
  path: PropertyKey[]
  message: string
}

type JourneyParseErrorProps = {
  slug: string
  issues: JourneyParseIssue[]
}

export function JourneyParseError({ slug, issues }: JourneyParseErrorProps) {
  return (
    <main className={s.container}>
      <Typography as="h1" variant="title3" weight="bold">
        Falha ao validar a jornada
      </Typography>

      <Typography as="p" variant="body1" color="neutral-700">
        A jornada <code className={s.code}>{slug || '/'}</code> não passou na
        validação do schema. Corrija os pontos abaixo no JSON correspondente em{' '}
        <code className={s.code}>public/jsonContent/</code>.
      </Typography>

      <Typography as="p" variant="caption" color="neutral-600">
        Esta tela aparece apenas em <strong>dev</strong> e{' '}
        <strong>staging</strong>. Em produção, o usuário é redirecionado para a
        página de erro padrão.
      </Typography>

      <ul className={s.issues}>
        {issues.map((issue, index) => (
          <li key={index} className={s.issue}>
            <code className={s.path}>{issue.path.join('.') || '<root>'}</code>
            <span className={s.message}>{issue.message}</span>
          </li>
        ))}
      </ul>
    </main>
  )
}

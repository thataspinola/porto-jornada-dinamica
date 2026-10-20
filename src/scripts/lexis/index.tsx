/** biome-ignore-all lint/correctness/useHookAtTopLevel: <nesse caso precisamos do hook top level> */
/** biome-ignore-all lint/security/noGlobalEval: <nesse caso precisamos do eval> */
'use client'

import Head from 'next/head'
import { useEffect } from 'react'

/**
 * @param {string} sessionId - O parâmetro sessionId precisa gerado
 * @param {string} organizationId - O parâmetro organizationId é único de cada aplicação
 *
 * @returns {JSX.Element} Retorna um componente JSX
 *
 * @example
 * <TolkitLexis sessionId="xxxxxxx" organizationId="xxxxxxx" />
 */

interface TolkitLexisProps {
  sessionId: string
  organizationId: string
}

export const TolkitLexis = ({
  sessionId,
  organizationId,
}: TolkitLexisProps) => {
  if (typeof window === 'undefined') return

  useEffect(() => {
    if (sessionId) {
      const url = `https://apicorporativops.portoseguro.com.br/fp/tags?org_id=${organizationId}&session_id=${sessionId}`
      const styles =
        'width: 100px; height: 100px; border: 0; position: absolut; top: -5000px'

      const iframeNode = document.createElement('iframe')
      iframeNode.src = url
      iframeNode.setAttribute('style', styles)

      const noscriptNode = document.createElement('noscript')
      noscriptNode.appendChild(iframeNode)

      document.body?.appendChild(noscriptNode)
    }
  }, [sessionId, organizationId])

  useEffect(() => {
    if (sessionId) {
      // @ts-expect-error
      if (typeof threatmetrix !== 'undefined') {
        const code = `
          var session_id = "${sessionId}"
          threatmetrix.profile("apicorporativops.portoseguro.com.br", "${organizationId}", "${sessionId}")
        `

        const textNode = document.createTextNode(
          code.replace(/\$\{(.*?)\}/g, (_: string, g: any) => eval(g))
        )

        const scriptNode = document.createElement('script')
        scriptNode.type = 'text/javascript'
        scriptNode.appendChild(textNode)

        document.body?.appendChild(scriptNode)
      }
    }
  }, [sessionId, organizationId])

  return (
    <Head>
      <script>
        {`(function(){
          /*
           * SCRIPT MINIFICADO ORIGINAL:
           * As linhas 64 a 72 estão parcialmente
           * cortadas na terceira imagem.
           *
           * Início visível:
           *
           * var g=this||self;
           * function z(){return"undefined"===typeof Date.now?
           * (new Date).getTime():Date.now()}
           *
           * O restante precisa ser obtido do
           * arquivo original para preservar
           * seu funcionamento.
           */
        })()`}
      </script>
    </Head>
  )
}

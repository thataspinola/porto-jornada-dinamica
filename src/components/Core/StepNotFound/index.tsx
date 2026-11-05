import { Typography } from '@porto-stack/ui'
import Link from 'next/link'

export function StepNotFound() {
  return (
    <div>
      <main
        style={{
          maxWidth: '600px',
          height: '100vh',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px'
        }}>
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <title>Triangulo vermerlho</title>
          <path
            d="M39.5667 33.5676L23.1 3.10091C22.4667 1.93424 21.3 1.26758 20 1.26758C18.7 1.26758 17.5333 1.96758 16.9 3.10091L0.433344 33.5676C-0.166656 34.6676 -0.133322 35.9676 0.500011 37.0342C1.13334 38.1009 2.26668 38.7676 3.53334 38.7676H36.4667C37.7333 38.7676 38.8667 38.1342 39.5 37.0342C40.1333 35.9676 40.1667 34.6676 39.5667 33.5676ZM38.0667 36.2009C37.7333 36.7676 37.1333 37.1009 36.4667 37.1009H3.53334C2.86668 37.1009 2.26668 36.7676 1.93334 36.2009C1.60001 35.6342 1.56668 34.9342 1.90001 34.3676L18.3667 3.90091C18.7 3.30091 19.3 2.93424 20 2.93424C20.7 2.93424 21.3 3.30091 21.6333 3.90091L38.1 34.3676C38.4 34.9342 38.4 35.6342 38.0667 36.2009Z"
            fill="#FF5A40"
          />
          <path
            d="M20 28.6009C20.4667 28.6009 20.8333 28.2342 20.8333 27.7676V14.3676C20.8333 13.9009 20.4667 13.5342 20 13.5342C19.5333 13.5342 19.1667 13.9009 19.1667 14.3676V27.7676C19.1667 28.2342 19.5333 28.6009 20 28.6009Z"
            fill="#FF5A40"
          />
          <path
            d="M20 31.0342C19.3 31.0342 18.7333 31.6009 18.7333 32.2676C18.7333 32.9342 19.3 33.5342 20 33.5342C20.7 33.5342 21.2667 32.9676 21.2667 32.2676C21.2667 31.5676 20.7 31.0342 20 31.0342Z"
            fill="#FF5A40"
          />
        </svg>

        <Typography
          variant="title4"
          weight="bold"
          style={{ textAlign: 'center' }}>
          Ops, página não encontrada
        </Typography>
        <Typography
          variant="body1"
          color="neutral-700"
          style={{ textAlign: 'center' }}>
          Você pode fazer a sua busca em nossa página inicial.
        </Typography>
        <Link href="/">Ir para a página inicial</Link>
      </main>
    </div>
  )
}

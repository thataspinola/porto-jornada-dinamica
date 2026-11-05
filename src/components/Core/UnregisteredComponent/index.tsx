import type React from 'react'

interface UnregisteredComponentProps {
  type: string
  data?: unknown
}

export const UnregisteredComponent: React.FC<UnregisteredComponentProps> = ({
  type,
  data
}) => {
  const containerStyle: React.CSSProperties = {
    padding: '16px',
    border: '2px dashed #f44336',
    borderRadius: '8px',
    backgroundColor: '#fff8f7',
    color: '#d32f2f',
    fontFamily: 'sans-serif',
    margin: '10px 0'
  }

  const titleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '0 0 8px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }

  const detailsStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#555',
    backgroundColor: '#f5f5f5',
    padding: '8px',
    borderRadius: '4px',
    overflowX: 'auto'
  }

  return (
    <div
      style={containerStyle}
      title="Componente não registrado para a jornada">
      <h3 style={titleStyle}>⚠️ Tipo de Componente Desconhecido</h3>
      <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
        A jornada tentou renderizar um elemento do tipo{' '}
        <strong>"{type}"</strong>, mas nenhum renderizador correspondente foi
        encontrado no sistema.
      </p>

      {data && (
        <div>
          <strong style={{ fontSize: '12px', color: '#888' }}>
            DADOS BRUTOS (DEBUG):
          </strong>
          <pre style={detailsStyle}>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

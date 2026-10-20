import Script from 'next/script'

const GTM_CODE = 'GTM-5XDMSHB'

export const GTM = () => {
  return (
    <>
      <Script strategy='afterIteractive' id='gtm'>
        {`...`}
			</Script>
			<noscript>
				<iframe src={`https://googletagmanager.com/ns.html?id=${GTM_CODE}`} height="0" width="0" style={{display: 'none', visibility: 'hidden'}}></iframe>
			</noscript>
    </>
  )
}

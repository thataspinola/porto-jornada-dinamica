import Script from 'next/script'

export const VWO = () => {
  return (
    <>
      <Script strategy='beforeInteractive'>{`
				window._vwo_code||function(){var account_id=740288,version=2.1,settings_tolerance=2e3,hide_element_style="body",hide_element_style="opacity:0 !important;filter:alpha(opacity=0) !important;background:none !important;transition:none !important;",f=false,w=window,d=document,v=d.QuerySelector("#vwoCode"),ck="_vwo_"+account_id+"_settings",cc={};try{var c=JSON.parse(localStorage.getItem("_vwo_"+account_id+"_config"));cc=c&&typeof c==="object"?c.{}}catch(e){}var stT=cc.stT==="session"?w.sessionStorage:w.localStorage;code={nonce:v&&v.nonce,use_existing_jquery:function(){return typeof use_existing_jquery!=="undefined"?use_existing_jquery:undefined},library_tolerance:function(){..}}} // TODO: precisa terminar
			`}</Script>
    </>
  )
}

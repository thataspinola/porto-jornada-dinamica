interface CustomData {
  page: {
    id: string
    name: string
    category: string
    vertical: string
    porto_product: string
    funnel: string
    funnel_step: number
    porto_subproduct: string
  }
  site: {
    brand: string
    portal: string
    versao: string
  }
  user: {
    id: string
    client_bcp: string
    logged: boolean
    product_login: 'produto' | 'sem-produto'
  }
}

interface Window {
  dataLayer: unknown[]
  customData?: CustomData
  grecaptcha?: {
    enterprise?: {
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
  webkit?: {
    messageHandlers?: {
      portoNativeBridge?: {
        postMessage: (payload: unknown) => void
      }
    }
  }
  AndroidBridge?: {
    postMessage: (payload: string) => void
  }
}

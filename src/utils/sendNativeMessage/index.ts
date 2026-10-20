type NativePayload = {
  action: string
}

export function sendNativeMessage(payload: NativePayload) {
  const webkitHandler = window.webkit?.messageHandlers?.portoNativeBridge

  if (webkitHandler?.postMessage) {
    webkitHandler.postMessage(payload)
    return
  }

  if (window.AndroidBridge?.postMessage) {
    window.AndroidBridge.postMessage(JSON.stringify(payload))
    return
  }

  console.warn('No Android/iOS bridge.', payload)
}

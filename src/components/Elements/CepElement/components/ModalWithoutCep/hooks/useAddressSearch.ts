import { useState } from 'react'

export type AddressSearch = {
  state: string
  city: string
  address: string
}

export function useAddressSearch() {
  const [addressSearch, setAddressSearch] = useState<AddressSearch | null>(null)

  function clearAddressSearch() {
    setAddressSearch(null)
  }

  return {
    addressSearch,
    setAddressSearch,
    clearAddressSearch
  }
}

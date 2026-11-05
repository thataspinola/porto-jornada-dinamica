import { useCallback, useState } from 'react'

export function useModalState() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  return {
    isModalOpen,
    setIsModalOpen,
    handleOpenModal,
    handleCloseModal
  }
}

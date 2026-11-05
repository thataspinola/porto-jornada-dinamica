import { IconEdit } from '@porto-stack/icons'
import { Tooltip } from '@porto-stack/ui'
import {
  type ComponentProps,
  createContext,
  useCallback,
  useContext,
  useState
} from 'react'

import { Input } from '@/components/UI'

import styles from './EditableInput.module.scss'

type EditableInputContextData = {
  isEditing?: boolean
  isLoading?: boolean
  onEdit?: () => void
}

const EditableInputContext = createContext({} as EditableInputContextData)

type EditableInputRootProps = ComponentProps<'div'> & {
  isLoading?: boolean
  isEditing?: boolean
  isEditingChange?: (isEditing: boolean) => void
}

function EditableInputRoot({
  isLoading = false,
  isEditing: initialIsEditing = false,
  isEditingChange,
  ...props
}: EditableInputRootProps) {
  const [isEditing, setIsEditing] = useState(initialIsEditing)

  const handleEdit = useCallback(() => {
    setIsEditing(true)
    isEditingChange?.(true)
  }, [isEditingChange])

  return (
    <EditableInputContext.Provider
      value={{ isEditing, isLoading, onEdit: handleEdit }}>
      <div className={styles.container} {...props} />
    </EditableInputContext.Provider>
  )
}

type EditableInputEditProps = ComponentProps<typeof Tooltip.Trigger> & {
  label: string
}

function EditableInputEdit({ label, ...props }: EditableInputEditProps) {
  const { isEditing, isLoading, onEdit } = useContext(EditableInputContext)

  if (isEditing || isLoading) {
    return null
  }

  return (
    <Tooltip.Root delayDuration={0}>
      <Tooltip.Trigger asChild {...props}>
        <button type="button" className={styles.editButton} onClick={onEdit}>
          <IconEdit size={20} />
        </button>
      </Tooltip.Trigger>
      <Tooltip.Content>
        <Tooltip.Description>{label}</Tooltip.Description>
      </Tooltip.Content>
    </Tooltip.Root>
  )
}

function EditableInputField({
  isLoading,
  ...props
}: ComponentProps<typeof Input>) {
  const { isLoading: contextIsLoading, isEditing } =
    useContext(EditableInputContext)

  return (
    <Input
      {...props}
      readOnly={!isEditing}
      isLoading={isLoading || contextIsLoading}
    />
  )
}

export const EditableInput = {
  Root: EditableInputRoot,
  Field: EditableInputField,
  Edit: EditableInputEdit
}

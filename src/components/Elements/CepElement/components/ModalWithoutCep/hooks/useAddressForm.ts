import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import z from 'zod'

const formSchema = z.object({
  address: z.string().nonempty('Digite o nome da rua, avenida ou alameda.'),
  city: z.string().nonempty('Selecione uma cidade.'),
  state: z.string().nonempty('Selecione um estado.'),
  addressOptionValue: z.string().optional(),
  zipcode: z.string().optional()
})

export type FormData = z.infer<typeof formSchema>

const defaultValues: FormData = {
  address: '',
  state: '',
  city: '',
  addressOptionValue: '',
  zipcode: ''
}

export function useAddressForm() {
  const { control, handleSubmit, formState, resetField, register, setValue } =
    useForm<FormData>({
      resolver: zodResolver(formSchema),
      defaultValues
    })

  const state = useWatch({
    control,
    name: 'state',
    defaultValue: defaultValues.state
  })

  const zipcode = useWatch({
    control,
    name: 'zipcode',
    defaultValue: defaultValues.zipcode
  })

  const addressOptionValue = useWatch({
    control,
    name: 'addressOptionValue',
    defaultValue: defaultValues.addressOptionValue
  })

  return {
    control,
    values: {
      state,
      zipcode,
      addressOptionValue
    },
    register,
    setValue,
    formState,
    formSchema,
    resetField,
    handleSubmit
  }
}

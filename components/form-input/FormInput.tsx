import {
  Box,
  ComponentWithAs,
  FormControl,
  FormLabel,
  FormLabelProps,
  Input,
  InputProps,
  Text,
} from '@chakra-ui/react'
import { FC } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'

interface IFormInput {
  label?: string
  error?: string
  register?: UseFormRegisterReturn
  labelProps?: Partial<ComponentWithAs<'label', FormLabelProps>> &
    Partial<FormLabelProps>
}

type IProps = IFormInput &
  Partial<ComponentWithAs<'input', InputProps>> &
  Partial<InputProps>

export const FormInput: FC<IProps> = ({
  error,
  label,
  register,
  labelProps,
  ...props
}) => {
  return (
    <FormControl>
      {label && <FormLabel {...labelProps}>{label}</FormLabel>}
      <Input {...register} {...props} />
      <Box minH="60px" alignItems="center" display="flex">
        <Text fontSize={20} color="#FF0000">
          {error}
        </Text>
      </Box>
    </FormControl>
  )
}

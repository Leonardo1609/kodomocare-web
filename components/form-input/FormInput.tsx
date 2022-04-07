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
  labelFontSize?: number
  labelColor?: string
  label?: string
  error?: string
  register?: UseFormRegisterReturn
}

type IProps = IFormInput &
  Partial<ComponentWithAs<'input', InputProps>> &
  Partial<InputProps>

export const FormInput: FC<IProps> = ({
  error,
  label,
  register,
  labelColor,
  labelFontSize,
  ...props
}) => {
  return (
    <FormControl>
      {label && (
        <FormLabel color={labelColor || 'black'} fontSize={labelFontSize || 25}>
          {label}
        </FormLabel>
      )}
      <Input {...register} {...props} />
      <Box minH="60px" alignItems="center" display="flex">
        <Text fontSize={20} color="#FF0000">
          {error}
        </Text>
      </Box>
    </FormControl>
  )
}

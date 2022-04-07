import {
  Button,
  GridItem,
  HStack,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react'
import { FormInput } from '../../components/form-input/FormInput'
import { Layout } from '../../components/layout/Layout'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

interface EditData {
  firstName: string
  lastName: string
  dni: string
  email: string
  password: string
  confirmPassword: string
}

const editSchema = yup
  .object({
    firstName: yup.string().required('Nombres son obligatorios'),
    lastName: yup.string().required('Apellidos son obligatorios'),
    dni: yup
      .string()
      .min(8, 'Se requiere 8 caracteres')
      .max(8, 'Se requiere 8 caracteres')
      .required('DNI es obligatorio'),
    email: yup
      .string()
      .email('Ingrese un correo válido')
      .required('El campo está vacío, ingrese un correo electrónico'),
    password: yup.string(),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Las contraseñas no coinciden'),
  })
  .required()

const Edit = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      dni: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    resolver: yupResolver(editSchema),
  })
  return (
    <Layout title="Editar" headTitle="Editar Usuario">
      <VStack as="form" paddingX={20} onSubmit={handleSubmit(console.log)}>
        <VStack w="full" alignItems="start">
          <Text
            fontSize={30}
            borderBottomColor="black"
            borderBottomWidth="3px"
            w="full"
            paddingBottom={3}
            marginBottom="20px"
          >
            Datos personales
          </Text>
          <SimpleGrid columns={2} columnGap={20} w="full">
            <GridItem colSpan={1}>
              <FormInput
                error={errors.firstName?.message}
                placeholder="Ingrese los nombres"
                fontSize={18}
                h={54}
                type="text"
                w="full"
                borderRadius={4}
                register={register('firstName')}
              />
            </GridItem>
            <GridItem colSpan={1}>
              <FormInput
                error={errors.lastName?.message}
                placeholder="Ingrese los apellidos"
                fontSize={18}
                h={54}
                type="text"
                w="full"
                borderRadius={4}
                register={register('lastName')}
              />
            </GridItem>
            <GridItem colSpan={1}>
              <FormInput
                error={errors.dni?.message}
                placeholder="Ingrese el DNI"
                fontSize={18}
                h={54}
                type="number"
                w="full"
                borderRadius={4}
                register={register('dni')}
              />
            </GridItem>
            <GridItem colSpan={1}>
              <FormInput
                error={errors.email?.message}
                placeholder="Ingrese el correo"
                fontSize={18}
                h={54}
                type="email"
                w="full"
                borderRadius={4}
                register={register('email')}
              />
            </GridItem>
          </SimpleGrid>
        </VStack>
        <VStack w="full" alignItems="start">
          <Text
            fontSize={30}
            borderBottomColor="black"
            borderBottomWidth="3px"
            w="full"
            paddingBottom={3}
            marginBottom="20px"
          >
            Contraseña
          </Text>
          <SimpleGrid columns={2} columnGap={20} w="full">
            <GridItem colSpan={1}>
              <FormInput
                error={errors.password?.message}
                placeholder="Contraseña"
                fontSize={18}
                h={54}
                type="password"
                w="full"
                borderRadius={4}
                register={register('password')}
              />
            </GridItem>
            <GridItem colSpan={1}>
              <FormInput
                error={errors.confirmPassword?.message}
                placeholder="Confirmar contraseña"
                fontSize={18}
                h={54}
                type="password"
                w="full"
                borderRadius={4}
                register={register('confirmPassword')}
              />
            </GridItem>
          </SimpleGrid>
        </VStack>
        <HStack spacing={86} justifyContent="center">
          <Button
            w="222px"
            h="40px"
            borderRadius={4}
            color="white"
            fontSize={20}
            bg="#5680E9"
            type="submit"
          >
            Guardar
          </Button>
          <Button
            w="222px"
            h="40px"
            borderRadius={4}
            color="white"
            fontSize={20}
            bg="#E95656"
          >
            Cancelar
          </Button>
        </HStack>
      </VStack>
    </Layout>
  )
}

export default Edit

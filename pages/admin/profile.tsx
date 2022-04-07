import { Button, Flex, Stack, Text, VStack } from '@chakra-ui/react'
import { Layout } from '../../components/layout/Layout'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { FormInput } from '../../components/form-input/FormInput'
interface ProfileData {
  firstName: string
  lastName: string
  dni: string
}

const profileSchema = yup
  .object({
    firstName: yup.string().required('Nombres son obligatorios'),
    lastName: yup.string().required('Apellidos son obligatorios'),
    dni: yup
      .string()
      .min(8, 'Se requiere 8 caracteres')
      .max(8, 'Se requiere 8 caracteres')
      .required('DNI es obligatorio'),
  })
  .required()

const Profile = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      dni: '',
    },
    resolver: yupResolver(profileSchema),
  })

  const onSubmit = (data: ProfileData) => {
    console.log(data)
  }

  return (
    <Layout title="Perfil" headTitle="Perfil">
      <Text>
        En la vista del perfil de administrador, podrá editar su nombre,
        apellido y DNI.
      </Text>
      <Flex
        padding={4}
        w="full"
        gap={{ base: '0', lg: '80px' }}
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        direction={{ base: 'column', lg: 'row' }}
      >
        <Stack flex={1}>
          <VStack>
            <FormInput
              labelProps={{
                fontSize: 22,
              }}
              label="Nombres"
              error={errors.firstName?.message}
              placeholder="Ingrese sus nombres"
              fontSize={25}
              h="60px"
              type="text"
              w="full"
              borderRadius={4}
              register={register('firstName')}
            />
            <FormInput
              labelProps={{
                fontSize: 22,
              }}
              label="Apellidos"
              error={errors.lastName?.message}
              placeholder="Ingrese sus apellidos"
              fontSize={25}
              h="60px"
              type="text"
              w="full"
              borderRadius={4}
              register={register('lastName')}
            />
            <FormInput
              labelProps={{
                fontSize: 22,
              }}
              label="DNI"
              error={errors.dni?.message}
              placeholder="Ingrese su DNI"
              fontSize={25}
              h="60px"
              type="number"
              maxLength={8}
              w="full"
              borderRadius={4}
              register={register('dni')}
            />
          </VStack>
        </Stack>
        <Stack flex={1} paddingY={4}>
          <Button
            w="full"
            h={78}
            borderRadius={4}
            color="white"
            fontSize={25}
            bg="#5680E9"
            type="submit"
          >
            Guardar Cambios
          </Button>
        </Stack>
      </Flex>
    </Layout>
  )
}

export default Profile

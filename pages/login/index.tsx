import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

interface LoginData {
  email: string
  password: string
}

const loginSchema = yup
  .object({
    email: yup
      .string()
      .email('Ingrese un correo válido')
      .required('El campo está vacío, ingrese un correo electrónico'),
    password: yup
      .string()
      .required('El campo está vacío, ingrese una contraseña'),
  })
  .required()

const Login = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginData>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(loginSchema),
  })

  const onSubmit = ({ email, password }: LoginData) => {
    console.log(email, password)
  }

  return (
    <Flex h="100vh">
      <Stack h="full" w="60%" position="relative">
        <VStack
          position="absolute"
          bg="#5680E9"
          h="full"
          w="full"
          zIndex={9}
          opacity={0.7}
          alignItems="start"
          justifyContent="space-between"
          padding={10}
        >
          <Stack maxW="132px">
            <Image src="/images/logo.png" alt="logo" width={264} height={232} />
          </Stack>
          <VStack alignItems="start" lineHeight={1}>
            <Text fontSize={80} color="white">
              Bienvenidos
            </Text>
            <Text fontSize={80} color="white">
              A KodomoCare!
            </Text>
          </VStack>
        </VStack>
        <Image
          src="/images/welcome.png"
          alt="welcome"
          width={1800}
          height={2000}
          layout="fill"
          objectFit="cover"
        />
      </Stack>
      <VStack
        padding={12}
        width="40%"
        alignItems="flex-start"
        height="full"
        spacing="44px"
      >
        <VStack alignItems="start">
          <Text as="h1" fontSize={50} color="#5680E9" textAlign="left">
            Iniciar Sesión
          </Text>
          <Text color="#727377" fontSize={25}>
            Bienvenido de vuelta, por favor ingresa tus credenciales
          </Text>
        </VStack>
        <VStack
          paddingX={2}
          w="full"
          as="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <VStack w="full">
            <FormControl>
              <FormLabel fontSize={25}>Correo</FormLabel>
              <Input
                placeholder="Ingrese su correo"
                fontSize={25}
                h={78}
                type="email"
                w="full"
                borderRadius={4}
                {...register('email')}
              />
              <Box height={70} alignItems="center" display="flex">
                <Text fontSize={20} color="#FF0000">
                  {errors.email?.message}
                </Text>
              </Box>
            </FormControl>
            <FormControl>
              <FormLabel fontSize={25}>Contraseña</FormLabel>
              <Input
                placeholder="Ingrese su contraseña"
                fontSize={25}
                h={78}
                type="password"
                w="full"
                borderRadius={4}
                {...register('password')}
              />
              <Box height={70} alignItems="center" display="flex">
                <Text fontSize={20} color="#FF0000">
                  {errors.password?.message}
                </Text>
              </Box>
            </FormControl>
          </VStack>
          <Button
            alignSelf="flex-end"
            w="full"
            h={78}
            borderRadius={4}
            color="white"
            fontSize={25}
            bg="#5680E9"
            type="submit"
          >
            Iniciar Sesión
          </Button>
        </VStack>
      </VStack>
    </Flex>
  )
}

export default Login

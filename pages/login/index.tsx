import * as yup from 'yup'
import Image from 'next/image'
import { FormInput } from '../../components/form-input/FormInput'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { getSession, signIn } from 'next-auth/react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)

  if (session) {
    return {
      redirect: {
        destination: '/admin',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}

const Login = () => {
  const router = useRouter()
  const [loginError, setLoginError] = useState('')

  useEffect(() => {
    if (router.query.error === 'Invalid credentials')
      setLoginError('Credenciales inválidas')
  }, [router])

  useEffect(() => {
    if (loginError) toast.error(loginError)
  }, [loginError])

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

  const onSubmit = async ({ email, password }: LoginData) => {
    await signIn('credentials', {
      email,
      password,
      callbackUrl: `${window.location.origin}/admin`,
    })
  }

  return (
    <div className="flex min-h-screen">
      <div className="w-3/5 relative">
        <div className="flex flex-col absolute h-full w-full z-10 opacity-[0.7] items-start justify-between p-8 bg-primary dark:bg-blue-900">
          <div className="max-w-[132px]">
            <Image src="/images/logo.png" alt="logo" width={264} height={232} />
          </div>
          <div className="flex flex-col items-start leading-[1]">
            <span className="text-[80px] text-white">Bienvenidos</span>
            <span className="text-[80px] text-white">A KodomoCare!</span>
          </div>
        </div>
        <Image
          src="/images/welcome.png"
          alt="welcome"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>
      <div className="flex flex-col p-10 w-2/5 items-start h-full space-y-[44px] dark:bg-gray-800 min-h-screen">
        <div className="flex flex-col items-start">
          <h1 className="text-5xl text-primary text-left mb-3 dark:text-blue-900">
            Iniciar Sesión
          </h1>
          <span className="text-[#727377] text-2xl dark:text-gray-300">
            Bienvenido de vuelta, por favor ingresa tus credenciales
          </span>
        </div>
        <form
          className="flex flex-col px-2 w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col w-full">
            <FormInput
              label="Correo"
              error={errors.email?.message}
              placeholder="Ingrese su correo"
              inputClassName="h-[78px] w-full rounded text-2xl"
              type="email"
              register={register('email')}
            />
            <FormInput
              label="Contraseña"
              error={errors.password?.message}
              placeholder="Ingrese su contraseña"
              inputClassName="h-[78px] w-full rounded text-2xl"
              type="password"
              register={register('password')}
            />
          </div>
          <button
            className="items-end w-full h-[78px] rounded text-white text-2xl bg-primary dark:bg-blue-900"
            type="submit"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login

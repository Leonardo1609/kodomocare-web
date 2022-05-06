import { DetailedHTMLProps, FC, InputHTMLAttributes } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'

interface IFormInput {
  labelFontSize?: number
  labelColor?: string
  inputClassName?: string
  label?: string
  error?: string
  register?: UseFormRegisterReturn
}

type IProps = IFormInput &
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

export const FormInput: FC<IProps> = ({
  error,
  label,
  register,
  labelColor,
  labelFontSize,
  className,
  inputClassName,
  ...props
}) => {
  const labelClass = `block mb-2 font-bold text-base text-black dark:text-gray-400 lg:text-${
    `[${labelFontSize}px]` || '2xl'
  } text-${`[${labelColor}]` || 'black'}`
  const inputClass = `px-4 border border-gray-400 outline-none rounded ${inputClassName}`
  const containerClass = `mb-6 w-full ${className}`

  return (
    <div className={containerClass}>
      {label && (
        <label className={labelClass} htmlFor="name">
          {label}
        </label>
      )}
      <input className={inputClass} {...register} {...props} />
      <div className="min-h-[30px] md:min-h-[60px] items-center flex">
        <span className="text-sm md:text-xl text-red-600 dark:text-red-400">
          {error}
        </span>
      </div>
    </div>
  )
}

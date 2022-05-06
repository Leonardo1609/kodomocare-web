import { FC } from 'react'

interface IDashboardItem {
  title: string
  result: number
}

const DashboardItem: FC<IDashboardItem> = ({ title, result }) => {
  return (
    <div className="flex flex-col items-center">
      <span className="text-base lg:text-[25px] text-center dark:text-gray-300">
        {title}
      </span>
      <div className="mt-4 h-9 w-1/2 lg:h-20 lg:w-full max-w-[328px] border border-black flex items-center justify-center text-base lg:text-[30px] dark:text-gray-300 dark:border-gray-300">
        {result}
      </div>
    </div>
  )
}

export default DashboardItem

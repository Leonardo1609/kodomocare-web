import { FC } from 'react'

interface IDashboardItem {
  title: string
  result: number
}

const DashboardItem: FC<IDashboardItem> = ({ title, result }) => {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[25px] text-center dark:text-gray-300">
        {title}
      </span>
      <div className="mt-4 h-20 w-full max-w-[328px] border border-black flex items-center justify-center text-[30px] dark:text-gray-300 dark:border-gray-300">
        {result}
      </div>
    </div>
  )
}

export default DashboardItem

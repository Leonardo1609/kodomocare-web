import { Box, Text, VStack } from '@chakra-ui/react'
import { FC } from 'react'

interface IDashboardItem {
  title: string
  result: number
}

const DashboardItem: FC<IDashboardItem> = ({ title, result }) => {
  return (
    <VStack>
      <Text fontSize={25} textAlign="center">
        {title}
      </Text>
      <Box
        mt="18px !important"
        h="80px"
        w="full"
        maxW="328px"
        borderWidth={1}
        borderColor="black"
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontSize={30}
      >
        {result}
      </Box>
    </VStack>
  )
}

export default DashboardItem

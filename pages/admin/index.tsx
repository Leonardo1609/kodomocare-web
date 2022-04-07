import { GridItem, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import { Layout } from '../../components/layout/Layout'
import DashboardItem from '../../components/dashboard-item/DashboardItem'
import { DashboardChart } from '../../components/dashboard-chart/DashboardChart'

const Home = () => {
  return (
    <Layout title="Inicio">
      <Text fontSize={25} mb={10} display="inline-block">
        Usuarios Activos
      </Text>
      <Stack maxW={725} maxH={361} w="full">
        <DashboardChart
          data={{
            labels: ['Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'],
            datasets: [
              {
                data: [120, 80, 240, 250, 40],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
              },
            ],
          }}
        />
      </Stack>
      <SimpleGrid columns={{ base: 1, md: 2 }} gap="30px" mt="30px !important">
        <GridItem colSpan={1}>
          <DashboardItem
            title="Pruebas realizadas en promedio / mes"
            result={13.5}
          />
        </GridItem>
        <GridItem colSpan={1}>
          <DashboardItem
            title="Cantidad de usuarios registrados / mes"
            result={20}
          />
        </GridItem>
        <GridItem colSpan={1}>
          <DashboardItem
            title="Edad en meses promedio de las pruebas / mes"
            result={35.3}
          />
        </GridItem>
        <GridItem colSpan={1}>
          <DashboardItem title="Cantidad de usuarios inactivos" result={3} />
        </GridItem>
      </SimpleGrid>
    </Layout>
  )
}

export default Home

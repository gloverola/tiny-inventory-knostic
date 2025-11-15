import { useQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { ArrowLeftIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { storeQuery } from '../queries'
import { StoreAnalytics } from './store-analytics'
import { StoreProducts } from './store-products'

function StoreDetails() {
  const { storeId } = useParams({ from: '/_authenticated/stores/$storeId' })

  const {
    data: storesData,
    isLoading,
    isError,
  } = useQuery(storeQuery({ id: storeId }))

  isLoading && <div>Loading...</div>
  isError && <div>Error loading store details.</div>

  return (
    <>
      <Header fixed className='w-full'>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <Button className='p-0!' variant='ghost'>
          <ArrowLeftIcon /> Stores
        </Button>
        <div className='mt-4 mb-4'>
          <h1 className='text-xl font-bold'>
            {storesData?.name || 'Store Details'} |{' '}
            <span className='text-muted-foreground text-sm'>
              {storesData?.location}
            </span>
          </h1>
        </div>

        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-2'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='products'>Products</TabsTrigger>
              <TabsTrigger value='customers' disabled>
                Customers
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='overview' className='space-y-4'>
            <StoreAnalytics />
          </TabsContent>
          <TabsContent value='products' className='space-y-4'>
            <StoreProducts />
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}

export default StoreDetails

import { faker } from '@faker-js/faker'
import {
  Package,
  DollarSign,
  Store,
  Users,
  Grid3x3,
  TrendingUp,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Overview } from './components/overview'
import { RecentSales } from './components/recent-sales'

// Generate fake store data
const generateStoresBreakdown = () => {
  const stores = [
    'Downtown Electronics',
    'Tech Haven',
    'Gadget World',
    'Digital Store',
    'Tech Paradise',
  ]

  return stores.map((store) => ({
    category: store,
    count: faker.number.int({ min: 50, max: 300 }),
    totalValue: faker.number.float({
      min: 5000,
      max: 25000,
      fractionDigits: 2,
    }),
  }))
}

export function Dashboard() {
  const analytics = {
    summary: {
      totalStores: faker.number.int({ min: 5, max: 15 }),
      totalProducts: faker.number.int({ min: 800, max: 2000 }),
      totalCustomers: faker.number.int({ min: 500, max: 5000 }),
      totalCategories: faker.number.int({ min: 8, max: 20 }),
      totalInventoryValue: faker.number.float({
        min: 40000,
        max: 100000,
        fractionDigits: 2,
      }),
      totalRevenue: faker.number.float({
        min: 80000,
        max: 200000,
        fractionDigits: 2,
      }),
    },
    storesBreakdown: generateStoresBreakdown(),
  }

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header className='w-full'>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='mb-4 text-xl font-bold tracking-tight'>Dashboard</h1>
        </div>
        <div className='space-y-4'>
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Total Stores
                </CardTitle>
                <Store className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {analytics.summary.totalStores.toLocaleString()}
                </div>
                <p className='text-muted-foreground text-xs'>
                  Active store locations
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Total Products
                </CardTitle>
                <Package className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {analytics.summary.totalProducts.toLocaleString()}
                </div>
                <p className='text-muted-foreground text-xs'>
                  Across all stores
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Total Customers
                </CardTitle>
                <Users className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {analytics.summary.totalCustomers.toLocaleString()}
                </div>
                <p className='text-muted-foreground text-xs'>
                  Registered customers
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Total Categories
                </CardTitle>
                <Grid3x3 className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {analytics.summary.totalCategories}
                </div>
                <p className='text-muted-foreground text-xs'>
                  Product categories
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Total Inventory Value
                </CardTitle>
                <DollarSign className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  $
                  {analytics.summary.totalInventoryValue.toLocaleString(
                    'en-US',
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </div>
                <p className='text-muted-foreground text-xs'>
                  Total stock value
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Total Revenue
                </CardTitle>
                <TrendingUp className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  $
                  {analytics.summary.totalRevenue.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <p className='text-muted-foreground text-xs'>
                  All-time revenue
                </p>
              </CardContent>
            </Card>
          </div>
          <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
            <Card className='col-span-1 lg:col-span-4'>
              <CardHeader>
                <CardTitle>Store Revenue Breakdown</CardTitle>
                <CardDescription>
                  Revenue distribution across stores
                </CardDescription>
              </CardHeader>
              <CardContent className='ps-2'>
                <Overview data={analytics.storesBreakdown} />
              </CardContent>
            </Card>
            <Card className='col-span-1 lg:col-span-3'>
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>
                  Latest product sales across stores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentSales />
              </CardContent>
            </Card>
          </div>
        </div>
      </Main>
    </>
  )
}

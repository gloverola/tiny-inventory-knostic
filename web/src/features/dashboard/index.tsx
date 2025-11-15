import {
  Package,
  DollarSign,
  TrendingDown,
  AlertTriangle,
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

export function Dashboard() {
  // TODO: Fetch this data from the backend
  const analytics = {
    summary: {
      totalProducts: 1248,
      totalValue: 45231.89,
      avgProductPrice: 36.24,
      lowStockItems: 23,
      outOfStockItems: 5,
      categories: 8,
    },
    categoryBreakdown: [
      { category: 'Electronics', count: 245, totalValue: 15420.5 },
      { category: 'Clothing', count: 412, totalValue: 12150.3 },
      { category: 'Food', count: 189, totalValue: 5680.2 },
      { category: 'Books', count: 156, totalValue: 3920.1 },
      { category: 'Furniture', count: 98, totalValue: 4560.8 },
      { category: 'Toys', count: 148, totalValue: 3499.99 },
    ],
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
                  Total Inventory Value
                </CardTitle>
                <DollarSign className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  $
                  {analytics.summary.totalValue.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <p className='text-muted-foreground text-xs'>
                  Total stock value
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Avg. Product Price
                </CardTitle>
                <TrendingUp className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  ${analytics.summary.avgProductPrice.toFixed(2)}
                </div>
                <p className='text-muted-foreground text-xs'>
                  Average price per item
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Low Stock Items
                </CardTitle>
                <TrendingDown className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {analytics.summary.lowStockItems}
                </div>
                <p className='text-muted-foreground text-xs'>
                  Items below 10 units
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Out of Stock
                </CardTitle>
                <AlertTriangle className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-destructive text-2xl font-bold'>
                  {analytics.summary.outOfStockItems}
                </div>
                <p className='text-muted-foreground text-xs'>
                  Items needing restock
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Categories
                </CardTitle>
                <Grid3x3 className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {analytics.summary.categories}
                </div>
                <p className='text-muted-foreground text-xs'>
                  Product categories
                </p>
              </CardContent>
            </Card>
          </div>
          <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
            <Card className='col-span-1 lg:col-span-4'>
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
                <CardDescription>
                  Inventory distribution by category
                </CardDescription>
              </CardHeader>
              <CardContent className='ps-2'>
                <Overview data={analytics.categoryBreakdown} />
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

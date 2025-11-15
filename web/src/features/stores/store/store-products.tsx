import { getRouteApi } from '@tanstack/react-router'
import { ProductsDialogs } from '@/features/products/components/products-dialogs'
import { ProductsPrimaryButtons } from '@/features/products/components/products-primary-buttons'
import { ProductsProvider } from '@/features/products/components/products-provider'
import { ProductsTable } from '@/features/products/components/products-table'

const route = getRouteApi('/_authenticated/stores/$storeId')

export function StoreProducts() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  return (
    <ProductsProvider>
      <div className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-xl font-normal tracking-tight'>Products</h2>
            <p className='text-muted-foreground'>
              Manage store products and their details here.
            </p>
          </div>
          <ProductsPrimaryButtons />
        </div>
        <ProductsTable search={search} navigate={navigate} />
      </div>

      <ProductsDialogs />
    </ProductsProvider>
  )
}

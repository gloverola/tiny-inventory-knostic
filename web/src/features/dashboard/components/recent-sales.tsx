import { Package } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

// TODO: Fetch this data from the backend
const recentSales = [
  {
    id: 1,
    productName: 'Wireless Headphones',
    store: 'Electronics Store NYC',
    category: 'Electronics',
    quantity: 2,
    price: 199.99,
    totalAmount: 399.98,
  },
  {
    id: 2,
    productName: 'Running Shoes',
    store: 'Sports Store LA',
    category: 'Clothing',
    quantity: 1,
    price: 89.99,
    totalAmount: 89.99,
  },
  {
    id: 3,
    productName: 'Coffee Maker',
    store: 'Home Goods Miami',
    category: 'Appliances',
    quantity: 1,
    price: 129.5,
    totalAmount: 129.5,
  },
  {
    id: 4,
    productName: 'Office Chair',
    store: 'Furniture Store Chicago',
    category: 'Furniture',
    quantity: 1,
    price: 299.0,
    totalAmount: 299.0,
  },
  {
    id: 5,
    productName: 'Organic Honey',
    store: 'Grocery Store Austin',
    category: 'Food',
    quantity: 3,
    price: 12.99,
    totalAmount: 38.97,
  },
]

export function RecentSales() {
  return (
    <div className='space-y-8'>
      {recentSales.map((sale) => (
        <div key={sale.id} className='flex items-start gap-4'>
          <div className='bg-muted flex h-9 w-9 items-center justify-center rounded-lg'>
            <Package className='h-4 w-4' />
          </div>
          <div className='flex flex-1 flex-col gap-1'>
            <div className='flex items-start justify-between gap-2'>
              <div className='space-y-1'>
                <p className='text-sm leading-none font-medium'>
                  {sale.productName}
                </p>
                <p className='text-muted-foreground text-xs'>{sale.store}</p>
              </div>
              <div className='text-right'>
                <p className='text-sm font-medium'>
                  ${sale.totalAmount.toFixed(2)}
                </p>
                <p className='text-muted-foreground text-xs'>
                  {sale.quantity}x ${sale.price.toFixed(2)}
                </p>
              </div>
            </div>
            <Badge variant='secondary' className='w-fit text-xs'>
              {sale.category}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}

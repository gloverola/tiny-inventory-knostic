import { type ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type Product } from '../schema'
import { DataTableRowActions } from './data-table-row-actions'

const placeholderImageUrl =
  'https://res.cloudinary.com/dcd1lhe7x/image/upload/v1670195919/placeholder_wsnb13.png'
export const productsColumns: ColumnDef<Product>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-0.5'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-0.5'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'imageUrl',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Image' />
    ),
    cell: ({ row }) => (
      <div className='flex items-center'>
        <img
          src={row.getValue('imageUrl') || placeholderImageUrl}
          alt={row.getValue('name')}
          className='h-10 w-10 rounded-md object-cover'
        />
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Product Name' />
    ),
    cell: ({ row }) => (
      <div className='max-w-36 truncate font-medium'>
        <LongText>{row.getValue('name')}</LongText>
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'category',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Category' />
    ),
    cell: ({ row }) => (
      <Badge variant='outline' className='capitalize'>
        {row.getValue('category')}
      </Badge>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: false,
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Price' />
    ),
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price'))
      return <div className='font-medium'>${price.toFixed(2)}</div>
    },
  },
  {
    accessorKey: 'quantity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Stock' />
    ),
    cell: ({ row }) => {
      const quantity = row.getValue('quantity') as number
      const status =
        quantity === 0
          ? 'out_of_stock'
          : quantity < 10
            ? 'low_stock'
            : 'in_stock'
      const badgeVariant =
        status === 'out_of_stock'
          ? 'destructive'
          : status === 'low_stock'
            ? 'secondary'
            : 'default'

      return (
        <div className='flex items-center gap-2'>
          <span
            className={cn(
              'font-medium',
              quantity === 0 && 'text-destructive',
              quantity < 10 &&
                quantity > 0 &&
                'text-orange-600 dark:text-orange-400'
            )}
          >
            {quantity}
          </span>
          <Badge variant={badgeVariant} className='text-xs'>
            {status === 'out_of_stock'
              ? 'Out'
              : status === 'low_stock'
                ? 'Low'
                : 'In Stock'}
          </Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      const quantity = row.getValue(id) as number
      const status =
        quantity === 0
          ? 'out_of_stock'
          : quantity < 10
            ? 'low_stock'
            : 'in_stock'
      return value.includes(status)
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as Date
      return (
        <div className='w-[100px] text-sm'>
          {dayjs(date).format('MMM DD, YYYY')}
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]

import { type ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { type Store } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const storesColumns: ColumnDef<Store>[] = [
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
        className='ml-2'
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
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Store Name' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-124'>
            {row.getValue('name')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'location',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Location' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex items-center'>
          <span className='max-w-32 truncate sm:max-w-72 md:max-w-124'>
            {row.getValue('location')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created At' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as Date
      return (
        <div className='w-[140px]'>{dayjs(date).format('MMM DD, YYYY')}</div>
      )
    },
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Updated At' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('updatedAt') as Date
      return (
        <div className='w-[140px]'>{dayjs(date).format('MMM DD, YYYY')}</div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]

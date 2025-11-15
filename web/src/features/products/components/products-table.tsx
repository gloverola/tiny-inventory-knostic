import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { type NavigateFn, useTableUrlState } from '@/hooks/use-table-url-state'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination, DataTableToolbar } from '@/components/data-table'
import { TableSkeleton } from '@/components/data-table/table-skeleton'
import { categoriesQuery } from '@/features/categories/queries'
import { storeProductsQuery } from '@/features/stores/queries'
import { productsQuery } from '../queries'
import { DataTableBulkActions } from './data-table-bulk-actions'
import { productsColumns as columns } from './products-columns'

type DataTableProps = {
  search: Record<string, unknown>
  navigate: NavigateFn
  storeId?: string
}

export function ProductsTable({ search, navigate, storeId }: DataTableProps) {
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])

  const {
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
  } = useTableUrlState({
    search,
    navigate,
    pagination: { defaultPage: 1, defaultPageSize: 10 },
    globalFilter: { enabled: false },
    columnFilters: [
      { columnId: 'name', searchKey: 'name', type: 'string' },
      {
        columnId: 'category',
        searchKey: 'category',
        type: 'array',
        // Serialize array to comma-separated string for URL
        serialize: (value: unknown) => {
          if (Array.isArray(value) && value.length > 0) {
            return value
          }
          return undefined
        },
        // Deserialize - handle both array (from route schema) and string
        deserialize: (value: unknown) => {
          // If it's already an array (from route schema), return it
          if (Array.isArray(value)) {
            return value
          }
          // If it's a string, split by comma
          if (typeof value === 'string' && value.trim() !== '') {
            return value
              .split(',')
              .map((v) => v.trim())
              .filter(Boolean)
          }
          return []
        },
      },
      {
        columnId: 'quantity',
        searchKey: 'stock',
        type: 'array',
        // Serialize array for URL
        serialize: (value: unknown) => {
          if (Array.isArray(value) && value.length > 0) {
            return value
          }
          return undefined
        },
        // Deserialize - handle both array (from route schema) and string
        deserialize: (value: unknown) => {
          // If it's already an array (from route schema), return it
          if (Array.isArray(value)) {
            return value
          }
          // If it's a string, split by comma
          if (typeof value === 'string' && value.trim() !== '') {
            return value
              .split(',')
              .map((v) => v.trim())
              .filter(Boolean)
          }
          return []
        },
      },
    ],
  })

  // Build query params from columnFilters directly (workaround for URL sync issue)
  const categoryFilterValue = columnFilters.find((f) => f.id === 'category')
    ?.value as string[] | undefined
  const stockFilterValue = columnFilters.find((f) => f.id === 'quantity')
    ?.value as string[] | undefined
  const nameFilterValue = columnFilters.find((f) => f.id === 'name')?.value as
    | string
    | undefined

  const queryParams = {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: nameFilterValue || (search.name as string | undefined),
    category:
      categoryFilterValue && categoryFilterValue.length > 0
        ? categoryFilterValue
        : undefined,
    stock:
      stockFilterValue && stockFilterValue.length > 0
        ? stockFilterValue
        : undefined,
  }

  const {
    data: productsData,
    isLoading,
    isError,
  } = useQuery(productsQuery(queryParams))

  const {
    data: storeProductsData,
    isLoading: isLoadingStoreProducts,
    isError: isStoreProductsError,
  } = useQuery(
    storeProductsQuery(
      storeId,
      {
        enabled: !!storeId,
      },
      queryParams
    )
  )

  const { data: categoriesData } = useQuery(
    categoriesQuery({ page: 1, limit: 100 })
  )

  const tableData = !storeId
    ? (productsData?.products ?? [])
    : ((storeProductsData as any)?.products ?? [])
  const rowCount = !storeId
    ? (productsData?.pagination?.total ?? 0)
    : ((storeProductsData as any)?.pagination?.total ?? 0)

  const categoryOptions =
    categoriesData?.items
      ?.filter((category: any) => category?.name)
      ?.map((category: any) => ({
        value: category.name,
        label: category.name,
      })) ?? []

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: tableData,
    columns,
    rowCount,
    state: {
      sorting,
      pagination,
      rowSelection,
      columnFilters,
      columnVisibility,
    },
    enableRowSelection: true,
    manualPagination: true,
    onPaginationChange,
    onColumnFiltersChange,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  useEffect(() => {
    ensurePageInRange(table.getPageCount())
  }, [table, ensurePageInRange])

  return (
    <div
      className={cn(
        'max-sm:has-[div[role="toolbar"]]:mb-16', // Add margin bottom to the table on mobile when the toolbar is visible
        'flex flex-1 flex-col gap-4'
      )}
    >
      <DataTableToolbar
        table={table}
        searchPlaceholder='Search products...'
        searchKey='name'
        filters={[
          {
            columnId: 'category',
            title: 'Category',
            options: categoryOptions,
          },
          {
            columnId: 'quantity',
            title: 'Stock Status',
            options: [...STOCK_STATUS],
          },
        ]}
      />
      <div className='overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='group/row'>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(
                        'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                        header.column.columnDef.meta?.className,
                        header.column.columnDef.meta?.thClassName
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading || isLoadingStoreProducts ? (
              <TableSkeleton
                columns={columns.length}
                rows={pagination.pageSize}
              />
            ) : isError || isStoreProductsError ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='text-destructive h-24 text-center'
                >
                  Error loading products. Please try again.
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className='group/row'
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                        cell.column.columnDef.meta?.className,
                        cell.column.columnDef.meta?.tdClassName
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} className='mt-auto' />
      <DataTableBulkActions table={table} />
    </div>
  )
}

const STOCK_STATUS = [
  { label: 'In Stock', value: 'in_stock' },
  { label: 'Low Stock', value: 'low_stock' },
  { label: 'Out of Stock', value: 'out_of_stock' },
] as const

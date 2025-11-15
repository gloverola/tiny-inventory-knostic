import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { Trash2, Download } from 'lucide-react'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { type Store } from '../data/schema'
import { StoresMultiDeleteDialog } from './stores-multi-delete-dialog'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleBulkExport = () => {
    const selectedStores = selectedRows.map((row) => row.original as Store)
    toast.promise(sleep(2000), {
      loading: 'Exporting stores...',
      success: () => {
        table.resetRowSelection()
        return `Exported ${selectedStores.length} store${selectedStores.length > 1 ? 's' : ''} to CSV.`
      },
      error: 'Error',
    })
    table.resetRowSelection()
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='store'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkExport()}
              className='size-8'
              aria-label='Export stores'
              title='Export stores'
            >
              <Download />
              <span className='sr-only'>Export stores</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Export stores</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label='Delete selected stores'
              title='Delete selected stores'
            >
              <Trash2 />
              <span className='sr-only'>Delete selected stores</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete selected stores</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <StoresMultiDeleteDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        table={table}
      />
    </>
  )
}

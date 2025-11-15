'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteProduct } from '@/services/products'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type Product } from '../schema'

type ProductDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Product
}

export function ProductsDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: ProductDeleteDialogProps) {
  const queryClient = useQueryClient()
  const [value, setValue] = useState('')

  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteProduct,
    mutationKey: ['delete-product'],
  })

  const handleDelete = () => {
    if (value.trim() !== currentRow.name) return

    toast.promise(
      mutateAsync(currentRow.id, {
        onSuccess: (_data) => {
          queryClient.invalidateQueries({ queryKey: ['products'] })
          queryClient.invalidateQueries({ queryKey: ['stores'] })
          queryClient.invalidateQueries({ queryKey: ['store-products'] })
          onOpenChange(false)
        },
        onError: (error) => {
          toast.error(
            error.message || 'Error deleting product, please try again'
          )
        },
      }),
      {
        loading: 'Deleting product...',
        success: 'Product deleted successfully',
      }
    )
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.name || isPending}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='stroke-destructive me-1 inline-block'
            size={18}
          />{' '}
          Delete Product
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete{' '}
            <span className='font-bold'>{currentRow.name}</span>?
            <br />
            This action will permanently remove this product from the system.
            This cannot be undone.
          </p>

          <div>
            <Label className='my-2'>Product Name</Label>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='Enter product name to confirm deletion.'
            />
          </div>

          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation can not be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Delete'
      destructive
    />
  )
}

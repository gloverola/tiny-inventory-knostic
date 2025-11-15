'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createProduct, updateProduct } from '@/services/products'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import CurrencyyInput from '@/components/ui/currency-input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SelectDropdown } from '@/components/select-dropdown'
import { categoriesQuery } from '@/features/categories/queries'
import { storesQuery } from '@/features/stores/queries'
import { type Product } from '../schema'

const createFormSchema = (isStoreIdProvided: boolean) =>
  z.object({
    name: z.string().min(1, 'Product name is required.'),
    category: z.string().min(1, 'Category is required.'),
    price: z
      .string()
      .min(1, 'Price is required.')
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'Price must be a positive number.',
      }),
    quantity: z
      .string()
      .min(1, 'Quantity is required.')
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
        message: 'Quantity must be a non-negative number.',
      })
      .refine((val) => Number.isInteger(Number(val)), {
        message: 'Quantity must be a whole number.',
      }),
    storeId: isStoreIdProvided
      ? z.string().optional()
      : z.string().min(1, 'Store is required.'),
    imageUrl: z.string().optional(),
  })

type ProductForm = z.infer<ReturnType<typeof createFormSchema>>

type ProductActionDialogProps = {
  currentRow?: Product
  storeId?: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductsActionDialog({
  currentRow,
  storeId,
  open,
  onOpenChange,
}: ProductActionDialogProps) {
  const queryClient = useQueryClient()
  const { data: categories, isLoading } = useQuery(
    categoriesQuery({ page: 1, limit: 100 })
  )
  const { data: stores } = useQuery(storesQuery({ page: 1, limit: 100 }))

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createProduct,
    mutationKey: ['create-product'],
  })

  const { mutateAsync: productUpdate, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateProduct(id, data),
    mutationKey: ['update-product'],
  })

  const isEdit = !!currentRow
  const formSchema = createFormSchema(!!storeId)
  const form = useForm<ProductForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          name: currentRow.name,
          category: currentRow.category,
          price: currentRow.price.toString(),
          quantity: currentRow.quantity.toString(),
          storeId: storeId ? storeId : currentRow.storeId,
          imageUrl: currentRow.imageUrl || '',
        }
      : {
          name: '',
          category: '',
          price: '',
          quantity: '',
          storeId: storeId || '',
          imageUrl: '',
        },
  })

  const onSubmit = (values: ProductForm) => {
    const productPayload = {
      ...values,
      price: Number(values.price),
      quantity: Number(values.quantity),
      imageUrl: values.imageUrl || undefined,
      storeId: storeId ? storeId : values.storeId,
    }

    // Remove null/undefined values
    const cleanedPayload = Object.fromEntries(
      Object.entries(productPayload).filter(
        ([_, value]) => value != null && value !== ''
      )
    )

    toast.promise(
      !isEdit
        ? mutateAsync(cleanedPayload, {
            onSuccess: (_data) => {
              queryClient.invalidateQueries({ queryKey: ['products'] })
              queryClient.invalidateQueries({ queryKey: ['stores'] })
              queryClient.invalidateQueries({ queryKey: ['store-products'] })
              form.reset()
              onOpenChange(false)
            },
            onError: (error) => {
              toast.error(
                error.message || 'Error creating product, please try again'
              )
            },
          })
        : productUpdate(
            { id: currentRow!.id, data: cleanedPayload },
            {
              onSuccess: (_data) => {
                queryClient.invalidateQueries({ queryKey: ['products'] })
                queryClient.invalidateQueries({ queryKey: ['stores'] })
                queryClient.invalidateQueries({ queryKey: ['store-products'] })
                form.reset()
                onOpenChange(false)
              },
              onError: (error) => {
                toast.error(
                  error.message || 'Error creating product, please try again'
                )
              },
            }
          ),
      {
        loading: isEdit ? 'Updating product...' : 'Creating product...',
        success: isEdit
          ? 'Product updated successfully'
          : 'Product created successfully',
      }
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the product here. ' : 'Create new product here. '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className='max-h-112 overflow-y-auto'>
          <Form {...form}>
            <form
              id='product-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4'
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='e.g., Wireless Mouse'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='category'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Select a category'
                      items={categories?.items?.map((category: any) => ({
                        label: category.name,
                        value: category.name,
                      }))}
                      isPending={isLoading}
                      className='w-full'
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='price'
                  render={({ field: { onChange, onBlur, value, name } }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <CurrencyyInput
                          name={name}
                          onValueChange={onChange}
                          value={value}
                          onBlur={onBlur}
                          placeholder='$0.00'
                          error={!!form.formState.errors.price}
                          prefix='$'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='quantity'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          step='1'
                          placeholder='e.g., 50'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {!storeId && (
                <FormField
                  control={form.control}
                  name='storeId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store</FormLabel>
                      <SelectDropdown
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder='Select a store'
                        items={stores?.stores?.map((store: any) => ({
                          label: `${store.name} - ${store.location}`,
                          value: store.id,
                        }))}
                        className='w-full'
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name='imageUrl'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='e.g., https://example.com/image.jpg'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button
            type='submit'
            form='product-form'
            disabled={isPending || isUpdating}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createStore } from '@/services/stores'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { type Store } from '../data/schema'

type StoresMutateDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Store
}

const formSchema = z.object({
  name: z.string().min(1, 'Store name is required.').max(255),
  location: z.string().min(1, 'Location is required.').max(255),
})
type StoreForm = z.infer<typeof formSchema>

export function TasksMutateDrawer({
  open,
  onOpenChange,
  currentRow,
}: StoresMutateDrawerProps) {
  const queryClient = useQueryClient()
  const isUpdate = !!currentRow

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createStore,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] })
    },
    mutationKey: ['create-store'],
  })

  const form = useForm<StoreForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow ?? {
      name: '',
      location: '',
    },
  })

  const onSubmit = (data: StoreForm) => {
    const storePayload = {
      name: data.name,
      location: data.location,
    }
    toast.promise(
      mutateAsync(storePayload, {
        onSuccess: (_data) => {
          queryClient.invalidateQueries({ queryKey: ['stores'] })
          form.reset()
          onOpenChange(false)
        },
        onError: (error) => {
          toast.error(error.message || 'Error creating store, please try again')
        },
      }),
      {
        loading: isUpdate ? 'Updating store...' : 'Creating store...',
        success: isUpdate
          ? 'Store updated successfully!'
          : 'Store created successfully!',
        error: (err) => `Error: ${err.message}`,
      }
    )
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        form.reset()
      }}
    >
      <SheetContent className='flex flex-col'>
        <SheetHeader className='text-start'>
          <SheetTitle>{isUpdate ? 'Update' : 'Create'} Store</SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Update the store by providing necessary info.'
              : 'Add a new store by providing necessary info.'}
            Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            id='stores-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex-1 space-y-6 overflow-y-auto px-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter store name' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='location'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Enter location (e.g., City, State)'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <SheetFooter className='gap-2'>
          <SheetClose asChild>
            <Button variant='outline'>Close</Button>
          </SheetClose>
          <Button form='stores-form' type='submit' disabled={isPending}>
            Save changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

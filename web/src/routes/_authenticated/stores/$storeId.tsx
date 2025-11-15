import { createFileRoute } from '@tanstack/react-router'
import StoreDetails from '@/features/stores/store'

export const Route = createFileRoute('/_authenticated/stores/$storeId')({
  component: StoreDetails,
})

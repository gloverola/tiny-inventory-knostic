/**
 * EmptyState Component Usage Examples
 *
 * This file demonstrates various ways to use the EmptyState component
 * with different configurations for different scenarios.
 */
import { Plus, RefreshCw, Upload, Filter } from 'lucide-react'
import { EmptyState } from './empty-state'

// Example 1: Basic empty state with default props
export function BasicEmptyState() {
  return <EmptyState />
}

// Example 2: Custom title and description
export function CustomTextEmptyState() {
  return (
    <EmptyState
      title='No products in your inventory'
      description='Get started by adding your first product to track inventory levels and manage stock.'
    />
  )
}

// Example 3: With primary action button
export function EmptyStateWithAction() {
  const handleAddProduct = () => {
    console.log('Add product clicked')
  }

  return (
    <EmptyState
      title='Your inventory is empty'
      description='Start building your product catalog by adding your first item.'
      primaryAction={{
        label: 'Add Product',
        onClick: handleAddProduct,
        icon: <Plus className='h-4 w-4' />,
        variant: 'default',
      }}
    />
  )
}

// Example 4: With primary and secondary actions
export function EmptyStateWithMultipleActions() {
  const handleImport = () => {
    console.log('Import clicked')
  }

  const handleAddManually = () => {
    console.log('Add manually clicked')
  }

  return (
    <EmptyState
      title='No products found'
      description='Import products from a CSV file or add them manually to get started.'
      primaryAction={{
        label: 'Import Products',
        onClick: handleImport,
        icon: <Upload className='h-4 w-4' />,
      }}
      secondaryAction={{
        label: 'Add Manually',
        onClick: handleAddManually,
        icon: <Plus className='h-4 w-4' />,
        variant: 'outline',
      }}
    />
  )
}

// Example 5: Small size variant
export function SmallEmptyState() {
  return (
    <EmptyState
      title='No results'
      description='Try different search terms'
      size='sm'
    />
  )
}

// Example 6: Large size variant
export function LargeEmptyState() {
  return (
    <EmptyState
      title='Welcome to Tiny Inventory'
      description='Your inventory management journey begins here. Add products, track stock, and manage multiple stores all in one place.'
      size='lg'
      primaryAction={{
        label: 'Get Started',
        onClick: () => console.log('Get started'),
        variant: 'default',
      }}
    />
  )
}

// Example 7: Without image
export function EmptyStateWithoutImage() {
  return (
    <EmptyState
      title='No filters applied'
      description='Select filters from the toolbar above to narrow down your search.'
      showImage={false}
      size='sm'
    />
  )
}

// Example 8: Custom image
export function EmptyStateWithCustomImage() {
  return (
    <EmptyState
      title='No stores found'
      description='Create your first store location to start managing inventory.'
      imageSrc='/images/store-empty.png'
      imageAlt='No stores'
    />
  )
}

// Example 9: With custom children content
export function EmptyStateWithCustomContent() {
  return (
    <EmptyState
      title='Search returned no results'
      description="We searched everywhere but couldn't find what you're looking for."
    >
      <div className='text-muted-foreground flex flex-col gap-2 text-sm'>
        <p className='font-semibold'>Suggestions:</p>
        <ul className='list-inside list-disc space-y-1 text-left'>
          <li>Check your spelling</li>
          <li>Try more general keywords</li>
          <li>Remove some filters</li>
        </ul>
      </div>
    </EmptyState>
  )
}

// Example 10: Filtered results empty state
export function FilteredEmptyState() {
  const handleClearFilters = () => {
    console.log('Clear filters')
  }

  const handleResetSearch = () => {
    console.log('Reset search')
  }

  return (
    <EmptyState
      title='No matching products'
      description='Your current filters are too restrictive. Try adjusting them to see more results.'
      primaryAction={{
        label: 'Clear Filters',
        onClick: handleClearFilters,
        icon: <Filter className='h-4 w-4' />,
        variant: 'default',
      }}
      secondaryAction={{
        label: 'Reset Search',
        onClick: handleResetSearch,
        icon: <RefreshCw className='h-4 w-4' />,
        variant: 'outline',
      }}
      size='md'
    />
  )
}

// Example 11: Error state variation
export function ErrorEmptyState() {
  const handleRetry = () => {
    console.log('Retry clicked')
  }

  return (
    <EmptyState
      title='Failed to load products'
      description='Something went wrong while loading your products. Please try again.'
      primaryAction={{
        label: 'Retry',
        onClick: handleRetry,
        icon: <RefreshCw className='h-4 w-4' />,
      }}
      imageClassName='opacity-30'
    />
  )
}

// Example 12: Contextual empty state (in a data table)
export function DataTableEmptyState() {
  const handleAddProduct = () => {
    console.log('Navigate to add product')
  }

  const handleClearFilters = () => {
    console.log('Clear all filters')
  }

  const hasActiveFilters = true // This would come from your filter state

  if (hasActiveFilters) {
    return (
      <EmptyState
        title='No products match your filters'
        description='Try adjusting or clearing your filters to see more results.'
        size='md'
        primaryAction={{
          label: 'Clear Filters',
          onClick: handleClearFilters,
          icon: <Filter className='h-4 w-4' />,
        }}
      />
    )
  }

  return (
    <EmptyState
      title='No products yet'
      description='Get started by adding your first product to the inventory.'
      size='md'
      primaryAction={{
        label: 'Add Product',
        onClick: handleAddProduct,
        icon: <Plus className='h-4 w-4' />,
      }}
    />
  )
}

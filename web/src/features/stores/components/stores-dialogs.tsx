import { ConfirmDialog } from '@/components/confirm-dialog'
import { StoresImportDialog } from './stores-import-dialog'
import { TasksMutateDrawer } from './stores-mutate-drawer'
import { useStores } from './stores-provider'

export function StoresDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useStores()
  return (
    <>
      <TasksMutateDrawer
        key='task-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      <StoresImportDialog
        key='stores-import'
        open={open === 'import'}
        onOpenChange={() => setOpen('import')}
      />

      {currentRow && (
        <>
          <TasksMutateDrawer
            key={`task-update-${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={() => {
              setOpen('update')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <ConfirmDialog
            key='task-delete'
            destructive
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            handleConfirm={() => {
              setOpen(null)
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            className='max-w-md'
            title={`Delete store: ${currentRow.name}?`}
            desc={
              <>
                You are about to delete the store{' '}
                <strong>{currentRow.name}</strong> (ID: {currentRow.id}). <br />
                This action cannot be undone.
              </>
            }
            confirmText='Delete'
          />
        </>
      )}
    </>
  )
}

import { getRouteApi } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { StoresDialogs } from './components/stores-dialogs'
import { StoresPrimaryButtons } from './components/stores-primary-buttons'
import { StoresProvider } from './components/stores-provider'
import { StoresTable } from './components/stores-table'
import { stores } from './data/stores'

const route = getRouteApi('/_authenticated/stores/')

export function Stores() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  return (
    <StoresProvider>
      <Header fixed className='w-full'>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Stores</h2>
            <p className='text-muted-foreground'>
              View and manage available stores here.
            </p>
          </div>
          <StoresPrimaryButtons />
        </div>
        <StoresTable data={stores} search={search} navigate={navigate} />
      </Main>

      <StoresDialogs />
    </StoresProvider>
  )
}

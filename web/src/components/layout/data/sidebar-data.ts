import {
  LayoutDashboard,
  ListTodo,
  HelpCircle,
  Settings,
  Users,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'glover',
    email: 'info.gloverr@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Stores',
          url: '/stores',
          icon: ListTodo,
        },
        {
          title: 'Products',
          url: '/products',
          icon: Users,
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: Settings,
          url: '/settings',
        },
        {
          title: 'Help Center',
          url: '/help-center',
          icon: HelpCircle,
        },
      ],
    },
  ],
}

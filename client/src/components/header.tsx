import { useAuthStore } from '@/store/authStore'
import { SidebarTrigger } from '@/components/ui/sidebar'

const Header = () => {
  const { user } = useAuthStore()
  return (
    <header className="relative flex justify-center items-center w-full py-2 sm:py-4 font-dancing text-3xl lg:text-[60px]">
      <div className="md:hidden absolute left-4 top-1/2 -translate-y-1/2 z-50">
        <SidebarTrigger className="text-yellow-600 hover:bg-yellow-200" />
      </div>
      <span>{user?.name}, RN 2026</span>
    </header>
  )
}

export default Header

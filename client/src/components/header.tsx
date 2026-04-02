import { useAuthStore } from '@/store/authStore'

const Header = () => {
  const { user } = useAuthStore()
  return (
    <header className="flex justify-center items-center w-full font-dancing text-3xl lg:text-[60px]">
      {user?.name}, RN 2026
    </header>
  )
}

export default Header

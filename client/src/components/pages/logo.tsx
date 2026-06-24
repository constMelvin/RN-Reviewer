import { cn } from '@/lib/utils'

export const Logo = ({ className, ...props }: React.ComponentProps<'img'>) => {
  return (
    <img
      src="pnlelogo.png"
      alt="logo"
      className={cn('size-7', className)}
      {...props}
    />
  )
}

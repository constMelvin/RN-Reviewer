'use client'

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
import { Separator } from '@/components/ui/separator'
import { Logo } from '@/components/logo'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Link } from '@tanstack/react-router'
import { router } from '@/main'
import { signIn, useSession } from '@/lib/auth-client'
import { Eye, EyeOff, LoaderIcon } from 'lucide-react'
import { useState } from 'react'
import { client } from '@/lib/client'
import { sileo } from 'sileo'

const formSchema = z.object({
  emailOrUsername: z.string().min(1, 'Email or Username is required'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  rememberMe: z.boolean(),
})

const Login = () => {
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      emailOrUsername: '',
      password: '',
      rememberMe: false,
    },
    resolver: zodResolver(formSchema),
  })
  const { refetch } = useSession()

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true)

    await sileo.promise(
      async () => {
        const res = await client.api.user.login.$post({
          json: data,
        })

        const json = await res.json()

        if (!res.ok) {
          setIsLoading(false)
          throw new Error(json?.message || 'Login failed')
        }

        await refetch()

        // router.update({
        //   context: { session: updatedFetch.data },
        // })

        await router.invalidate()

        setTimeout(() => {}, 1000)

        router.navigate({ to: '/' })

        return json
      },
      {
        loading: { title: 'Logging in...' },
        success: () => ({
          title: 'Login successful',
          duration: 1000,
        }),
        error: (err: any) => ({
          title: 'Login failed',
          description: err.message,
        }),
      },
    )

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full min-h-screen grid lg:grid-cols-2 p-4 gap-5">
        <div className="mx-auto max-w-md w-full flex flex-col items-center justify-center px-6 sm:px-12 md:px-20 py-8 rounded-lg bg-yellow-100">
          <Logo className="h-25 w-25" />
          <p className="text-xl font-semibold tracking-tight">
            Log in to PNLE {new Date().getFullYear()}
          </p>

          <Button
            className="mt-8 w-full gap-3 bg-yellow-300 hover:bg-yellow-300/80 cursor-pointer"
            onClick={async () => {
              const res = await signIn.social({
                provider: 'google',
                callbackURL: window.location.origin,
                errorCallbackURL: window.location.origin + '/login',
              })

              if (res?.data) {
                sileo.success({
                  title: 'Login successful',
                  duration: 1000,
                })
              }
            }}
          >
            <GoogleLogo />
            Continue with Google
          </Button>

          <div className="my-7 w-full flex items-center justify-center overflow-hidden">
            <Separator className="bg-black" />
            <span className="text-sm px-2">OR</span>
            <Separator className="bg-black" />
          </div>

          <Form {...form}>
            <form
              className="w-full space-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="emailOrUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email or Username</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Email or Username"
                        className="w-full border-yellow-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => {
                  const [showPassword, setShowPassword] = useState(false)

                  return (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            className="w-full border-yellow-400 pr-10" // space for the eye icon
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="mt-4 w-full bg-yellow-300 hover:bg-yellow-300/80 cursor-pointer"
              >
                {isLoading ? (
                  <LoaderIcon color="black" className="animate-spin" />
                ) : (
                  'Login with Email or Username'
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-5 space-y-5">
            <Link
              to="/forgot-password"
              className="text-sm block underline text-muted-foreground hover:text-yellow-300 text-center"
            >
              Forgot your password?
            </Link>
            <p className="text-sm text-center">
              Don&apos;t have an account?
              <Link
                to="/sign-up"
                className="ml-1 underline text-muted-foreground hover:text-yellow-300"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
        <div className="bg-muted hidden lg:block rounded-lg border overflow-hidden">
          <img
            src="pnlebg1.png
          "
            alt=""
            className="w-full h-full object-fit"
          />
        </div>
      </div>
    </div>
  )
}

const GoogleLogo = () => (
  <svg
    width="1.2em"
    height="1.2em"
    id="icon-google"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="inline-block shrink-0 align-sub text-inherit size-lg"
  >
    <g clipPath="url(#clip0)">
      <path
        d="M15.6823 8.18368C15.6823 7.63986 15.6382 7.0931 15.5442 6.55811H7.99829V9.63876H12.3194C12.1401 10.6323 11.564 11.5113 10.7203 12.0698V14.0687H13.2983C14.8122 12.6753 15.6823 10.6176 15.6823 8.18368Z"
        fill="#4285F4"
      ></path>
      <path
        d="M7.99812 16C10.1558 16 11.9753 15.2915 13.3011 14.0687L10.7231 12.0698C10.0058 12.5578 9.07988 12.8341 8.00106 12.8341C5.91398 12.8341 4.14436 11.426 3.50942 9.53296H0.849121V11.5936C2.2072 14.295 4.97332 16 7.99812 16Z"
        fill="#34A853"
      ></path>
      <path
        d="M3.50665 9.53295C3.17154 8.53938 3.17154 7.4635 3.50665 6.46993V4.4093H0.849292C-0.285376 6.66982 -0.285376 9.33306 0.849292 11.5936L3.50665 9.53295Z"
        fill="#FBBC04"
      ></path>
      <path
        d="M7.99812 3.16589C9.13867 3.14825 10.241 3.57743 11.067 4.36523L13.3511 2.0812C11.9048 0.723121 9.98526 -0.0235266 7.99812 -1.02057e-05C4.97332 -1.02057e-05 2.2072 1.70493 0.849121 4.40932L3.50648 6.46995C4.13848 4.57394 5.91104 3.16589 7.99812 3.16589Z"
        fill="#EA4335"
      ></path>
    </g>
    <defs>
      <clipPath id="clip0">
        <rect width="15.6825" height="16" fill="white"></rect>
      </clipPath>
    </defs>
  </svg>
)

export default Login

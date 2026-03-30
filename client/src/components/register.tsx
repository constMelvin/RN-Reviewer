import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { Logo } from '@/components/logo'
import { Label } from './ui/label'
import { useEffect, useState } from 'react'
import { CheckIcon, EyeIcon, EyeOffIcon, LoaderIcon, XIcon } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { isUsernameAvailable } from '@/lib/auth-client'
import { client } from '@/lib/client'
import { sileo } from 'sileo'

const Register = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [data, SetData] = useState({
    name: '',
    email: '',
    password: '',
    username: '',
  })
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [isUsernameValid, setIsUsernameValid] = useState<boolean | null>(null)
  const toggleVisibility = () => setIsVisible((prevState) => !prevState)
  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: 'At least 8 characters' },
      { regex: /[0-9]/, text: 'At least 1 number' },
      { regex: /[a-z]/, text: 'At least 1 lowercase letter' },
      { regex: /[A-Z]/, text: 'At least 1 uppercase letter' },
      {
        regex: /[!@#$%^&*(),.?":{}|<>]/,
        text: 'At least 1 special character',
      },
    ]
    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }))
  }
  const strength = checkStrength(data.password)
  const isPasswordValid = (pass: string) => {
    const results = checkStrength(pass)
    return results.every((r) => r.met)
  }
  const isValidEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
    data.email.trim(),
  )

  useEffect(() => {
    if (!data.username.trim()) {
      setIsUsernameValid(null)
      return
    }

    let isMounted = true

    const checkUsername = async () => {
      try {
        const res = await isUsernameAvailable({ username: data.username })
        if (isMounted) setIsUsernameValid(res.data?.available ?? false)
      } catch (err) {
        if (isMounted) setIsUsernameValid(false)
        console.error(err)
      }
    }

    checkUsername()

    return () => {
      isMounted = false
    }
  }, [data.username])

  const handleSubmitSignUp = async () => {
    if (!isPasswordValid(data.password) && !isValidEmail) {
      sileo.error({
        title: 'Email and Password',
        description: 'Email and Password are required valid.',
      })
      return
    }
    if (!isUsernameValid) {
      sileo.error({
        title: 'Username',
        description: 'Username Already exists.',
      })
      return
    }
    const updatedData = {
      ...data,
      name: `${firstName} ${lastName}`,
    }
    try {
      setIsLoading(true)
      const res = await client.api.user.register.$post({ json: updatedData })
      setFirstName('')
      setLastName('')
      SetData({
        name: '',
        email: '',
        password: '',
        username: '',
      })
      sileo.success({
        title: 'User Created.',
        description: 'User Created Successfully.',
        duration: 3000,
        fill: '#171717',
        styles: {
          description: 'text-white',
        },
      })
    } catch (err: any) {
      console.error(err)
      alert(err?.response?.data.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-full h-full grid lg:grid-cols-2 p-4 gap-5 min-h-screen">
        <div className="flex items-center justify-center">
          <div className="max-w-md w-full h-full flex flex-col items-center px-20 py-3 rounded-lg bg-yellow-100">
            <Logo className="h-20 w-20" />
            <p className="my-2 font-semibold text-xl tracking-tight">
              Sign up for PNLE Reviewer
            </p>

            <div className="space-y-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstname" className="block text-sm">
                    Firstname
                  </Label>
                  <Input
                    className="max-w-xs focus-visible:border-yellow-500 focus-visible:ring-[3px] focus-visible:ring-yellow-500/20 border-yellow-400"
                    type="text"
                    placeholder="Enter First Name"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastname" className="block text-sm">
                    Lastname
                  </Label>
                  <Input
                    className="max-w-xs focus-visible:border-yellow-500 focus-visible:ring-[3px] focus-visible:ring-yellow-500/20 border-yellow-400"
                    placeholder="Enter Last Name"
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="block text-sm">
                  Username
                </Label>
                <div className="relative">
                  <Input
                    className="max-w-xs focus-visible:border-yellow-500 focus-visible:ring-[3px] focus-visible:ring-yellow-500/20 border-yellow-400"
                    type="text"
                    required
                    placeholder="Enter Username"
                    value={data.username}
                    onChange={(e) =>
                      SetData((prev) => ({ ...prev, username: e.target.value }))
                    }
                  />
                  {data.username.trim() !== '' &&
                    (isUsernameValid ? (
                      <CheckIcon
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5"
                        aria-hidden="true"
                      />
                    ) : (
                      <XIcon
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 w-5 h-5"
                        aria-hidden="true"
                      />
                    ))}
                </div>
              </div>{' '}
              <div className="space-y-2">
                <Label htmlFor="email" className="block text-sm">
                  Email
                </Label>
                <div className="relative">
                  <Input
                    className="max-w-xs focus-visible:border-yellow-500 focus-visible:ring-[3px] focus-visible:ring-yellow-500/20 border-yellow-400"
                    placeholder="Enter Email"
                    type="email"
                    required
                    value={data.email}
                    onChange={(e) =>
                      SetData((prev) => ({ ...prev, email: e.target.value }))
                    }
                  />
                  {data.email.trim() !== '' &&
                    (isValidEmail ? (
                      <CheckIcon
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5"
                        aria-hidden="true"
                      />
                    ) : (
                      <XIcon
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 w-5 h-5"
                        aria-hidden="true"
                      />
                    ))}
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="pwd" className="text-sm">
                    Password
                  </Label>
                </div>
                <div className="relative">
                  <Input
                    className="max-w-xs focus-visible:border-yellow-500 focus-visible:ring-[3px] focus-visible:ring-yellow-500/20 border-yellow-400"
                    onChange={(e) =>
                      SetData((prev) => ({ ...prev, password: e.target.value }))
                    }
                    placeholder="Create a strong password"
                    type={isVisible ? 'text' : 'password'}
                    value={data.password}
                  />
                  <button
                    aria-label={isVisible ? 'Hide password' : 'Show password'}
                    aria-pressed={isVisible}
                    className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px]"
                    onClick={toggleVisibility}
                    type="button"
                  >
                    {isVisible ? (
                      <EyeOffIcon className="size-5" />
                    ) : (
                      <EyeIcon className="size-5" />
                    )}
                  </button>
                </div>
              </div>
              <ul aria-label="Password requirements" className="space-y-1.5">
                {strength.map((req) => (
                  <li className="flex items-center gap-1" key={req.text}>
                    {req.met ? (
                      <CheckIcon
                        className="size-3.5 text-green-500"
                        aria-hidden="true"
                      />
                    ) : (
                      <XIcon
                        className=" text-red-500 size-3.5"
                        aria-hidden="true"
                      />
                    )}
                    <span
                      className={`text-xs transition-colors ${req.met ? 'text-green-600' : 'text-muted-foreground'}`}
                    >
                      {req.text}
                      <span className="sr-only">
                        {req.met
                          ? ' - Requirement met'
                          : ' - Requirement not met'}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
              <Button
                className="mt-4 w-full gap-3 bg-yellow-300 hover:bg-yellow-300/80 cursor-pointer"
                onClick={handleSubmitSignUp}
              >
                {isLoading ? (
                  <LoaderIcon color="black" className="animate-spin" />
                ) : (
                  'Sign Up'
                )}
              </Button>
            </div>

            <p className="mt-5 text-center text-sm">
              Already have an account?
              <Link
                to={'/login'}
                className="ml-1 underline text-muted-foreground hover:text-yellow-300"
              >
                Log in
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

export default Register

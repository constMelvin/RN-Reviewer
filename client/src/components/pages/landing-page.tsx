'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
<<<<<<<< HEAD:client/src/pages/landing-page.tsx
import { Logo } from '@/pages/logo'
========
import { Logo } from '@/components/pages/logo'
>>>>>>>> main:client/src/components/pages/landing-page.tsx
import { Separator } from '@/components/ui/separator'
import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import {
  BookOpen,
  CheckCircle2,
  BarChart3,
  CalendarDays,
  Stethoscope,
  ArrowRight,
  Sparkles,
  Shield,
  GraduationCap,
  Clock,
  Target,
  Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { differenceInDays } from 'date-fns'

// ─── Animated counter ─────────────────────────────────────────────────────────
const AnimatedCounter = ({
  target,
  suffix = '',
}: {
  target: number
  suffix?: string
}) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [target])

  return (
    <span>
      {count}
      {suffix}
    </span>
  )
}

// ─── Floating particles ───────────────────────────────────────────────────────
const FloatingParticle = ({
  delay,
  size,
  x,
  y,
}: {
  delay: number
  size: number
  x: string
  y: string
}) => (
  <motion.div
    className="absolute rounded-full bg-yellow-400/20"
    style={{ width: size, height: size, left: x, top: y }}
    animate={{
      y: [0, -30, 0],
      opacity: [0.3, 0.7, 0.3],
      scale: [1, 1.2, 1],
    }}
    transition={{
      duration: 4,
      delay,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  />
)

// ─── Feature card ─────────────────────────────────────────────────────────────
const FeatureCard = ({
  icon: Icon,
  title,
  description,
  gradient,
  index,
}: {
  icon: React.ElementType
  title: string
  description: string
  gradient: string
  index: number
}) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
  >
    <Card className="group relative overflow-hidden border border-yellow-200/60 bg-white/70 backdrop-blur-sm p-6 hover:shadow-xl hover:shadow-yellow-200/30 transition-all duration-500 hover:-translate-y-1 cursor-default">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className={`absolute inset-0 ${gradient} opacity-[0.04]`} />
      </div>
      <div className="relative z-10">
        <div className={`inline-flex p-3 rounded-xl ${gradient} mb-4`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
      </div>
    </Card>
  </motion.div>
)

// ─── Stat card ────────────────────────────────────────────────────────────────
const StatCard = ({
  value,
  suffix,
  label,
  index,
}: {
  value: number
  suffix?: string
  label: string
  index: number
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.15 }}
    className="text-center"
  >
    <p className="text-4xl md:text-5xl font-extrabold text-yellow-600">
      <AnimatedCounter target={value} suffix={suffix} />
    </p>
    <p className="text-sm text-gray-500 mt-1 font-medium">{label}</p>
  </motion.div>
)

// ─── Main Landing Page ────────────────────────────────────────────────────────
const LandingPage = () => {
  const NLE_DATE = new Date(`${import.meta.env.VITE_NLE_DATE}`)
  const daysLeft = differenceInDays(NLE_DATE, new Date())
  const year = new Date().getFullYear()

  const features = [
    {
      icon: BookOpen,
      title: 'Smart Reviewer',
      description:
        'Organize review books into topics and subtopics with deadlines, status tracking, and reference links. Stay on top of NP1–NP5.',
      gradient: 'bg-gradient-to-br from-yellow-400 to-amber-500',
    },
    {
      icon: CheckCircle2,
      title: 'Task Tracker',
      description:
        'Log and manage your study tasks with completion tracking and overdue alerts. Never miss a deadline again.',
      gradient: 'bg-gradient-to-br from-emerald-400 to-green-500',
    },
    {
      icon: BarChart3,
      title: 'Score Tracker',
      description:
        'Record mock exam and practice test scores by subject and exam type. Visualize your progress over time.',
      gradient: 'bg-gradient-to-br from-blue-400 to-indigo-500',
    },
    {
      icon: CalendarDays,
      title: 'Daily Agenda',
      description:
        'Plan and track daily study goals with a real-time sidebar planner. Build consistent study habits.',
      gradient: 'bg-gradient-to-br from-purple-400 to-violet-500',
    },
    {
      icon: Shield,
      title: 'Secure Access',
      description:
        'Sign in with email/password or Google OAuth. Your data is protected with enterprise-grade authentication.',
      gradient: 'bg-gradient-to-br from-rose-400 to-pink-500',
    },
    {
      icon: Clock,
      title: 'NLE Countdown',
      description:
        'A live countdown to exam day keeps you focused and motivated. Review progress tracked in real time.',
      gradient: 'bg-gradient-to-br from-orange-400 to-red-500',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-amber-50/30 overflow-hidden">
      {/* ── Background decorations ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-yellow-200/40 to-amber-100/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-amber-200/30 to-yellow-100/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-yellow-100/20 to-transparent rounded-full blur-3xl" />
        <FloatingParticle delay={0} size={8} x="10%" y="20%" />
        <FloatingParticle delay={1} size={6} x="80%" y="15%" />
        <FloatingParticle delay={2} size={10} x="70%" y="60%" />
        <FloatingParticle delay={0.5} size={7} x="20%" y="70%" />
        <FloatingParticle delay={1.5} size={5} x="90%" y="40%" />
        <FloatingParticle delay={3} size={9} x="40%" y="85%" />
        <FloatingParticle delay={2.5} size={6} x="55%" y="10%" />
      </div>

      {/* ── Navbar ── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-20 flex items-center justify-between px-6 md:px-12 lg:px-20 py-4 backdrop-blur-md bg-white/60 border-b border-yellow-100/50"
      >
        <div className="flex items-center gap-3">
          <Logo className="h-10 w-10" />
          <div className="flex items-center gap-1.5">
            <Stethoscope className="h-5 w-5 text-yellow-600" />
            <span className="font-story text-2xl font-bold text-yellow-700">
              PNLE {year}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button
              variant="ghost"
              className="text-yellow-700 hover:text-yellow-800 hover:bg-yellow-100/60 font-medium cursor-pointer"
            >
              Log In
            </Button>
          </Link>
          <Link to="/sign-up">
            <Button className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white font-semibold shadow-lg shadow-yellow-300/30 hover:shadow-yellow-400/40 transition-all duration-300 cursor-pointer">
              Get Started
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </motion.nav>

      {/* ── Hero Section ── */}
      <section className="relative z-10 px-6 md:px-12 lg:px-20 pt-16 md:pt-24 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-100 border border-yellow-200 mb-6"
              >
                <Sparkles className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-semibold text-yellow-700">
                  Philippine Nursing Licensure Exam
                </span>
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                Your path to{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500">
                  becoming an RN
                </span>{' '}
                starts here.
              </h1>

              <p className="mt-6 text-lg text-gray-500 leading-relaxed max-w-lg">
                The all-in-one study companion for aspiring Filipino nurses.
                Organize your review, track your progress, and ace the PNLE with
                confidence.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link to="/sign-up">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white font-bold text-base px-8 shadow-xl shadow-yellow-300/30 hover:shadow-yellow-400/50 transition-all duration-300 cursor-pointer"
                  >
                    <GraduationCap className="mr-2 h-5 w-5" />
                    Start Reviewing Now
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-yellow-300 text-yellow-700 hover:bg-yellow-50 font-semibold text-base px-8 cursor-pointer"
                  >
                    I have an account
                  </Button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="mt-10 flex items-center gap-6">
                <div className="flex -space-x-2">
                  {[
                    'bg-yellow-400',
                    'bg-amber-400',
                    'bg-orange-400',
                    'bg-rose-400',
                  ].map((bg, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full ${bg} border-2 border-white flex items-center justify-center text-[10px] font-bold text-white`}
                    >
                      {['RN', 'SN', 'NP', 'BS'][i]}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-400">
                  Join nursing students preparing for the board exam
                </p>
              </div>
            </motion.div>

            {/* Right: Hero Card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="relative"
            >
              {/* Glow behind card */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/30 to-amber-300/30 rounded-3xl blur-2xl scale-95" />

              <Card className="relative overflow-hidden border-yellow-200/60 bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl shadow-yellow-200/20">
                {/* Countdown */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 text-white">
                    <div className="text-center">
                      <p className="text-3xl font-extrabold leading-none">
                        {daysLeft}
                      </p>
                      <p className="text-[10px] font-medium opacity-80 mt-0.5">
                        DAYS LEFT
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-800">
                      NLE Exam Day
                    </p>
                    <p className="text-sm text-gray-400">August 29, {year}</p>
                    <div className="mt-1.5 w-48 h-1.5 rounded-full bg-yellow-100 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min(100, Math.round(((365 - daysLeft) / 365) * 100))}%`,
                        }}
                        transition={{
                          duration: 1.5,
                          delay: 0.8,
                          ease: 'easeOut',
                        }}
                      />
                    </div>
                  </div>
                </div>

                <Separator className="bg-yellow-100 my-4" />

                {/* Preview features */}
                <div className="space-y-3">
                  {[
                    {
                      icon: BookOpen,
                      label: 'NP1 – NP5 Reviewer Books',
                      color: 'text-yellow-600',
                      bg: 'bg-yellow-100',
                    },
                    {
                      icon: CheckCircle2,
                      label: 'Daily Task & Agenda Tracker',
                      color: 'text-emerald-600',
                      bg: 'bg-emerald-100',
                    },
                    {
                      icon: BarChart3,
                      label: 'Mock Exam Score Analytics',
                      color: 'text-blue-600',
                      bg: 'bg-blue-100',
                    },
                    {
                      icon: Target,
                      label: 'Progress & Deadline Monitoring',
                      color: 'text-purple-600',
                      bg: 'bg-purple-100',
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.15 }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50/80 border border-gray-100"
                    >
                      <div className={`p-2 rounded-lg ${item.bg}`}>
                        <item.icon className={`h-4 w-4 ${item.color}`} />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {item.label}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Decorative gradient corner */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-yellow-200/40 to-transparent rounded-bl-[100px]" />
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats Section ── */}
      <section className="relative z-10 py-16 bg-gradient-to-r from-yellow-400/5 via-amber-50/50 to-yellow-400/5">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard value={5} label="Nursing Practices" index={0} />
            <StatCard value={100} suffix="+" label="Review Topics" index={1} />
            <StatCard value={365} label="Days of Prep" index={2} />
            <StatCard value={24} suffix="/7" label="Access Anytime" index={3} />
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="relative z-10 px-6 md:px-12 lg:px-20 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-100 border border-yellow-200 text-sm font-semibold text-yellow-700 mb-4">
              <Sparkles className="h-4 w-4" />
              Everything You Need
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-3">
              Built for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-600">
                serious reviewers
              </span>
            </h2>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-lg">
              Every tool you need to organize, track, and optimize your PNLE
              review — all in one beautiful dashboard.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} {...feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="relative z-10 px-6 md:px-12 lg:px-20 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-400 p-10 md:p-14 rounded-3xl shadow-2xl shadow-yellow-300/30">
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 1px)`,
                  backgroundSize: '24px 24px',
                }}
              />
            </div>

            <div className="relative z-10 text-center">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="inline-block mb-6"
              >
                <GraduationCap className="h-16 w-16 text-white/90" />
              </motion.div>

              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                Ready to ace the PNLE?
              </h2>
              <p className="text-white/80 text-lg max-w-lg mx-auto mb-8">
                Join fellow nursing students who are already using this platform
                to organize their review and track their progress.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/sign-up">
                  <Button
                    size="lg"
                    className="bg-white text-yellow-700 hover:bg-yellow-50 font-bold text-base px-10 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
                  >
                    Create Free Account
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white/40 text-yellow-700 hover:bg-white/10 font-semibold text-base px-10 cursor-pointer"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-xl" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/5 rounded-full blur-2xl" />
          </Card>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-yellow-100/60 bg-white/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-10">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="flex items-center gap-3">
              <Logo className="h-8 w-8" />
              <div className="flex items-center gap-1.5">
                <Stethoscope className="h-4 w-4 text-yellow-600" />
                <span className="font-story text-xl font-bold text-yellow-700">
                  PNLE {year}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-400">
              © {year} constMelvin. Built for Filipino nursing students.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage

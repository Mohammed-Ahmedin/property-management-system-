"use client"

import { motion } from "framer-motion"
import { Users, Home, Star, MapPin, Shield, Zap } from "lucide-react"
import React from "react"

interface StatCard {
  id: string
  icon: React.ReactNode
  label: string
  value: number
  suffix?: string
  description: string
  color: string
}

const stats: StatCard[] = [
  {
    id: "guests",
    icon: <Users className="w-6 h-6" />,
    label: "Happy Guests",
    value: 45200,
    suffix: "+",
    description: "Trusted travelers worldwide",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "properties",
    icon: <Home className="w-6 h-6" />,
    label: "Beautiful Properties",
    value: 3500,
    suffix: "+",
    description: "Handpicked properties",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "reviews",
    icon: <Star className="w-6 h-6" />,
    label: "5-Star Reviews",
    value: 98,
    suffix: "%",
    description: "Outstanding guest experiences",
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "destinations",
    icon: <MapPin className="w-6 h-6" />,
    label: "Destinations",
    value: 125,
    suffix: "+",
    description: "Explore amazing locations",
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "verified",
    icon: <Shield className="w-6 h-6" />,
    label: "Verified Hosts",
    value: 100,
    suffix: "%",
    description: "Safe & secure bookings",
    color: "from-red-500 to-rose-500",
  },
  {
    id: "instant",
    icon: <Zap className="w-6 h-6" />,
    label: "Instant Booking",
    value: 24,
    suffix: "/7",
    description: "Book anytime, anywhere",
    color: "from-indigo-500 to-blue-500",
  },
]

function AnimatedCounter({ value, suffix }: { value: number; suffix?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, margin: "-100px" }}
      className="flex items-baseline gap-1"
    >
      <motion.span className="text-4xl font-bold text-foreground">
        <CountUp value={value} />
      </motion.span>
      {suffix && <span className="text-lg text-muted-foreground font-semibold">{suffix}</span>}
    </motion.div>
  )
}

function CountUp({ value }: { value: number }) {
  const ref = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !ref.current?.hasAttribute("data-animated")) {
        ref.current?.setAttribute("data-animated", "true")
        // animateValue(ref.current, 0, value, 2000)
      }
    })

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value])

  return <span ref={ref}>0</span>
}

function animateValue(element: HTMLElement, start: number, end: number, duration: number) {
  const startTime = Date.now()

  const animate = () => {
    const now = Date.now()
    const progress = Math.min((now - startTime) / duration, 1)
    const value = Math.floor(start + (end - start) * progress)

    element.textContent = value.toLocaleString()

    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }

  animate()
}

export function PropertyStats() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-background/50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Join Thousands of Happy Travelers</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover, book, and experience authentic properties worldwide. We make it simple, safe, and unforgettable.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {stats.map((stat) => (
            <motion.div key={stat.id} variants={itemVariants as any}>
              <div className="relative h-full overflow-hidden rounded-xl bg-card border border-border transition-all duration-300 hover:shadow-lg hover:shadow-foreground/5 hover:-translate-y-1 group">
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />

                {/* Content */}
                <div className="relative p-6 sm:p-8 h-full flex flex-col justify-between">
                  {/* Icon and Label */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-1">{stat.label}</p>
                      <p className="text-xs text-muted-foreground">{stat.description}</p>
                    </div>
                    <div
                      className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} text-white shadow-lg flex-shrink-0`}
                    >
                      {stat.icon}
                    </div>
                  </div>

                  {/* Counter Value */}
                  <div className="flex flex-col gap-4">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />

                    {/* Progress Bar */}
                    <div className="h-1.5 bg-border rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Badge Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="p-8 sm:p-10 rounded-xl bg-card border border-border backdrop-blur-sm"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground mb-1">Award Winning</p>
              <p className="text-sm text-muted-foreground">Industry leading platform</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground mb-1">Secure Payments</p>
              <p className="text-sm text-muted-foreground">Protected transactions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground mb-1">24/7 Support</p>
              <p className="text-sm text-muted-foreground">Always here to help</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground mb-1">Money-back Guarantee</p>
              <p className="text-sm text-muted-foreground">100% satisfaction promise</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

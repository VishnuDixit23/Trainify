"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Star,
  Zap,
  Target,
  Shield,
  Users,
  Instagram,
  Twitter,
  Youtube,
  Github,
  ChevronRight,
} from "lucide-react";
import Navigation from "./components/Navigation";
import SectionHeading from "./components/ui/SectionHeading";
import GlassCard from "./components/ui/GlassCard";
import GradientButton from "./components/ui/GradientButton";

/* ─── Feature Cards Data ─── */
const features = [
  {
    title: "AI Workout Plans",
    subtitle: "Personalized Training",
    description:
      "Get a fully customized weekly workout schedule tailored to your body, goals, and available equipment.",
    image: "/bglog3.jpg",
    href: "/login",
    tag: "Most Popular",
  },
  {
    title: "Smart Diet Plans",
    subtitle: "Nutrition Guidance",
    description:
      "Receive macro-optimized meal plans aligned with your fitness goals and dietary preferences.",
    image: "/diet.jpg",
    href: "/login",
    tag: "AI-Powered",
  },
  {
    title: "Progress Tracking",
    subtitle: "Journey Analytics",
    description:
      "Log every workout, track consistency, and visualize your transformation journey.",
    image: "/bglog4.jpg",
    href: "/login",
    tag: "Real-Time",
  },
  {
    title: "Custom Routines",
    subtitle: "800+ Exercises",
    description:
      "Build your own weekly training split from our extensive exercise library.",
    image: "/fitness.avif",
    href: "/login",
    tag: "Drag & Drop",
  },
];

/* ─── How It Works Data ─── */
const howItWorks = [
  {
    step: "01",
    title: "Create Your Profile",
    description:
      "Tell us about your age, weight, goals, fitness level, and available equipment.",
  },
  {
    step: "02",
    title: "AI Generates Your Plan",
    description:
      "Our AI engine creates a personalized workout and diet plan in seconds.",
  },
  {
    step: "03",
    title: "Train & Track",
    description:
      "Follow your plan, log workouts, and watch your progress compound over time.",
  },
];

/* ─── Testimonials Data ─── */
const testimonials = [
  {
    name: "Arjun Mehta",
    location: "Delhi, India",
    text: "Trainify replaced my personal trainer. The AI workout plans are incredibly detailed and adapt to my progress perfectly.",
    rating: 5,
  },
  {
    name: "Sarah Johnson",
    location: "New York, USA",
    text: "The diet planning feature is a game-changer. It considers my vegetarian preferences and still hits my protein goals.",
    rating: 5,
  },
  {
    name: "Rahul Sharma",
    location: "Mumbai, India",
    text: "I've tried many fitness apps, but Trainify's AI actually understands what I need. It's like having a coach in my pocket.",
    rating: 5,
  },
  {
    name: "Emily Chen",
    location: "San Francisco, USA",
    text: "The progress tracking keeps me accountable. I can see my improvement week over week and it's incredibly motivating.",
    rating: 5,
  },
];

/* ─── Why Trainify Data ─── */
const whyTrainify = [
  {
    icon: <Zap size={22} />,
    title: "AI-First Approach",
    description:
      "Every recommendation is personalized by AI, not generic templates.",
  },
  {
    icon: <Target size={22} />,
    title: "Goal-Oriented",
    description:
      "Whether you want to lose fat, gain muscle, or improve endurance — we adapt.",
  },
  {
    icon: <Shield size={22} />,
    title: "Science-Backed",
    description:
      "Plans based on exercise science principles for safe, effective training.",
  },
  {
    icon: <Users size={22} />,
    title: "Community-Driven",
    description:
      "Join fitness enthusiasts on the same journey as you.",
  },
];

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <main className="relative overflow-hidden bg-[#050505]">
      {/* ═══════ Navigation ═══════ */}
      <Navigation variant="landing" />

      {/* ═══════ Hero Section ═══════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background image with parallax zoom */}
        <motion.div style={{ scale: heroScale }} className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/hero-gym.jpg')" }}
          />
          {/* Heavy dark overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-[#050505]" />
        </motion.div>

        {/* Subtle gold gradient orb */}
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-brand-500/[0.04] rounded-full blur-[150px] animate-float pointer-events-none" />

        {/* Content */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 max-w-5xl mx-auto px-6 text-center"
        >
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
          >
            <span className="gradient-text-white">Your AI-Powered</span>
            <br />
            <span className="gradient-text">Fitness Companion</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-lg sm:text-xl text-surface-300 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Personalized workout plans, smart diet guidance, and real-time
            progress tracking — all tailored to your body, goals, and lifestyle.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/register">
              <GradientButton size="lg" icon={<Zap size={20} />}>
                Start Free Today
              </GradientButton>
            </Link>
            <GradientButton
              variant="secondary"
              size="lg"
              icon={<ArrowRight size={18} />}
              onClick={() => {
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Explore Features
            </GradientButton>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-6 h-10 rounded-full border-2 border-surface-600 flex items-start justify-center p-1.5"
          >
            <div className="w-1.5 h-3 rounded-full bg-brand-500/60" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════ Features Section — Image-Based Bento Grid ═══════ */}
      <section id="features" className="relative py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#0a0a0a] to-[#050505]" />
        <div className="relative section-container">
          <SectionHeading
            badge="Features"
            title="Everything You Need to Transform"
            subtitle="Four powerful AI-driven tools working together to accelerate your fitness journey."
          />

          {/* Bento grid — 2 large cards on top, 2 narrow cards below */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, i) => (
              <Link key={feature.title} href={feature.href}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: i * 0.12 }}
                  className="group relative h-[340px] sm:h-[380px] rounded-2xl overflow-hidden cursor-pointer"
                >
                  {/* Background image */}
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Gradient overlay — darkens bottom for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                  {/* Gold accent line at top */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Tag badge */}
                  <div className="absolute top-5 left-5">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-brand-500/15 text-brand-400 border border-brand-500/20 backdrop-blur-md">
                      {feature.tag}
                    </span>
                  </div>

                  {/* Content overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-7">
                    <p className="text-brand-400 text-xs font-semibold uppercase tracking-widest mb-2">
                      {feature.subtitle}
                    </p>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 group-hover:text-brand-300 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-surface-300 text-sm leading-relaxed mb-4 max-w-md">
                      {feature.description}
                    </p>

                    {/* Explore link */}
                    <div className="flex items-center gap-1.5 text-brand-400 text-sm font-medium translate-x-0 group-hover:translate-x-2 transition-transform duration-300">
                      Explore <ChevronRight size={16} />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ How It Works Section ═══════ */}
      <section id="how-it-works" className="relative py-16">
        <div className="absolute inset-0 bg-[#050505]" />
        <div className="absolute inset-0 grid-pattern opacity-20" />

        <div className="relative section-container">
          <SectionHeading
            badge="How It Works"
            title="Get Started in 3 Simple Steps"
            subtitle="From sign-up to your first AI-generated workout plan in under 2 minutes."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative text-center"
              >
                {/* Connector line */}
                {i < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-brand-500/20 to-transparent" />
                )}

                {/* Step number */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-500/5 border border-brand-500/15 mb-6">
                  <span className="text-2xl font-bold gradient-text">
                    {step.step}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-surface-400 leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ Why Trainify Section ═══════ */}
      <section className="relative py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#080808] to-[#050505]" />

        <div className="relative section-container">
          <SectionHeading
            badge="Why Trainify"
            title="Built Different. Built Better."
            subtitle="We're not another generic fitness app. Here's what sets us apart."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {whyTrainify.map((item, i) => (
              <GlassCard
                key={item.title}
                delay={i * 0.1}
                padding="p-6"
                className="text-center"
              >
                <div className="inline-flex p-3 rounded-xl bg-brand-500/5 text-brand-400 mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-surface-400 leading-relaxed">
                  {item.description}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ Testimonials Section ═══════ */}
      <section id="testimonials" className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[#050505]" />
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-brand-500/[0.03] rounded-full blur-[120px]" />

        <div className="relative section-container">
          <SectionHeading
            badge="Testimonials"
            title="Loved by Fitness Enthusiasts"
            subtitle="People around the world trust Trainify to guide their fitness journey."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {testimonials.map((t, i) => (
              <GlassCard key={t.name} delay={i * 0.1} padding="p-6">
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star
                      key={j}
                      size={14}
                      className="text-brand-400 fill-brand-400"
                    />
                  ))}
                </div>

                <p className="text-surface-300 text-sm leading-relaxed mb-5">
                  &ldquo;{t.text}&rdquo;
                </p>

                <div className="border-t border-white/5 pt-4">
                  <p className="text-sm font-medium text-white">{t.name}</p>
                  <p className="text-xs text-surface-500">{t.location}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA Section ═══════ */}
      <section className="relative py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#080805] to-[#050505]" />

        <div className="relative section-container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative glass rounded-3xl p-12 sm:p-16 text-center overflow-hidden gradient-border"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/[0.03] to-transparent" />
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-500/[0.06] rounded-full blur-[80px]" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-brand-600/[0.04] rounded-full blur-[80px]" />

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight gradient-text-white mb-4">
                Ready to Transform Your Body?
              </h2>
              <p className="text-lg text-surface-400 max-w-xl mx-auto mb-8">
                Join users who are already crushing their fitness goals with
                Trainify&apos;s AI-powered guidance.
              </p>
              <Link href="/register">
                <GradientButton size="lg" icon={<Zap size={20} />}>
                  Get Started — It&apos;s Free
                </GradientButton>
              </Link>
              <p className="mt-4 text-xs text-surface-500">
                No credit card required. Free forever.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ Footer ═══════ */}
      <footer className="relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
                  <Zap size={18} className="text-black" />
                </div>
                <span className="text-lg font-bold text-white">
                  Traini<span className="text-brand-400">fy</span>
                </span>
              </div>
              <p className="text-sm text-surface-500 leading-relaxed">
                AI-powered fitness companion. Personalized workout plans, smart
                diet guidance, and progress tracking.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Product
              </h4>
              <ul className="space-y-3">
                {[
                  "Workout Plans",
                  "Diet Plans",
                  "Progress Tracking",
                  "Exercise Library",
                ].map((link) => (
                  <li key={link}>
                    <Link
                      href="/login"
                      className="text-sm text-surface-500 hover:text-surface-300 transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Company
              </h4>
              <ul className="space-y-3">
                {[
                  "About Us",
                  "Privacy Policy",
                  "Terms of Service",
                  "Contact",
                ].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-surface-500 hover:text-surface-300 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social + Newsletter */}
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Follow Us
              </h4>
              <div className="flex gap-3">
                {[
                  { icon: <Instagram size={18} />, href: "#" },
                  { icon: <Twitter size={18} />, href: "#" },
                  { icon: <Youtube size={18} />, href: "#" },
                  { icon: <Github size={18} />, href: "#" },
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-surface-500 hover:text-brand-400 hover:bg-brand-500/5 border border-white/5 hover:border-brand-500/20 transition-all duration-200"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-semibold text-white mb-3">
                  Stay Updated
                </h4>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm bg-white/5 border border-white/10 text-surface-300 placeholder-surface-600 focus:outline-none focus:border-brand-500/40 transition-colors"
                  />
                  <button className="btn-glow px-4 py-2.5 rounded-xl text-sm font-medium text-black">
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-surface-600">
              © {new Date().getFullYear()} Trainify. Designed & built by Vishnu
              Dixit.
            </p>
            <p className="text-xs text-surface-600">
              AI-Powered Fitness Companion
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

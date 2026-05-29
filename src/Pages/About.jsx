import { useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Bot,
  Brain,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleCheckBig,
  Heart,
  HeartPulse,
  MessagesSquare,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Star,
  Activity,
  MapPinned,
  Mail,
  PhoneCall,
} from 'lucide-react'
import Header from '../Components/Header'
import Footer from '../Components/Home/Footer'
import heroIllustration from '../assets/banner.png'

const storySteps = [
  {
    year: '2022',
    title: 'A care gap was noticed',
    text: 'Mothers were juggling appointments, emotional stress, and urgent questions without one calm place to turn.',
  },
  {
    year: '2024',
    title: 'A supportive platform was shaped',
    text: 'We designed a soft, medically grounded experience that feels personal, safe, and emotionally reassuring.',
  },
  {
    year: 'Today',
    title: 'A growing motherhood network',
    text: 'We continue building tools, guidance, and expert support that help families feel informed at every stage.',
  },
]

const features = [
  {
    icon: CalendarDays,
    title: 'Week-wise Guidance',
    text: 'Timely pregnancy insights that adapt to each stage and help mothers feel prepared.',
  },
  {
    icon: Brain,
    title: 'Mental Health Support',
    text: 'Gentle emotional care for anxiety, stress, and the quiet moments that need support most.',
  },
  {
    icon: ShieldCheck,
    title: 'Emergency Service',
    text: 'Fast access to urgent guidance when every minute matters and clarity is critical.',
  },
  {
    icon: Bot,
    title: 'AI Chat Support',
    text: 'Always-on assistance for quick answers, navigation help, and reassurance between visits.',
  },
  {
    icon: Activity,
    title: 'Symptom Checker',
    text: 'A simple, calm tool for understanding common symptoms before deciding on next steps.',
  },
  {
    icon: HeartPulse,
    title: 'Secure Care Platform',
    text: 'A private and trustworthy experience built with a modern healthcare startup mindset.',
  },
]

const trustPoints = [
  'Medically verified guidance',
  'Privacy-first secure data handling',
  'Expert-backed support pathways',
  'Emotional wellness care built in',
]

const testimonialItems = [
  {
    name: 'Shila M.',
    role: 'First-time mother',
    rating: 5,
    text: 'The platform felt calm and personal. I never felt alone when I had a question about my pregnancy.',
  },
  {
    name: 'Rumana J.',
    role: 'Expecting parent',
    rating: 5,
    text: 'The emotional support cards and easy guidance made the whole experience feel trustworthy and modern.',
  },
  {
    name: 'Nusrat A.',
    role: 'Mother of two',
    rating: 5,
    text: 'I loved the balance of medical clarity and soft storytelling. It feels like a premium care experience.',
  },
]

const About = () => {
  const testimonialsRef = useRef(null)

  const scrollTestimonials = (direction) => {
    testimonialsRef.current?.scrollBy({
      left: direction * 360,
      behavior: 'smooth',
    })
  }

  return (
    <div className="bg-[#fff8fd] text-slate-900">
      <Header />

      <main className="relative isolate">
        <section className="relative overflow-hidden px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pb-20 lg:pt-14">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[38rem] bg-[radial-gradient(circle_at_top_left,rgba(255,95,162,0.20),transparent_35%),radial-gradient(circle_at_top_right,rgba(155,93,229,0.18),transparent_30%),linear-gradient(180deg,rgba(255,244,250,1),rgba(255,248,253,0.6))]" />
          <div className="pointer-events-none absolute left-8 top-24 h-28 w-28 rounded-full bg-pink-200/35 blur-3xl animate-pulse-glow" />
          <div className="pointer-events-none absolute right-10 top-32 h-36 w-36 rounded-full bg-purple-200/30 blur-3xl animate-pulse-glow" />

          <div className="mx-auto grid w-full max-w-7xl items-center gap-10 xl:grid-cols-[1.1fr_0.9fr] xl:gap-14">
            <div className="relative z-10">
              <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-pink-100 bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-pink-600 shadow-sm glass-card">
                <Sparkles className="h-4 w-4" />
                About Jotne Maa
              </div>

              <h1 className="animate-fade-up mt-6 max-w-3xl text-4xl font-black leading-[1.05] text-slate-950 sm:text-5xl lg:text-6xl">
                Supporting Every Mother, Every Step of the Way.
              </h1>

              <p className="animate-fade-up mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                We combine expert maternity guidance, emotional reassurance, and secure modern tools in one soft, elegant space so every mother feels seen, supported, and confident.
              </p>

              <div className="animate-fade-up mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/auth"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#FF5FA2] to-[#9B5DE5] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(155,93,229,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_50px_rgba(155,93,229,0.28)]"
                >
                  Join Our Journey
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/chatbot"
              
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/70 bg-white/80 px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-pink-200 hover:bg-pink-50/60 hover:text-pink-700"
                >
                  Talk To Care AI
                 
                </Link>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {[
                  { title: 'Trusted Care', text: 'Expert-led and medically grounded.' },
                  { title: 'Mental Wellness', text: 'Gentle emotional support built in.' },
                  { title: '24/7 Support', text: 'Always available when it matters.' },
                ].map((item, index) => (
                  <div
                    key={item.title}
                    className="glass-card animate-fade-up rounded-3xl p-4 shadow-[0_12px_40px_rgba(155,93,229,0.08)] transition-transform duration-300 hover:-translate-y-1"
                    style={{ animationDelay: `${index * 90}ms` }}
                  >
                    <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="absolute left-6 top-8 h-6 w-6 rounded-full bg-white/90 shadow-lg animate-float-y" />
              <div className="absolute right-8 top-12 h-4 w-4 rounded-full bg-[#FF5FA2]/40 animate-drift" />
              <div className="absolute bottom-12 left-8 h-5 w-5 rounded-full bg-[#9B5DE5]/35 animate-drift" />

              <div className="absolute left-4 top-24 animate-float-y rounded-3xl glass-card px-4 py-3 shadow-[0_18px_50px_rgba(155,93,229,0.12)]">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-500">Trusted Care</div>
                <div className="mt-1 text-sm font-medium text-slate-800">Verified, warm, and secure</div>
              </div>

              <div className="absolute right-3 top-1/2 animate-float-y rounded-3xl glass-card px-4 py-3 shadow-[0_18px_50px_rgba(155,93,229,0.12)] [animation-delay:1s]">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-500">24/7 Support</div>
                <div className="mt-1 text-sm font-medium text-slate-800">Always one tap away</div>
              </div>

              <div className="relative w-full max-w-[42rem]">
                <div className="absolute left-1/2 top-8 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-white/65 blur-3xl animate-pulse-glow sm:h-[38rem] sm:w-[38rem]" />
                <div className="absolute left-1/2 top-14 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full border border-white/70 sm:h-[34rem] sm:w-[34rem]" />

                <div className="glass-card relative overflow-hidden rounded-[2rem] p-6 shadow-[0_24px_80px_rgba(155,93,229,0.14)]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),transparent_42%),linear-gradient(135deg,rgba(255,95,162,0.08),rgba(155,93,229,0.08))]" />
                  <img
                    src={heroIllustration}
                    alt="Pregnant mother illustration"
                    className="relative z-10 mx-auto w-full max-w-[38rem] object-contain drop-shadow-[0_28px_50px_rgba(155,93,229,0.16)]"
                  />
                </div>
              </div>

              <div className="absolute -bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-pink-400 shadow-[0_0_16px_rgba(255,95,162,0.75)]" />
                <span className="h-2.5 w-2.5 rounded-full bg-purple-400 shadow-[0_0_16px_rgba(155,93,229,0.75)]" />
                <span className="h-2.5 w-2.5 rounded-full bg-fuchsia-300 shadow-[0_0_16px_rgba(219,39,119,0.75)]" />
              </div>
            </div>
          </div>
        </section>

        <section className="relative px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full bg-[linear-gradient(180deg,rgba(255,248,253,1),rgba(255,255,255,1))]" />
          <div className="pointer-events-none absolute left-1/2 top-14 h-64 w-64 -translate-x-1/2 rounded-full bg-pink-100/40 blur-3xl" />

          <div className="mx-auto grid w-full max-w-7xl gap-8 xl:grid-cols-[0.9fr_1.1fr] xl:gap-12">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-pink-500">Our Story</p>
              <h2 className="mt-4 max-w-lg text-3xl font-bold text-slate-950 sm:text-4xl">
                Created to make motherhood feel guided, calm, and never lonely.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-8 text-slate-600">
                Jotne Maa was shaped around a simple belief: mothers deserve a care experience that feels emotionally safe, medically dependable, and beautifully easy to use.
              </p>

              <div className="mt-8 space-y-4">
                {storySteps.map((step, index) => (
                  <div
                    key={step.year}
                    className="glass-card rounded-3xl border-white/60 p-5 shadow-[0_16px_50px_rgba(155,93,229,0.10)] transition duration-300 hover:-translate-y-1"
                    style={{ animationDelay: `${index * 120}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 min-w-[3rem] items-center justify-center rounded-2xl bg-linear-to-r from-[#FF5FA2] to-[#9B5DE5] text-sm font-bold text-white shadow-lg px-3">
                        {step.year}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{step.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="glass-card rounded-[2rem] p-6 shadow-[0_20px_60px_rgba(155,93,229,0.10)]">
                <div className="flex items-center gap-3 text-pink-600">
                  <Heart className="h-5 w-5" />
                  <span className="text-sm font-semibold uppercase tracking-[0.2em]">Emotional mission</span>
                </div>
                <p className="mt-4 text-base leading-8 text-slate-600">
                  We exist to help mothers feel calmer, more informed, and better supported through every stage of pregnancy and early motherhood.
                </p>
              </div>

              <div className="glass-card rounded-[2rem] p-6 shadow-[0_20px_60px_rgba(155,93,229,0.10)]">
                <div className="flex items-center gap-3 text-purple-600">
                  <Stethoscope className="h-5 w-5" />
                  <span className="text-sm font-semibold uppercase tracking-[0.2em]">Medical clarity</span>
                </div>
                <p className="mt-4 text-base leading-8 text-slate-600">
                  Our journey pairs expert guidance with a modern interface so every recommendation feels safe, human, and easy to understand.
                </p>
              </div>

              <div className="glass-card rounded-[2rem] p-6 shadow-[0_20px_60px_rgba(155,93,229,0.10)] md:col-span-2">
                <div className="flex items-center gap-3 text-slate-900">
                  <Sparkles className="h-5 w-5 text-pink-500" />
                  <span className="text-sm font-semibold uppercase tracking-[0.2em]">Journey timeline</span>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {[
                    'Listen first',
                    'Design with care',
                    'Support continuously',
                  ].map((item, index) => (
                    <div key={item} className="rounded-2xl bg-pink-50 p-4 shadow-sm transition duration-300 hover:-translate-y-1">
                      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Step {index + 1}</div>
                      <div className="mt-2 text-base font-semibold text-slate-900">{item}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(255,95,162,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(155,93,229,0.14),transparent_28%)]" />

          <div className="mx-auto w-full max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-purple-500">What We Provide</p>
              <h2 className="mt-4 text-3xl font-bold text-slate-950 sm:text-4xl">
                Interactive care tools that feel premium, calm, and instantly useful.
              </h2>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {features.map((item, index) => {
                const Icon = item.icon

                return (
                  <article
                    key={item.title}
                    className="group glass-card rounded-[1.75rem] p-6 shadow-[0_18px_50px_rgba(155,93,229,0.10)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(155,93,229,0.16)]"
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-r from-[#FF5FA2] to-[#9B5DE5] text-white shadow-[0_12px_30px_rgba(155,93,229,0.18)] transition duration-300 group-hover:scale-105">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="relative px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto grid w-full max-w-7xl gap-8 xl:grid-cols-[0.95fr_1.05fr] xl:gap-12">
            <div className="glass-card rounded-[2rem] p-7 shadow-[0_18px_60px_rgba(155,93,229,0.10)] sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-pink-500">Why Trust Us</p>
              <h2 className="mt-4 text-3xl font-bold text-slate-950 sm:text-4xl">Built for privacy, evidence, and emotional reassurance.</h2>

              <div className="mt-8 space-y-4">
                {trustPoints.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/75 p-4 shadow-sm transition hover:-translate-y-0.5">
                    <CircleCheckBig className="h-5 w-5 flex-none text-pink-500" />
                    <span className="text-sm font-medium text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,rgba(255,95,162,0.12),rgba(155,93,229,0.15))] p-7 shadow-[0_24px_80px_rgba(155,93,229,0.12)] sm:p-8">
              <div className="absolute -right-6 top-6 h-20 w-20 rounded-full bg-white/55 blur-xl animate-pulse-glow" />
              <div className="absolute left-8 bottom-10 h-28 w-28 rounded-full bg-pink-200/35 blur-3xl" />

              <div className="glass-card relative rounded-[1.75rem] p-6 shadow-[0_16px_50px_rgba(155,93,229,0.10)]">
                <div className="flex items-center gap-3 text-slate-900">
                  <ShieldCheck className="h-5 w-5 text-purple-500" />
                  <span className="text-sm font-semibold uppercase tracking-[0.2em]">Protected care flow</span>
                </div>
                <p className="mt-4 text-base leading-8 text-slate-600">
                  Every flow is designed to make mothers feel emotionally safe while keeping personal details private and professional support accessible.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/80 p-4">
                    <div className="text-sm font-semibold text-slate-900">Secure data</div>
                    <div className="mt-1 text-sm leading-6 text-slate-500">Private by design and handled with care.</div>
                  </div>
                  <div className="rounded-2xl bg-white/80 p-4">
                    <div className="text-sm font-semibold text-slate-900">Expert support</div>
                    <div className="mt-1 text-sm leading-6 text-slate-500">Guidance aligned with trusted care standards.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto w-full max-w-7xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-purple-500">Testimonials</p>
                <h2 className="mt-4 text-3xl font-bold text-slate-950 sm:text-4xl">Stories from mothers who felt the difference.</h2>
              </div>

              <div className="flex gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => scrollTestimonials(-1)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white/80 text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-pink-200 hover:text-pink-600"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollTestimonials(1)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white/80 text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-pink-200 hover:text-pink-600"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div
              ref={testimonialsRef}
              className="mt-8 flex gap-5 overflow-x-auto pb-3 snap-x snap-mandatory scroll-smooth"
            >
              {testimonialItems.map((item) => (
                <article key={item.name} className="glass-card min-w-[18rem] max-w-[22rem] snap-start rounded-[1.75rem] p-6 shadow-[0_16px_50px_rgba(155,93,229,0.10)] sm:min-w-[22rem]">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: item.rating }).map((_, index) => (
                      <Star key={`${item.name}-${index}`} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-4 text-base leading-8 text-slate-700">“{item.text}”</p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-r from-[#FF5FA2] to-[#9B5DE5] text-sm font-bold text-white">
                      {item.name.slice(0, 1)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{item.name}</div>
                      <div className="text-sm text-slate-500">{item.role}</div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pb-24 lg:pt-12">
          <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-[2.5rem] bg-linear-to-r from-[#FF5FA2] via-[#C46CF3] to-[#9B5DE5] px-6 py-12 text-white shadow-[0_30px_90px_rgba(155,93,229,0.28)] sm:px-10 lg:px-12 lg:py-16">
            <div className="grid items-center gap-10 xl:grid-cols-[1fr_0.8fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/80">Final CTA</p>
                <h2 className="mt-4 max-w-2xl text-3xl font-bold leading-tight sm:text-5xl">
                  Together, Let’s Make Motherhood Safer & Happier.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-8 text-white/85">
                  Join a modern maternity healthcare experience that feels emotional, trustworthy, and beautifully designed for every stage of the journey.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/auth"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-pink-600 shadow-[0_18px_40px_rgba(255,255,255,0.18)] transition hover:-translate-y-0.5 hover:text-pink-700"
                  >
                    Get Started
                  </Link>
                  <a
                    href="mailto:support@jotnemaa.com"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/18"
                  >
                    Contact Us
                  </a>
                </div>
              </div>

              <div className="relative flex justify-center xl:justify-end">
                <div className="absolute -left-4 top-4 h-24 w-24 rounded-full bg-white/15 blur-2xl animate-pulse-glow" />
                <div className="absolute bottom-2 right-4 h-20 w-20 rounded-full bg-pink-200/30 blur-2xl animate-pulse-glow" />
                <div className="glass-card relative max-w-sm rounded-[2rem] p-6 text-slate-900 shadow-[0_18px_60px_rgba(255,255,255,0.16)]">
                  <div className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-500">Premium experience</div>
                  <div className="mt-3 text-xl font-bold">Comforting guidance with a startup-level polish.</div>
                  <div className="mt-5 space-y-3 text-sm text-slate-600">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-pink-500" />
                      support@jotnemaa.com
                    </div>
                    <div className="flex items-center gap-3">
                      <PhoneCall className="h-4 w-4 text-pink-500" />
                      24/7 Emergency Support
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPinned className="h-4 w-4 text-pink-500" />
                      Trusted Motherhood Care, Worldwide
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  )
}

export default About
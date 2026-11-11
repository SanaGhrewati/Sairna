import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  FiArrowLeft,
  FiCheck,
  FiMapPin,
  FiSearch,
  FiShield,
  FiUsers,
} from "react-icons/fi"
import { BsStars } from "react-icons/bs"

function AboutPage() {
  const navigate = useNavigate()
  const heroRef = useRef(null)
  const aboutRef = useRef(null)
  const whyRef = useRef(null)
  const stepsRef = useRef(null)

  const [heroVisible, setHeroVisible] = useState(false)
  const [aboutVisible, setAboutVisible] = useState(false)
  const [whyVisible, setWhyVisible] = useState(false)
  const [stepsVisible, setStepsVisible] = useState(false)

  useEffect(() => {
    setHeroVisible(true)

    const sections = [
      [aboutRef.current, setAboutVisible],
      [whyRef.current, setWhyVisible],
      [stepsRef.current, setStepsVisible],
    ]

    const observers = sections.map(([element, setter]) => {
      if (!element) return null

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setter(true)
            observer.disconnect()
          }
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -70px 0px",
        }
      )

      observer.observe(element)

      return observer
    })

    return () => {
      observers.forEach((observer) => observer?.disconnect())
    }
  }, [])

  const features = [
    {
      icon: FiSearch,
      title: "بحث أسهل",
      description:
        "ابحث عن الرحلات المتاحة حسب نقطة الانطلاق والوجهة والتاريخ.",
    },
    {
      icon: FiMapPin,
      title: "وجهات متعددة",
      description:
        "استكشف الرحلات بين المدن والمحافظات السورية من مكان واحد.",
    },
    {
      icon: FiShield,
      title: "حجز واضح",
      description:
        "راجع تفاصيل رحلتك ومقاعدك قبل تأكيد الحجز بكل وضوح.",
    },
    {
      icon: FiUsers,
      title: "تجربة أبسط",
      description:
        "كل المعلومات التي تحتاجها للرحلة موجودة أمامك بطريقة سهلة.",
    },
  ]

  const steps = [
    {
      number: "01",
      title: "ابحث عن رحلتك",
      description:
        "حدد مدينة الانطلاق والوجهة والتاريخ وعدد المسافرين.",
    },
    {
      number: "02",
      title: "اختر الرحلة",
      description:
        "استعرض الرحلات المتاحة واختر الوقت والشركة المناسبين إلك.",
    },
    {
      number: "03",
      title: "أكد حجزك",
      description:
        "راجع تفاصيل الرحلة واختر المقاعد وأكمل عملية الحجز.",
    },
  ]

  return (
    <main dir="rtl" className="overflow-hidden bg-bg">
      <section
        ref={heroRef}
        className="relative overflow-hidden bg-bg px-5 pb-[90px] pt-[70px] sm:px-7 sm:pb-[110px] sm:pt-[85px] lg:pb-[125px] lg:pt-[100px]"
      >
        <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

        <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-soft-teal blur-3xl" />

        <div className="relative mx-auto grid w-full max-w-[1216px] items-center gap-12 lg:grid-cols-[1fr_.75fr] lg:gap-20">
          <div
            className="text-center lg:text-right"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible
                ? "translateY(0)"
                : "translateY(35px)",
              transition:
                "opacity 900ms ease, transform 1000ms cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-soft-teal px-4 py-2 text-[10px] font-extrabold text-primary sm:text-[11px]">
              <BsStars className="text-sm" />
              <span>عن سيرنا</span>
            </div>

            <h1 className="m-0 text-[38px] font-black leading-[1.3] tracking-[-1px] text-text sm:text-[50px] lg:text-[64px]">
              السفر بين المدن
              <span className="bg-gradient-to-l from-primary-deep to-primary bg-clip-text text-transparent">
                {" "}
                صار أبسط
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-[650px] text-[13px] font-medium leading-8 text-muted sm:text-[15px] lg:mx-0 lg:text-[16px]">
              سيرنا منصة تساعدك تلاقي رحلتك بين المدن السورية، تشوف الخيارات
              المتاحة، وتكمل حجزك بطريقة بسيطة وواضحة.
            </p>

            <button
              type="button"
              onClick={() => navigate("/results")}
              className="group mt-7 inline-flex items-center gap-3 rounded-[15px] bg-primary px-6 py-4 text-[10px] font-extrabold text-white shadow-[0_12px_30px_rgba(10,169,155,0.2)] transition-all duration-300 hover:-translate-y-1 hover:bg-primary-deep sm:text-[11px]"
            >
              <FiSearch />
              ابحث عن رحلتك
              <FiArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1" />
            </button>
          </div>

          <div
            className="relative mx-auto h-[300px] w-full max-w-[420px] sm:h-[360px]"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible
                ? "translateX(0) scale(1)"
                : "translateX(-35px) scale(.92)",
              transition:
                "opacity 1100ms ease 250ms, transform 1200ms cubic-bezier(0.16,1,0.3,1) 250ms",
            }}
          >
            <div className="absolute inset-8 rounded-[40px] bg-dark shadow-[0_30px_80px_rgba(16,58,78,0.15)] sm:inset-5" />

            <div className="absolute right-0 top-8 h-32 w-32 rounded-full bg-primary/15 blur-3xl" />

            <div className="absolute bottom-5 left-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative grid h-[150px] w-[150px] place-items-center rounded-[42px] bg-primary shadow-[0_25px_55px_rgba(10,169,155,0.25)] transition-transform duration-700 hover:rotate-3 hover:scale-105 sm:h-[175px] sm:w-[175px]">
                <FiMapPin className="text-[58px] text-white sm:text-[68px]" />

                <div className="absolute -right-5 -top-5 grid h-12 w-12 place-items-center rounded-[15px] bg-surface text-primary shadow-lg">
                  <BsStars className="text-lg" />
                </div>
              </div>
            </div>

            <div className="absolute bottom-6 right-5 rounded-[16px] bg-surface px-4 py-3 shadow-xl sm:right-0">
              <span className="block text-[9px] font-bold text-muted">
                وجهتك
              </span>
              <strong className="mt-1 block text-[12px] font-black text-text">
                على كيفك
              </strong>
            </div>
          </div>
        </div>
      </section>

      <section
        ref={aboutRef}
        className="relative bg-surface px-5 py-[90px] sm:px-7 sm:py-[110px] lg:py-[125px]"
      >
        <div className="mx-auto grid w-full max-w-[1216px] items-center gap-12 lg:grid-cols-[.85fr_1fr] lg:gap-20">
          <div
            style={{
              opacity: aboutVisible ? 1 : 0,
              transform: aboutVisible
                ? "translateX(0)"
                : "translateX(35px)",
              transition:
                "opacity 900ms ease, transform 1000ms cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-soft-teal px-4 py-2 text-[10px] font-extrabold text-primary">
              <BsStars />
              <span>قصتنا</span>
            </div>

            <h2 className="m-0 text-[32px] font-black leading-[1.3] tracking-[-1px] text-text sm:text-[43px]">
              شو هو
              <span className="text-primary"> سيرنا؟</span>
            </h2>
          </div>

          <div
            style={{
              opacity: aboutVisible ? 1 : 0,
              transform: aboutVisible
                ? "translateX(0)"
                : "translateX(-35px)",
              transition:
                "opacity 900ms ease 180ms, transform 1000ms cubic-bezier(0.16,1,0.3,1) 180ms",
            }}
          >
            <p className="m-0 text-[13px] font-medium leading-8 text-muted sm:text-[15px]">
              سيرنا هو موقع مصمم ليسهّل عليك البحث عن رحلات النقل بين المدن
              السورية من مكان واحد. بدل ما تضيع وقتك بين الخيارات والمعلومات
              المختلفة، بتقدر تشوف الرحلات المتاحة وتفاصيلها وتختار الرحلة
              المناسبة إلك.
            </p>

            <p className="mt-5 text-[13px] font-medium leading-8 text-muted sm:text-[15px]">
              هدفنا نخلي تجربة السفر أوضح وأسهل، من لحظة البحث عن الرحلة وحتى
              تأكيد الحجز ومتابعة تفاصيله.
            </p>
          </div>
        </div>
      </section>

      <section
        ref={whyRef}
        className="relative bg-bg px-5 py-[90px] sm:px-7 sm:py-[110px] lg:py-[125px]"
      >
        <div className="mx-auto w-full max-w-[1216px]">
          <div
            className="mx-auto mb-12 max-w-[700px] text-center sm:mb-16"
            style={{
              opacity: whyVisible ? 1 : 0,
              transform: whyVisible
                ? "translateY(0)"
                : "translateY(30px)",
              transition:
                "opacity 900ms ease, transform 1000ms cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-soft-teal px-4 py-2 text-[10px] font-extrabold text-primary">
              <BsStars />
              <span>ليش سيرنا؟</span>
            </div>

            <h2 className="m-0 text-[32px] font-black leading-[1.3] tracking-[-1px] text-text sm:text-[44px]">
              كل اللي تحتاجه
              <span className="text-primary"> بمكان واحد</span>
            </h2>

            <p className="mt-4 text-[13px] font-medium leading-8 text-muted sm:text-[15px]">
              صممنا التجربة حتى تكون بسيطة وواضحة من أول خطوة.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon

              return (
                <div
                  key={feature.title}
                  className="group relative overflow-hidden rounded-[24px] border border-border bg-surface p-6 shadow-[0_18px_55px_rgba(19,54,72,0.05)] transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 hover:shadow-[0_25px_65px_rgba(19,54,72,0.1)]"
                  style={{
                    opacity: whyVisible ? 1 : 0,
                    transform: whyVisible
                      ? "translateY(0) scale(1)"
                      : "translateY(35px) scale(.95)",
                    transition: `opacity 800ms ease ${
                      index * 150 + 200
                    }ms, transform 900ms cubic-bezier(0.16,1,0.3,1) ${
                      index * 150 + 200
                    }ms`,
                  }}
                >
                  <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-soft-teal opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative">
                    <div className="grid h-12 w-12 place-items-center rounded-[15px] bg-soft-teal text-primary transition-all duration-500 group-hover:rotate-3 group-hover:bg-primary group-hover:text-white">
                      <Icon className="text-[20px]" />
                    </div>

                    <h3 className="mt-6 text-[17px] font-black text-text transition-colors duration-300 group-hover:text-primary">
                      {feature.title}
                    </h3>

                    <p className="mt-3 text-[11px] font-medium leading-7 text-muted sm:text-[12px]">
                      {feature.description}
                    </p>

                    <div className="mt-5 flex items-center gap-2 text-[9px] font-extrabold text-primary">
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-soft-teal">
                        <FiCheck />
                      </span>
                      <span>بكل سهولة ووضوح</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section
        ref={stepsRef}
        className="relative bg-surface px-5 py-[90px] sm:px-7 sm:py-[110px] lg:py-[125px]"
      >
        <div className="mx-auto w-full max-w-[1216px]">
          <div
            className="mx-auto mb-12 max-w-[700px] text-center sm:mb-16"
            style={{
              opacity: stepsVisible ? 1 : 0,
              transform: stepsVisible
                ? "translateY(0)"
                : "translateY(30px)",
              transition:
                "opacity 900ms ease, transform 1000ms cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-soft-teal px-4 py-2 text-[10px] font-extrabold text-primary">
              <BsStars />
              <span>كيف بيشتغل سيرنا؟</span>
            </div>

            <h2 className="m-0 text-[32px] font-black leading-[1.3] tracking-[-1px] text-text sm:text-[44px]">
              من البحث
              <span className="text-primary"> للحجز</span>
            </h2>

            <p className="mt-4 text-[13px] font-medium leading-8 text-muted sm:text-[15px]">
              ثلاث خطوات بسيطة وبتكون رحلتك جاهزة.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="group relative rounded-[25px] border border-border bg-bg p-6 transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 hover:shadow-[0_25px_60px_rgba(19,54,72,0.08)] sm:p-7"
                style={{
                  opacity: stepsVisible ? 1 : 0,
                  transform: stepsVisible
                    ? "translateY(0)"
                    : "translateY(40px)",
                  transition: `opacity 850ms ease ${
                    index * 180 + 200
                  }ms, transform 950ms cubic-bezier(0.16,1,0.3,1) ${
                    index * 180 + 200
                  }ms`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-[15px] bg-soft-teal text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-white">
                    <FiCheck />
                  </div>

                  <span className="text-[42px] font-black leading-none text-text/[0.05] transition-colors duration-500 group-hover:text-primary/10">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-7 text-[19px] font-black text-text transition-colors duration-300 group-hover:text-primary">
                  {step.title}
                </h3>

                <p className="mt-3 text-[11px] font-medium leading-7 text-muted sm:text-[12px]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-bg px-5 pb-[100px] pt-[25px] sm:px-7 sm:pb-[120px]">
        <div className="mx-auto w-full max-w-[1216px]">
          <div className="relative overflow-hidden rounded-[30px] bg-dark px-6 py-10 text-center shadow-[0_25px_70px_rgba(16,58,78,0.14)] sm:rounded-[34px] sm:px-10 sm:py-12">
            <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-primary/15 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-24 -left-16 h-60 w-60 rounded-full bg-primary/10 blur-3xl" />

            <div className="relative">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[9px] font-extrabold text-primary">
                <BsStars />
                جاهز للرحلة؟
              </div>

              <h2 className="m-0 text-[28px] font-black leading-[1.4] text-white sm:text-[38px]">
                ابحث عن رحلتك
                <span className="text-primary"> وابدأ الطريق</span>
              </h2>

              <p className="mx-auto mt-4 max-w-[560px] text-[11px] font-medium leading-7 text-white/55 sm:text-[13px]">
                اختار وجهتك وشوف الرحلات المتاحة واحجز مقعدك بكل سهولة.
              </p>

              <button
                type="button"
                onClick={() => navigate("/results")}
                className="group mt-6 inline-flex items-center gap-3 rounded-[15px] bg-primary px-6 py-3.5 text-[10px] font-extrabold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-primary-deep sm:px-7 sm:py-4 sm:text-[11px]"
              >
                <FiSearch />
                ابحث عن رحلتك
                <FiArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default AboutPage
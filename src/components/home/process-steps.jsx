import { useEffect, useRef, useState } from "react"
import { FiArrowLeft, FiCheck, FiCreditCard, FiSearch, FiUserCheck } from "react-icons/fi"
import { BsStars } from "react-icons/bs"

function ProcessSteps() {
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  const steps = [
    {
      number: "01",
      icon: FiSearch,
      title: "اختار رحلتك",
      description: "حدد نقطة الانطلاق والوجهة والتاريخ وعدد المسافرين.",
    },
    {
      number: "02",
      icon: FiUserCheck,
      title: "راجع التفاصيل",
      description: "شوف الرحلات المتاحة واختر الرحلة والشركة المناسبة إلك.",
    },
    {
      number: "03",
      icon: FiCreditCard,
      title: "أكد حجزك",
      description: "راجع معلومات رحلتك وأكمل الحجز بكل سهولة.",
    },
  ]

  useEffect(() => {
    const element = sectionRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -70px 0px",
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} dir="rtl" className="relative w-full overflow-hidden bg-bg px-5 py-[90px] sm:px-7 sm:py-[110px] lg:py-[135px]">
      <div className="mx-auto w-full max-w-[1216px]">
        <div className="mx-auto mb-12 max-w-[700px] text-center sm:mb-16" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(30px) scale(.96)", transition: "opacity 900ms ease, transform 1000ms cubic-bezier(0.16,1,0.3,1)" }}>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-soft-teal px-4 py-2 text-[10px] font-extrabold text-primary sm:text-[11px]">
            <BsStars className="text-sm" />
            <span>طريقة الحجز</span>
          </div>

          <h2 className="m-0 text-[34px] font-black leading-[1.25] tracking-[-1px] text-text sm:text-[44px] lg:text-[52px]">
            رحلتك تبدأ بـ{" "}
            <span className="bg-gradient-to-l from-primary-deep to-primary bg-clip-text text-transparent">
              3 خطوات
            </span>
          </h2>

          <p className="mt-4 text-[13px] font-medium leading-8 text-muted sm:text-[15px]">
            من البحث للحجز، خلينا نخلي الطريق أبسط وأوضح.
          </p>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute right-[16.66%] left-[16.66%] top-[74px] hidden h-[2px] overflow-hidden bg-border lg:block">
            <div className="h-full origin-right bg-primary transition-transform duration-[1800ms] ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ transform: isVisible ? "scaleX(1)" : "scaleX(0)" }} />
          </div>

          <div className="grid grid-cols-3 gap-6 max-[900px]:grid-cols-1 max-[900px]:gap-5">
            {steps.map((step, index) => {
              const Icon = step.icon

              return (
                <div key={step.number} className="relative" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0) scale(1)" : "translateY(45px) scale(.94)", transition: `opacity 850ms ease ${index * 220 + 250}ms, transform 1000ms cubic-bezier(0.16,1,0.3,1) ${index * 220 + 250}ms` }}>
                  <div className="group relative h-full overflow-hidden rounded-[26px] border border-border bg-surface p-6 shadow-[0_18px_55px_rgba(19,54,72,0.055)] transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 hover:shadow-[0_25px_65px_rgba(19,54,72,0.11)] sm:p-7">
                    <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-soft-teal opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />

                    <div className="relative">
                      <div className="mb-7 flex items-center justify-between">
                        <div className="relative grid h-[58px] w-[58px] place-items-center rounded-[18px] bg-soft-teal text-primary transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-primary group-hover:text-white">
                          <Icon className="text-[22px]" />
                          <span className="absolute -left-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-primary text-[9px] font-black text-white shadow-md">
                            {step.number}
                          </span>
                        </div>

                        <span className="text-[48px] font-black leading-none text-text/[0.045] transition-all duration-500 group-hover:text-primary/[0.1]">
                          {step.number}
                        </span>
                      </div>

                      <h3 className="m-0 text-[20px] font-black text-text transition-colors duration-300 group-hover:text-primary sm:text-[22px]">
                        {step.title}
                      </h3>

                      <p className="mt-3 min-h-[70px] text-[12px] font-medium leading-7 text-muted sm:text-[13px]">
                        {step.description}
                      </p>

                      <div className="mt-6 flex items-center gap-2 text-[10px] font-extrabold text-primary sm:text-[11px]">
                        <span className="grid h-6 w-6 place-items-center rounded-full bg-soft-teal transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                          <FiCheck />
                        </span>
                        <span>بكل سهولة ووضوح</span>
                      </div>
                    </div>
                  </div>

                  {index < steps.length - 1 && (
                    <div className="absolute -bottom-[18px] left-1/2 z-20 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-border bg-surface text-primary shadow-sm lg:hidden">
                      <FiArrowLeft className="rotate-90 text-sm" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProcessSteps
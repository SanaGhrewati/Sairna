import { useEffect, useRef, useState } from "react"

function HomeMetrics() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  const metrics = [
    { value: "14", label: "محافظة سورية", suffix: "" },
    { value: "4", label: "شركات نقل", suffix: "" },
    { value: "+30", label: "خيار رحلة باليوم", suffix: "" },
    { value: "24/7", label: "سهولة الوصول للموقع", suffix: "" },
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
        threshold: 0.2,
        rootMargin: "0px 0px -80px 0px",
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      dir="rtl"
      className="relative z-10 mx-auto w-full max-w-[1216px] px-5 pt-[85px] pb-[70px] sm:px-7 sm:pt-[105px] sm:pb-[85px] lg:pt-[120px] lg:pb-[95px]"
    >
      <div className="grid grid-cols-4 gap-4 max-[900px]:grid-cols-2 max-[550px]:grid-cols-1">
        {metrics.map((metric, index) => (
          <div
            key={metric.label}
            className="group relative overflow-hidden rounded-[22px] border border-border bg-surface px-6 py-7 text-center shadow-[0_15px_50px_rgba(19,54,72,0.06)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_22px_55px_rgba(19,54,72,0.11)]"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible
                ? "translateY(0) scale(1)"
                : "translateY(35px) scale(0.96)",
              transition: `opacity 900ms ease ${index * 220 + 150}ms, transform 1000ms cubic-bezier(0.16,1,0.3,1) ${index * 220 + 150}ms`,
            }}
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-soft-teal opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative">
              <strong className="block text-[30px] font-black leading-none text-primary sm:text-[34px]">
                {metric.value}
                {metric.suffix}
              </strong>

              <span className="mt-3 block text-[11px] font-bold text-muted sm:text-xs">
                {metric.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default HomeMetrics
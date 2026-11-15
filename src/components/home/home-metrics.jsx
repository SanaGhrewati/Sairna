import { useEffect, useRef, useState } from "react"

function HomeMetrics() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  const metrics = [
    { value: "14", label: "محافظة سورية" },
    { value: "4", label: "شركات نقل" },
    { value: "+30", label: "خيار رحلة باليوم" },
    { value: "24/7", label: "سهولة الوصول للموقع" },
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
      <div className="grid grid-cols-4 gap-5 max-[900px]:grid-cols-2 max-[550px]:grid-cols-1">
        {metrics.map((metric, index) => (
          <div
            key={metric.label}
            className="group relative h-[190px]"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible
                ? "translate3d(0,0,0) scale(1)"
                : "translate3d(0,45px,0) scale(.92)",
              transition: `opacity 900ms ease ${index * 180 + 120}ms, transform 1000ms cubic-bezier(0.16,1,0.3,1) ${index * 180 + 120}ms`,
            }}
          >
            <div
              className="absolute inset-x-3 top-3 h-full rounded-[24px] bg-primary/10 transition-all duration-500 group-hover:translate-y-4 group-hover:rotate-3"
              style={{
                animation: "cardBack 3.8s ease-in-out infinite",
                animationDelay: `${index * 0.25}s`,
              }}
            />

            <div
              className="absolute inset-x-1 top-1 h-full rounded-[24px] border border-primary/10 bg-soft-teal/70 shadow-[0_20px_45px_rgba(19,54,72,0.09)] transition-all duration-500 group-hover:translate-y-2 group-hover:-rotate-3"
              style={{
                animation: "cardMiddle 3.4s ease-in-out infinite",
                animationDelay: `${index * 0.25 + 0.15}s`,
              }}
            />

            <div
              className="relative flex h-full flex-col items-center justify-center overflow-hidden rounded-[24px] border border-border bg-surface px-5 py-7 text-center shadow-[0_15px_50px_rgba(19,54,72,0.08)] transition-all duration-500 group-hover:-translate-y-5 group-hover:scale-[1.02] group-hover:shadow-[0_30px_70px_rgba(19,54,72,0.16)]"
              style={{
                animation: "cardFloat 3.2s ease-in-out infinite",
                animationDelay: `${index * 0.25}s`,
              }}
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-primary/15 blur-3xl transition-all duration-700 group-hover:scale-[1.6]" />

              <div className="pointer-events-none absolute -bottom-20 -left-16 h-36 w-36 rounded-full bg-soft-teal blur-3xl transition-all duration-700 group-hover:scale-[1.6]" />

              <div className="pointer-events-none absolute inset-x-6 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative flex items-center justify-center">
                <div
                  className="absolute h-[85px] w-[85px] rounded-full bg-primary/10 blur-xl"
                  style={{
                    animation: "glowPulse 2.4s ease-in-out infinite",
                    animationDelay: `${index * 0.2}s`,
                  }}
                />

                <strong
                  className="relative block text-[36px] font-black leading-none tracking-tight text-primary transition-all duration-500 group-hover:scale-125 group-hover:-translate-y-2 sm:text-[42px]"
                  style={{
                    textShadow:
                      "4px 5px 0 rgba(10,169,155,0.10), 8px 9px 0 rgba(10,169,155,0.05)",
                  }}
                >
                  {metric.value}
                </strong>
              </div>

              <span className="relative mt-5 block text-[11px] font-bold text-muted transition-all duration-500 group-hover:text-text group-hover:-translate-y-1 sm:text-xs">
                {metric.label}
              </span>

              <span className="relative mt-3 h-1 w-8 rounded-full bg-primary/25 transition-all duration-500 group-hover:w-16 group-hover:bg-primary" />
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes cardFloat {
          0% {
            transform: translate3d(0, 0, 0) rotateX(0deg) rotateY(-2deg) rotateZ(0deg);
          }

          20% {
            transform: translate3d(0, -10px, 0) rotateX(2deg) rotateY(4deg) rotateZ(-1deg);
          }

          40% {
            transform: translate3d(0, -18px, 0) rotateX(-1deg) rotateY(-4deg) rotateZ(1deg);
          }

          60% {
            transform: translate3d(0, -10px, 0) rotateX(2deg) rotateY(3deg) rotateZ(-1deg);
          }

          80% {
            transform: translate3d(0, -5px, 0) rotateX(-2deg) rotateY(-3deg) rotateZ(1deg);
          }

          100% {
            transform: translate3d(0, 0, 0) rotateX(0deg) rotateY(-2deg) rotateZ(0deg);
          }
        }

        @keyframes cardMiddle {
          0% {
            transform: translate3d(0, 0, 0) rotate(-1deg);
          }

          25% {
            transform: translate3d(5px, -8px, 0) rotate(2deg);
          }

          50% {
            transform: translate3d(-5px, -14px, 0) rotate(-2deg);
          }

          75% {
            transform: translate3d(4px, -7px, 0) rotate(2deg);
          }

          100% {
            transform: translate3d(0, 0, 0) rotate(-1deg);
          }
        }

        @keyframes cardBack {
          0% {
            transform: translate3d(0, 0, 0) rotate(1deg);
          }

          25% {
            transform: translate3d(-6px, -6px, 0) rotate(-2deg);
          }

          50% {
            transform: translate3d(6px, -12px, 0) rotate(3deg);
          }

          75% {
            transform: translate3d(-4px, -6px, 0) rotate(-2deg);
          }

          100% {
            transform: translate3d(0, 0, 0) rotate(1deg);
          }
        }

        @keyframes glowPulse {
          0% {
            transform: scale(0.85);
            opacity: 0.3;
          }

          50% {
            transform: scale(1.45);
            opacity: 0.9;
          }

          100% {
            transform: scale(0.85);
            opacity: 0.3;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          [style*="animation"] {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  )
}

export default HomeMetrics
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { BsStars } from "react-icons/bs"
import { FiArrowLeft, FiSearch, FiMapPin } from "react-icons/fi"

function HomeCTA() {
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const navigate = useNavigate()

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
    <section
      ref={sectionRef}
      dir="rtl"
      className="relative w-full overflow-hidden bg-bg px-5 pb-[80px] pt-[25px] sm:px-7 sm:pb-[95px] sm:pt-[35px] lg:pb-[110px] lg:pt-[40px]"
    >
      <div className="mx-auto w-full max-w-[1216px]">
        <div
          className="group relative overflow-hidden rounded-[28px] bg-dark px-6 py-9 shadow-[0_22px_65px_rgba(16,58,78,0.14)] sm:rounded-[32px] sm:px-10 sm:py-12 lg:px-14 lg:py-14"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible
              ? "translateY(0) scale(1)"
              : "translateY(45px) scale(.97)",
            transition:
              "opacity 900ms ease, transform 1000ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/20 blur-3xl transition-all duration-1000 group-hover:scale-125" />

          <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative z-10 flex items-center justify-between gap-8 lg:gap-14">
            <div className="max-w-[720px]">
              <div
                className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[9px] font-extrabold text-primary sm:text-[10px]"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible
                    ? "translateY(0)"
                    : "translateY(15px)",
                  transition:
                    "opacity 700ms ease 200ms, transform 750ms ease 200ms",
                }}
              >
                <BsStars className="text-sm" />
                <span>جاهز لرحلتك الجاية؟</span>
              </div>

              <h2
                className="m-0 text-[29px] font-black leading-[1.35] tracking-[-1px] text-white sm:text-[38px] lg:text-[46px]"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible
                    ? "translateY(0)"
                    : "translateY(20px)",
                  transition:
                    "opacity 800ms ease 350ms, transform 850ms cubic-bezier(0.16,1,0.3,1) 350ms",
                }}
              >
                خطوتك الجاية
                <span className="bg-gradient-to-l from-primary to-[#5de0ca] bg-clip-text text-transparent">
                  {" "}
                  بتبدأ من هون
                </span>
              </h2>

              <p
                className="mt-4 max-w-[600px] text-[11px] font-medium leading-7 text-white/60 sm:text-[13px] lg:text-[14px]"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible
                    ? "translateY(0)"
                    : "translateY(15px)",
                  transition:
                    "opacity 750ms ease 500ms, transform 800ms ease 500ms",
                }}
              >
                اختار وجهتك، شوف الرحلات المتاحة، واحجز مقعدك بكل سهولة.
                سيرنا بيجمعلك الطريق والمعلومة والحجز بمكان واحد.
              </p>

              <button
                type="button"
                onClick={() => navigate("/results")}
                className="group/button mt-6 inline-flex items-center justify-center gap-3 rounded-[14px] bg-primary px-6 py-3.5 text-[10px] font-extrabold text-white shadow-[0_10px_25px_rgba(10,169,155,0.22)] transition-all duration-300 hover:-translate-y-1 hover:bg-primary-deep hover:shadow-[0_15px_30px_rgba(10,169,155,0.3)] sm:px-7 sm:py-4 sm:text-[11px]"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible
                    ? "translateY(0)"
                    : "translateY(15px)",
                  transition:
                    "opacity 750ms ease 650ms, transform 800ms ease 650ms, background-color 300ms ease, box-shadow 300ms ease",
                }}
              >
                <FiSearch className="text-[15px]" />
                <span>ابحث عن رحلتك</span>
                <FiArrowLeft className="transition-transform duration-300 group-hover/button:-translate-x-1" />
              </button>
            </div>

            <div
              className="relative hidden h-[150px] w-[150px] shrink-0 place-items-center sm:grid lg:h-[180px] lg:w-[180px]"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible
                  ? "translateX(0) scale(1)"
                  : "translateX(-25px) scale(.88)",
                transition:
                  "opacity 900ms ease 550ms, transform 1000ms cubic-bezier(0.16,1,0.3,1) 550ms",
              }}
            >
              <div className="absolute inset-0 rounded-full border border-white/10" />
              <div className="absolute inset-[16px] rounded-full border border-white/10" />
              <div className="absolute inset-[32px] rounded-full border border-white/10" />

              <div className="relative grid h-[82px] w-[82px] place-items-center rounded-[25px] bg-primary shadow-[0_18px_40px_rgba(10,169,155,0.28)] transition-transform duration-700 group-hover:rotate-6 group-hover:scale-110 lg:h-[95px] lg:w-[95px]">
                <FiMapPin className="text-[31px] text-white lg:text-[36px]" />
              </div>

              <span className="absolute right-4 top-5 h-2 w-2 rounded-full bg-primary/80 shadow-[0_0_18px_rgba(10,169,155,0.8)]" />
              <span className="absolute bottom-6 left-5 h-1.5 w-1.5 rounded-full bg-white/40" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeCTA
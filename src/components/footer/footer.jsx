import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { FiGlobe, FiMail, FiPhone } from "react-icons/fi"

function Footer() {
  const footerRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = footerRef.current

    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -60px 0px",
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  const linkClass =
    "group relative w-fit text-[9px] font-medium text-white/50 transition-all duration-300 hover:translate-x-[-4px] hover:text-primary sm:text-[10px]"

  return (
    <footer
      ref={footerRef}
      dir="rtl"
      className="group/footer relative overflow-hidden bg-dark"
    >
      <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-primary/10 opacity-70 blur-3xl transition-all duration-[1200ms] group-hover/footer:scale-125 group-hover/footer:opacity-100" />

      <div className="pointer-events-none absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-primary/5 blur-3xl transition-all duration-[1200ms] group-hover/footer:scale-110" />

      <div className="pointer-events-none absolute right-1/2 top-1/2 h-40 w-40 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/[0.025] blur-3xl" />

      <div className="relative mx-auto w-full max-w-[1216px] px-6 sm:px-8">
        <div
          className="grid gap-10 border-b border-white/10 py-10 sm:py-12 lg:grid-cols-[1.35fr_1fr_1fr_1.1fr] lg:gap-14 lg:py-11"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible
              ? "translateY(0)"
              : "translateY(35px)",
            transition:
              "opacity 900ms ease, transform 1000ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <div
            className="max-w-[320px]"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible
                ? "translateX(0)"
                : "translateX(35px)",
              transition:
                "opacity 800ms ease 150ms, transform 900ms cubic-bezier(0.16,1,0.3,1) 150ms",
            }}
          >
            <Link
              to="/"
              className="group/logo inline-flex items-center gap-2"
            >
              <img
                src="/src/assets/image/تنزيل.svg"
                alt="سيرنا"
                className="h-9 w-auto object-contain transition-transform duration-500 group-hover/logo:-translate-y-1 group-hover/logo:rotate-2 sm:h-10"
              />

              <span className="text-[22px] font-black text-white transition-colors duration-300 group-hover/logo:text-primary sm:text-[24px]">
                سيرنا
              </span>
            </Link>

            <p className="mt-4 max-w-[320px] text-[10px] font-medium leading-7 text-white/55 transition-colors duration-300 group-hover/footer:text-white/65 sm:text-[11px]">
              رحلات بين المدن السورية، بخطوة بسيطة وواضحة.
              ابحث عن رحلتك واحجز مقعدك بكل سهولة.
            </p>

            <div className="mt-5 flex items-center gap-2">
              <a
                href="tel:+963000000000"
                aria-label="الهاتف"
                className="group/icon grid h-9 w-9 place-items-center rounded-[10px] border border-white/10 text-white/55 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-primary hover:text-white hover:shadow-[0_8px_20px_rgba(10,169,155,0.2)]"
              >
                <FiPhone className="text-[13px] transition-transform duration-300 group-hover/icon:rotate-12" />
              </a>

              <a
                href="mailto:hello@sairna.example"
                aria-label="البريد الإلكتروني"
                className="group/icon grid h-9 w-9 place-items-center rounded-[10px] border border-white/10 text-white/55 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-primary hover:text-white hover:shadow-[0_8px_20px_rgba(10,169,155,0.2)]"
              >
                <FiMail className="text-[13px] transition-transform duration-300 group-hover/icon:-rotate-6" />
              </a>

              <Link
                to="/"
                aria-label="الموقع"
                className="group/icon grid h-9 w-9 place-items-center rounded-[10px] border border-white/10 text-white/55 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-primary hover:text-white hover:shadow-[0_8px_20px_rgba(10,169,155,0.2)]"
              >
                <FiGlobe className="text-[13px] transition-transform duration-500 group-hover/icon:rotate-180" />
              </Link>
            </div>
          </div>

          <div
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible
                ? "translateY(0)"
                : "translateY(30px)",
              transition:
                "opacity 800ms ease 280ms, transform 900ms cubic-bezier(0.16,1,0.3,1) 280ms",
            }}
          >
            <h3 className="m-0 text-[11px] font-black text-white transition-colors duration-300 hover:text-primary sm:text-[12px]">
              استكشف
            </h3>

            <div className="mt-5 flex flex-col gap-3.5">
              <Link to="/" className={linkClass}>
                الرئيسية
                <span className="absolute -bottom-1 right-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>

              <Link to="/results" className={linkClass}>
                احجز رحلة
                <span className="absolute -bottom-1 right-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>

              <Link to="/companies" className={linkClass}>
                شركات النقل
                <span className="absolute -bottom-1 right-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>

              <Link to="/tracking" className={linkClass}>
                تتبع رحلتك
                <span className="absolute -bottom-1 right-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            </div>
          </div>

          <div
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible
                ? "translateY(0)"
                : "translateY(30px)",
              transition:
                "opacity 800ms ease 400ms, transform 900ms cubic-bezier(0.16,1,0.3,1) 400ms",
            }}
          >
            <h3 className="m-0 text-[11px] font-black text-white transition-colors duration-300 hover:text-primary sm:text-[12px]">
              حسابك
            </h3>

            <div className="mt-5 flex flex-col gap-3.5">
              <Link to="/login" className={linkClass}>
                تسجيل الدخول
                <span className="absolute -bottom-1 right-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>

              <Link to="/register" className={linkClass}>
                إنشاء حساب
                <span className="absolute -bottom-1 right-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>

              <Link to="/trips" className={linkClass}>
                حجوزاتي
                <span className="absolute -bottom-1 right-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>

              <Link to="/account" className={linkClass}>
                الملف الشخصي
                <span className="absolute -bottom-1 right-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            </div>
          </div>

          <div
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible
                ? "translateY(0)"
                : "translateY(30px)",
              transition:
                "opacity 800ms ease 520ms, transform 900ms cubic-bezier(0.16,1,0.3,1) 520ms",
            }}
          >
            <h3 className="m-0 text-[11px] font-black text-white transition-colors duration-300 hover:text-primary sm:text-[12px]">
              نحن هون لمساعدتك
            </h3>

            <div className="mt-5 flex flex-col gap-3.5">
              <Link to="/about" className={linkClass}>
                عن سيرنا
                <span className="absolute -bottom-1 right-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>

              <Link to="/help" className={linkClass}>
                مركز المساعدة
                <span className="absolute -bottom-1 right-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>

              <a
                href="mailto:hello@sairna.example"
                className={`${linkClass} flex items-center gap-2`}
              >
                <FiMail className="text-[11px] transition-transform duration-300 group-hover:-translate-y-0.5" />
                <span>hello@sairna.example</span>
              </a>
            </div>
          </div>
        </div>

        <div
          className="py-4 text-center"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible
              ? "translateY(0)"
              : "translateY(15px)",
            transition:
              "opacity 800ms ease 700ms, transform 800ms ease 700ms",
          }}
        >
          <p className="m-0 text-[8px] font-medium leading-6 text-white/30 transition-colors duration-300 hover:text-white/50 sm:text-[9px]">
            © {new Date().getFullYear()} سيرنا. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
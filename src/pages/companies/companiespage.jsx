
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { FiArrowLeft, FiCheck, FiMapPin, FiSearch, FiStar, FiWifi, FiZap, FiTruck } from "react-icons/fi"
import { FaBus } from "react-icons/fa"
import { BsSnow, BsStars } from "react-icons/bs"

const API_URL = "https://sairna.abdulrahman-hares.com/api/v1/website"

const getCompanies = async () => {
  const response = await axios.get(`${API_URL}/companies`)
  return response.data
}

const companyDetails = {
  1: {
    short: "ش",
    color: "#109d9c",
    background: "#e7f9f6",
    rating: "4.9",
    tag: "الأعلى تقييماً",
    about: "رحلات منتظمة بين المحافظات وتجربة سفر مريحة وواضحة.",
    features: [
      { label: "مكيّف", icon: BsSnow },
      { label: "Wi-Fi", icon: FiWifi },
      { label: "شحن USB", icon: FiZap },
    ],
    destinations: "+12",
    schedule: "يومياً",
  },
  2: {
    short: "ف",
    color: "#e69a46",
    background: "#fff3df",
    rating: "4.8",
    tag: "الأكثر حجزاً",
    about: "أسطول حديث ومواعيد متنوعة تناسب مختلف أوقات السفر.",
    features: [
      { label: "مكيّف", icon: BsSnow },
      { label: "مقاعد واسعة", icon: FaBus },
    ],
    destinations: "+10",
    schedule: "يومياً",
  },
  3: {
    short: "ن",
    color: "#5085e6",
    background: "#e9efff",
    rating: "4.7",
    tag: "سعر مميّز",
    about: "رحلات يومية وخيارات مناسبة للمسافرين بين المدن السورية.",
    features: [
      { label: "مكيّف", icon: BsSnow },
      { label: "Wi-Fi", icon: FiWifi },
    ],
    destinations: "+9",
    schedule: "يومياً",
  },
  4: {
    short: "ا",
    color: "#9969ce",
    background: "#f1eafe",
    rating: "4.6",
    tag: "مواعيد مرنة",
    about: "ربط المدن السورية بمواعيد مرنة وتجربة حجز سهلة.",
    features: [
      { label: "مكيّف", icon: BsSnow },
      { label: "شحن USB", icon: FiZap },
    ],
    destinations: "+8",
    schedule: "يومياً",
  },
}

const defaultDetails = {
  color: "#109d9c",
  background: "#e7f9f6",
  rating: "4.8",
  tag: "شركة نقل",
  about: "رحلات بين المدن السورية وتجربة سفر سهلة ومريحة.",
  features: [
    { label: "مكيّف", icon: BsSnow },
    { label: "مقاعد واسعة", icon: FaBus },
  ],
  destinations: "+8",
  schedule: "يومياً",
}

function CompaniesPage() {
  const navigate = useNavigate()
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  const { data: companies = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["companies"],
    queryFn: getCompanies,
  })

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
      { threshold: 0.12, rootMargin: "0px 0px -70px 0px" }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <main dir="rtl" className="overflow-hidden bg-bg">
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-bl from-surface-alt via-bg to-bg px-5 pb-[65px] pt-[65px] sm:px-7 sm:pb-[80px] sm:pt-[80px] lg:pb-[95px] lg:pt-[90px]">
        <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full border border-primary/10" />
        <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full border border-primary/10" />
        <div className="pointer-events-none absolute -right-28 bottom-[-100px] h-80 w-80 rounded-full bg-soft-teal opacity-70 blur-3xl" />

        <div className="relative mx-auto w-full max-w-[1216px]">
          <div className="mb-5 flex items-center gap-2 text-[10px] font-bold text-muted sm:text-[11px]">
            <button type="button" onClick={() => navigate("/")} className="transition-colors duration-300 hover:text-primary">الرئيسية</button>
            <FiArrowLeft className="text-[11px]" />
            <span className="text-text">شركات النقل</span>
          </div>

          <div className="max-w-[720px]">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-soft-teal px-4 py-2 text-[10px] font-extrabold text-primary sm:text-[11px]">
              <BsStars className="text-sm" />
              <span>شركاء الطريق</span>
            </div>

            <h1 className="m-0 text-[36px] font-black leading-[1.35] tracking-[-1px] text-text sm:text-[48px] lg:text-[58px]">
              شركات بتوصلك
              <span className="bg-gradient-to-l from-primary-deep to-primary bg-clip-text text-transparent"> لوين ما بدك.</span>
            </h1>

            <p className="mt-4 max-w-[650px] text-[12px] font-medium leading-8 text-muted sm:text-[14px] lg:text-[15px]">
              تعرّف على شركات النقل الموجودة على سيرنا واختار الخيار الأنسب إلك قبل ما تبدأ رحلتك.
            </p>
          </div>
        </div>
      </section>

      <section ref={sectionRef} className="relative bg-bg px-5 py-[75px] sm:px-7 sm:py-[100px] lg:py-[115px]">
        <div className="mx-auto w-full max-w-[1216px]">
          <div className="mb-10 flex items-end justify-between gap-5 transition-all duration-700 sm:mb-12" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(25px)" }}>
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-soft-teal px-3.5 py-1.5 text-[9px] font-extrabold text-primary">
                <FiMapPin />
                <span>خياراتك على الطريق</span>
              </div>

              <h2 className="m-0 text-[28px] font-black leading-[1.3] tracking-[-1px] text-text sm:text-[38px]">
                اختار الشركة
                <span className="text-primary"> اللي بتفضّلها</span>
              </h2>
            </div>

            <div className="hidden items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-[10px] font-bold text-muted sm:flex">
              <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_0_4px_rgba(10,169,155,0.1)]" />
              {companies.length} شركات متاحة
            </div>
          </div>

          {isLoading && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-[390px] animate-pulse rounded-[24px] border border-border bg-surface p-5">
                  <div className="h-[68px] w-[68px] rounded-[19px] bg-surface-alt" />
                  <div className="mt-6 h-5 w-2/3 rounded bg-surface-alt" />
                  <div className="mt-4 h-3 w-full rounded bg-surface-alt" />
                  <div className="mt-3 h-3 w-4/5 rounded bg-surface-alt" />
                  <div className="mt-8 h-12 rounded bg-surface-alt" />
                </div>
              ))}
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center justify-center rounded-[24px] border border-border bg-surface px-5 py-12 text-center">
              <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-soft-teal text-primary">
                <FiTruck className="text-2xl" />
              </div>
              <h3 className="text-base font-black text-text">ما قدرنا نحمل شركات النقل</h3>
              <p className="mt-2 text-xs leading-6 text-muted">صار خطأ أثناء الاتصال بالخادم، حاولي مرة ثانية.</p>
              <button type="button" onClick={() => refetch()} className="mt-5 rounded-xl bg-primary px-6 py-3 text-xs font-extrabold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-primary-deep">
                إعادة المحاولة
              </button>
            </div>
          )}

          {!isLoading && !isError && companies.length === 0 && (
            <div className="rounded-[24px] border border-border bg-surface px-5 py-12 text-center">
              <FiTruck className="mx-auto text-3xl text-primary" />
              <h3 className="mt-4 text-base font-black text-text">لا توجد شركات نقل حالياً</h3>
              <p className="mt-2 text-xs text-muted">ستظهر الشركات هنا عند توفرها.</p>
            </div>
          )}

          {!isLoading && !isError && companies.length > 0 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {companies.map((company, index) => {
                const details = companyDetails[company.id] || defaultDetails
                const short = company.name?.trim()?.charAt(0) || "س"

                return (
                  <article key={company.id} className="group relative overflow-hidden rounded-[24px] border border-border bg-surface p-5 shadow-[0_15px_55px_rgba(19,54,72,0.055)] transition-all duration-500 hover:-translate-y-2 hover:border-primary/25 hover:shadow-[0_25px_65px_rgba(19,54,72,0.11)]" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0) scale(1)" : "translateY(40px) scale(.95)", transition: `opacity 800ms ease ${index * 150 + 180}ms, transform 900ms cubic-bezier(0.16,1,0.3,1) ${index * 150 + 180}ms` }}>
                    <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full opacity-0 blur-3xl transition-all duration-700 group-hover:scale-125 group-hover:opacity-100" style={{ backgroundColor: details.background }} />

                    <div className="relative">
                      <div className="flex items-start justify-between gap-3">
                        <div className="grid h-[68px] w-[68px] shrink-0 place-items-center overflow-hidden rounded-[19px] text-[30px] font-black shadow-sm transition-all duration-500 group-hover:scale-105 group-hover:rotate-2" style={{ color: details.color, backgroundColor: details.background }}>
                          {company.logoUrl ? (
                            <img src={company.logoUrl} alt={company.name} className="h-full w-full object-contain p-2" onError={(e) => { e.currentTarget.style.display = "none" }} />
                          ) : (
                            short
                          )}
                        </div>

                        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[8px] font-extrabold" style={{ color: details.color, backgroundColor: details.background }}>
                          <FiStar className="fill-current text-[10px]" />
                          {details.rating}
                        </span>
                      </div>

                      <div className="mt-6">
                        <div className="flex items-center gap-2">
                          <h3 className="m-0 text-[17px] font-black text-text transition-colors duration-300 group-hover:text-primary">{company.name}</h3>
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        </div>

                        <div className="mt-1 text-[9px] font-extrabold text-primary">{details.tag}</div>

                        <p className="mt-3 min-h-[68px] text-[11px] font-medium leading-7 text-muted">{details.about}</p>
                      </div>

                      <div className="mt-4 flex min-h-[31px] flex-wrap gap-1.5">
                        {details.features.map((feature) => {
                          const Icon = feature.icon

                          return (
                            <span key={feature.label} className="inline-flex items-center gap-1 rounded-lg bg-surface-alt px-2 py-1.5 text-[8px] font-bold text-muted transition-colors duration-300 group-hover:bg-soft-teal group-hover:text-primary">
                              <Icon className="text-[10px]" />
                              {feature.label}
                            </span>
                          )
                        })}
                      </div>

                      <div className="my-5 grid grid-cols-2 gap-3 border-y border-border py-4">
                        <div>
                          <strong className="block text-[17px] font-black text-text">{details.destinations}</strong>
                          <span className="text-[8px] font-bold text-muted">وجهة تجريبية</span>
                        </div>

                        <div className="border-r border-border pr-3">
                          <strong className="block text-[15px] font-black text-text">{details.schedule}</strong>
                          <span className="text-[8px] font-bold text-muted">مواعيد تجريبية</span>
                        </div>
                      </div>

                      <div className="mb-4 flex items-center gap-2 text-[9px] font-bold">
                        <span className={`h-2 w-2 rounded-full ${company.isActive ? "bg-primary" : "bg-gray-400"}`} />
                        <span className={company.isActive ? "text-primary" : "text-muted"}>{company.isActive ? "متاحة حالياً" : "غير متاحة حالياً"}</span>
                      </div>

                      <button type="button" disabled={!company.isActive} onClick={() => navigate(`/results?companyId=${company.id}`)} className="group/button flex min-h-[42px] w-full items-center justify-center gap-2 rounded-[12px] border border-border bg-surface text-[9px] font-extrabold text-text transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:border-border disabled:hover:bg-surface disabled:hover:text-text">
                        عرض رحلات الشركة
                        <FiArrowLeft className="text-[12px] transition-transform duration-300 group-hover/button:-translate-x-1" />
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          )}

          <div className="mt-7 flex items-start gap-3 rounded-[16px] border border-border bg-surface px-4 py-3.5" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(20px)", transition: "opacity 800ms ease 850ms, transform 900ms ease 850ms" }}>
            <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-soft-teal text-primary">
              <FiCheck className="text-[13px]" />
            </div>
            <p className="m-0 text-[9px] font-medium leading-6 text-muted sm:text-[10px]">
              أسماء الشركات ومعرّفاتها وشعاراتها وحالة توفرها تُعرض من بيانات النظام الفعلية. أما التقييمات والخدمات والوجهات والمواعيد فهي بيانات توضيحية وليست معلومات مؤكدة من الشركة.
            </p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-surface px-5 pb-[90px] pt-[25px] sm:px-7 sm:pb-[110px]">
        <div className="mx-auto w-full max-w-[1216px]">
          <div className="relative overflow-hidden rounded-[28px] bg-dark px-6 py-9 text-center shadow-[0_25px_70px_rgba(16,58,78,0.13)] sm:rounded-[32px] sm:px-10 sm:py-11">
            <div className="pointer-events-none absolute -right-24 -top-24 h-60 w-60 rounded-full bg-primary/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 -left-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

            <div className="relative">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[9px] font-extrabold text-primary">
                <BsStars />
                جاهز للرحلة؟
              </div>

              <h2 className="m-0 text-[27px] font-black leading-[1.4] text-white sm:text-[36px]">
                اختار رحلتك
                <span className="text-primary"> وابدأ الطريق</span>
              </h2>

              <p className="mx-auto mt-3 max-w-[500px] text-[10px] font-medium leading-7 text-white/55 sm:text-[12px]">
                قارن بين الرحلات المتاحة واختار الشركة والوقت المناسبين إلك.
              </p>

              <button type="button" onClick={() => navigate("/results")} className="group mt-5 inline-flex items-center gap-3 rounded-[13px] bg-primary px-6 py-3.5 text-[10px] font-extrabold text-white shadow-[0_10px_25px_rgba(10,169,155,0.18)] transition-all duration-300 hover:-translate-y-1 hover:bg-primary-deep">
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

export default CompaniesPage

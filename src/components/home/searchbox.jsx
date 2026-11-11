import { useEffect, useRef, useState } from "react"
import { FiMapPin, FiRepeat, FiCalendar, FiUsers, FiSearch } from "react-icons/fi"
import { BsStars } from "react-icons/bs"
import { useNavigate } from "react-router-dom"

function SearchBox() {
  const [origin, setOrigin] = useState("2")
  const [destination, setDestination] = useState("1")
  const [date, setDate] = useState("")
  const [people, setPeople] = useState("1")
  const [isVisible, setIsVisible] = useState(false)
  const [isSwapped, setIsSwapped] = useState(false)

  const boxRef = useRef(null)
  const navigate = useNavigate()

  const cities = [
    { value: "2", label: "حلب" },
    { value: "1", label: "دمشق" },
    { value: "5", label: "اللاذقية" },
    { value: "3", label: "حمص" },
    { value: "4", label: "حماة" },
    { value: "6", label: "طرطوس" },
    { value: "7", label: "إدلب" },
  ]

  useEffect(() => {
    const element = boxRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -50px 0px" }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  const swapCities = () => {
    setOrigin(destination)
    setDestination(origin)
    setIsSwapped((current) => !current)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (origin === destination) {
      alert("اختاري محافظتين مختلفتين")
      return
    }

    if (!date) {
      alert("اختاري تاريخ الرحلة")
      return
    }

    navigate(`/results?originId=${origin}&destinationId=${destination}&date=${date}&people=${people}`)
  }

  const fieldClass = "h-[50px] w-full rounded-[14px] border border-border bg-bg pr-10 pl-3 text-[12px] font-bold text-text outline-none transition-all duration-300 hover:border-primary/50 focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/10 max-[650px]:h-11 max-[650px]:rounded-xl max-[650px]:pr-9"

  const iconClass = "absolute right-3 top-1/2 z-10 -translate-y-1/2 text-primary transition-transform duration-300"

  const reveal = (delay) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateY(0)" : "translateY(18px)",
    transition: `opacity 900ms ease ${delay}ms, transform 900ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
  })

  return (
    <section ref={boxRef} dir="rtl" className="relative z-20 mx-auto -mt-[32px] w-full max-w-[1120px] px-5 sm:px-7 lg:-mt-[38px]">
      <div
        className="relative overflow-hidden rounded-[24px] border border-border bg-surface shadow-[0_25px_70px_rgba(19,54,72,0.12)]"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0) scale(1)" : "translateY(35px) scale(.97)",
          transition: "opacity 1200ms ease, transform 1400ms cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div className="pointer-events-none absolute -right-28 -top-28 h-64 w-64 rounded-full bg-primary/8 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-28 h-64 w-64 rounded-full bg-soft-teal/60 blur-3xl" />

        <div className="relative flex items-center justify-between gap-5 border-b border-border px-6 py-5 max-[850px]:flex-col max-[850px]:items-start max-[650px]:px-4 max-[650px]:py-4">
          <div className="flex items-center gap-3" style={reveal(450)}>
            <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-[13px] bg-soft-teal text-primary">
              <span className="absolute inset-0 rounded-[13px] bg-primary/10" />
              <FiMapPin className="relative text-lg" />
            </span>

            <div className="flex flex-col gap-1">
              <strong className="text-[13px] font-black text-text sm:text-sm">
                وين رحلتك الجاية؟
              </strong>

              <span className="text-[10px] font-medium text-muted sm:text-[11px]">
                اختار وجهتك وباقي التفاصيل علينا
              </span>
            </div>
          </div>

          <div
            className="flex items-center gap-2 rounded-full bg-soft-teal px-4 py-2 text-[10px] font-extrabold text-primary"
            style={reveal(600)}
          >
            <BsStars />
            <span>الحجز بـ 3 خطوات</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="relative grid grid-cols-[1fr_auto_1fr_1fr_0.8fr_auto] items-end gap-3 p-5 max-[950px]:grid-cols-2 max-[950px]:gap-4 max-[650px]:gap-3 max-[650px]:p-4">
          <label className="flex min-w-0 flex-col gap-2" style={reveal(750)}>
            <span className="text-[10px] font-extrabold text-muted sm:text-[11px]">
              من وين؟
            </span>

            <div className="group relative">
              <FiMapPin className={`${iconClass} group-hover:scale-110`} />

              <select value={origin} onChange={(e) => setOrigin(e.target.value)} className={fieldClass}>
                {cities.map((city) => (
                  <option key={city.value} value={city.value}>
                    {city.label}
                  </option>
                ))}
              </select>
            </div>
          </label>

          <button
            type="button"
            onClick={swapCities}
            aria-label="تبديل المحافظات"
            className="mb-1 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-soft-teal text-primary shadow-sm transition-all duration-500 hover:scale-110 hover:bg-primary hover:text-white max-[950px]:hidden"
            style={reveal(850)}
          >
            <FiRepeat className={`text-[16px] transition-transform duration-700 ${isSwapped ? "rotate-180" : "rotate-0"}`} />
          </button>

          <label className="flex min-w-0 flex-col gap-2" style={reveal(900)}>
            <span className="text-[10px] font-extrabold text-muted sm:text-[11px]">
              لوين؟
            </span>

            <div className="group relative">
              <FiMapPin className={`${iconClass} group-hover:scale-110`} />

              <select value={destination} onChange={(e) => setDestination(e.target.value)} className={fieldClass}>
                {cities.map((city) => (
                  <option key={city.value} value={city.value}>
                    {city.label}
                  </option>
                ))}
              </select>
            </div>
          </label>

          <button
            type="button"
            onClick={swapCities}
            aria-label="تبديل المحافظات"
            className="absolute right-1/2 top-[104px] z-20 hidden h-9 w-9 translate-x-1/2 items-center justify-center rounded-full border border-border bg-soft-teal text-primary shadow-md transition-all duration-500 hover:scale-110 hover:bg-primary hover:text-white max-[950px]:flex max-[650px]:top-[100px]"
            style={reveal(850)}
          >
            <FiRepeat className={`text-[15px] transition-transform duration-700 ${isSwapped ? "rotate-180" : "rotate-0"}`} />
          </button>

          <label className="flex min-w-0 flex-col gap-2" style={reveal(1050)}>
            <span className="text-[10px] font-extrabold text-muted sm:text-[11px]">
              تاريخ الرحلة
            </span>

            <div className="group relative">
              <FiCalendar className={`${iconClass} group-hover:scale-110`} />

              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={fieldClass} />
            </div>
          </label>

          <label className="flex min-w-0 flex-col gap-2" style={reveal(1200)}>
            <span className="text-[10px] font-extrabold text-muted sm:text-[11px]">
              المسافرين
            </span>

            <div className="group relative">
              <FiUsers className={`${iconClass} group-hover:scale-110`} />

              <select value={people} onChange={(e) => setPeople(e.target.value)} className={fieldClass}>
                <option value="1">1 مسافر</option>
                <option value="2">2 مسافرين</option>
                <option value="3">3 مسافرين</option>
                <option value="4">4 مسافرين</option>
              </select>
            </div>
          </label>

          <button
            type="submit"
            className="group flex h-[50px] items-center justify-center gap-2 whitespace-nowrap rounded-[14px] bg-primary px-5 text-[11px] font-extrabold text-white shadow-[0_10px_25px_rgba(10,169,155,0.18)] transition-all duration-500 hover:-translate-y-1 hover:bg-primary-deep hover:shadow-[0_15px_30px_rgba(10,169,155,0.25)] active:translate-y-0 active:scale-[0.98] max-[950px]:col-span-2 max-[950px]:w-full max-[650px]:h-11 max-[650px]:rounded-xl"
            style={reveal(1350)}
          >
            <FiSearch className="text-[15px] transition-transform duration-500 group-hover:scale-110" />
            <span>ابحث عن رحلات</span>
          </button>
        </form>
      </div>
    </section>
  )
}

export default SearchBox
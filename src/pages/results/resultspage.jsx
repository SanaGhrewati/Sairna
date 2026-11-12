import { useEffect, useMemo, useRef, useState } from "react"
import {
  FiMapPin,
  FiRepeat,
  FiCalendar,
  FiUsers,
  FiSearch,
  FiClock,
  FiArrowLeft,
} from "react-icons/fi"
import { BsStars } from "react-icons/bs"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useGetTrips } from "../../hooks/use-trips"
import { useGetCities } from "../../hooks/use-cities"

function ResultsPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const originId = searchParams.get("originId")
  const destinationId = searchParams.get("destinationId")
  const date = searchParams.get("date")
  const people = searchParams.get("people") || "1"

  const { data: citiesData, isLoading: citiesLoading } = useGetCities()

  const [origin, setOrigin] = useState(originId || "2")
  const [destination, setDestination] = useState(destinationId || "1")
  const [searchDate, setSearchDate] = useState(date || "")
  const [searchPeople, setSearchPeople] = useState(people)
  const [isSwapped, setIsSwapped] = useState(false)

  const [companyFilter, setCompanyFilter] = useState("all")
  const [timeFilter, setTimeFilter] = useState("all")
  const [sort, setSort] = useState("departure")

  const [heroVisible, setHeroVisible] = useState(false)
  const [searchVisible, setSearchVisible] = useState(false)
  const [resultsVisible, setResultsVisible] = useState(false)

  const heroRef = useRef(null)
  const searchRef = useRef(null)
  const resultsRef = useRef(null)

  const cities = Array.isArray(citiesData) ? citiesData : []

  const filters = useMemo(
    () => ({
      originId: originId ? Number(originId) : undefined,
      destinationId: destinationId ? Number(destinationId) : undefined,
      date: date || undefined,
    }),
    [originId, destinationId, date]
  )

  const {
    data: tripsData,
    isLoading,
    isError,
  } = useGetTrips(filters)

  const trips = Array.isArray(tripsData)
    ? tripsData
    : tripsData?.items || []

  useEffect(() => {
    setOrigin(originId || "2")
    setDestination(destinationId || "1")
    setSearchDate(date || "")
    setSearchPeople(people)
  }, [originId, destinationId, date, people])

  useEffect(() => {
    const observers = []

    const observe = (element, setter, threshold = 0.15) => {
      if (!element) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setter(true)
            observer.disconnect()
          }
        },
        {
          threshold,
          rootMargin: "0px 0px -50px 0px",
        }
      )

      observer.observe(element)
      observers.push(observer)
    }

    observe(heroRef.current, setHeroVisible)
    observe(searchRef.current, setSearchVisible)
    observe(resultsRef.current, setResultsVisible)

    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  }, [])

  const companies = useMemo(() => {
    const map = new Map()

    trips.forEach((trip) => {
      if (trip.company) {
        map.set(trip.company.id, trip.company)
      }
    })

    return Array.from(map.values())
  }, [trips])

  const filteredTrips = useMemo(() => {
    let result = [...trips]

    if (companyFilter !== "all") {
      result = result.filter(
        (trip) => String(trip.companyId) === String(companyFilter)
      )
    }

    if (timeFilter !== "all") {
      result = result.filter((trip) => {
        const hour = new Date(trip.departureAt).getHours()

        if (timeFilter === "morning") {
          return hour >= 5 && hour < 12
        }

        if (timeFilter === "afternoon") {
          return hour >= 12 && hour < 17
        }

        if (timeFilter === "evening") {
          return hour >= 17 && hour < 22
        }

        if (timeFilter === "night") {
          return hour >= 22 || hour < 5
        }

        return true
      })
    }

    if (sort === "price") {
      result.sort(
        (a, b) => Number(a.price || 0) - Number(b.price || 0)
      )
    }

    if (sort === "duration") {
      result.sort((a, b) => {
        const durationA =
          new Date(a.arrivalAt) - new Date(a.departureAt)

        const durationB =
          new Date(b.arrivalAt) - new Date(b.departureAt)

        return durationA - durationB
      })
    }

    if (sort === "departure") {
      result.sort(
        (a, b) =>
          new Date(a.departureAt) - new Date(b.departureAt)
      )
    }

    return result
  }, [trips, companyFilter, timeFilter, sort])

  const findCityName = (id) => {
    const city = cities.find(
      (item) => String(item.id) === String(id)
    )

    return city?.name || "—"
  }

  const originName =
    trips[0]?.origin?.name || findCityName(originId)

  const destinationName =
    trips[0]?.destination?.name || findCityName(destinationId)

  const formatPrice = (price) => {
    return `${Number(price || 0).toLocaleString("ar-SY")} ل.س`
  }

  const formatTime = (value) => {
    if (!value) return "—"

    return new Date(value).toLocaleTimeString("ar-SY", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (value) => {
    if (!value) return "—"

    return new Date(value).toLocaleDateString("ar-SY", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })
  }

  const formatDuration = (departure, arrival) => {
    if (!departure || !arrival) return "—"

    const minutes = Math.round(
      (new Date(arrival) - new Date(departure)) / 60000
    )

    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (hours === 0) {
      return `${remainingMinutes} دقيقة`
    }

    return `${hours} س ${remainingMinutes} د`
  }

  const swapCities = () => {
    setOrigin(destination)
    setDestination(origin)
    setIsSwapped((current) => !current)
  }

  const handleSearch = (event) => {
    event.preventDefault()

    if (origin === destination) {
      alert("اختاري محافظتين مختلفتين")
      return
    }

    if (!searchDate) {
      alert("اختاري تاريخ الرحلة")
      return
    }

    const params = new URLSearchParams()

    params.set("originId", origin)
    params.set("destinationId", destination)
    params.set("date", searchDate)
    params.set("people", searchPeople)

    navigate(`/results?${params.toString()}`)
  }

  const scrollToSearch = () => {
    searchRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    })
  }

  const fieldClass =
    "h-[50px] w-full rounded-[14px] border border-border bg-bg pr-10 pl-3 text-[12px] font-bold text-text outline-none transition-all duration-300 hover:border-primary/50 focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/10 max-[650px]:h-11 max-[650px]:rounded-xl max-[650px]:pr-9"

  const iconClass =
    "absolute right-3 top-1/2 z-10 -translate-y-1/2 text-primary transition-transform duration-300"

  return (
    <main
      dir="rtl"
      className="min-h-screen overflow-hidden bg-bg"
    >
      <section
        ref={heroRef}
        className="relative overflow-hidden px-5 pb-12 pt-14 sm:px-7 sm:pb-16 sm:pt-16 lg:pb-20 lg:pt-20"
      >
        <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-primary/8 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-soft-teal/60 blur-3xl" />

        <div
          className="relative mx-auto max-w-[1216px]"
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible
              ? "translateY(0)"
              : "translateY(35px)",
            transition:
              "opacity 1000ms ease, transform 1100ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <div
            className="mb-5 flex items-center gap-2 text-[11px] font-bold text-muted"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible
                ? "translateY(0)"
                : "translateY(-15px)",
              transition: "all 700ms ease 100ms",
            }}
          >
            <span>الرئيسية</span>

            <FiArrowLeft className="text-primary" />

            <span className="text-primary">
              نتائج الرحلات
            </span>
          </div>

          <div className="max-w-[760px]">
            <div
              className="mb-5 inline-flex items-center gap-2 rounded-full bg-soft-teal px-4 py-2 text-[10px] font-extrabold text-primary"
              style={{
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible
                  ? "translateY(0) scale(1)"
                  : "translateY(15px) scale(.95)",
                transition: "all 800ms ease 200ms",
              }}
            >
              <BsStars />

              <span>
                لقينا لك الرحلات المناسبة
              </span>
            </div>

            <h1
              className="mb-4 text-[42px] font-black leading-[1.15] tracking-[-1.5px] text-text sm:text-[52px] lg:text-[64px]"
              style={{
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible
                  ? "translateY(0) scale(1)"
                  : "translateY(25px) scale(.97)",
                transition:
                  "all 1000ms cubic-bezier(0.16,1,0.3,1) 350ms",
              }}
            >
              رحلتك من{" "}
              <span className="bg-gradient-to-l from-[#078a91] to-[#15ba9d] bg-clip-text text-transparent">
                {originName}
              </span>{" "}
              إلى{" "}
              <span className="bg-gradient-to-l from-[#078a91] to-[#15ba9d] bg-clip-text text-transparent">
                {destinationName}
              </span>
            </h1>

            <p
              className="max-w-[650px] text-[14px] font-medium leading-[2] text-muted sm:text-[16px]"
              style={{
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible
                  ? "translateY(0)"
                  : "translateY(20px)",
                transition: "all 900ms ease 500ms",
              }}
            >
              اختاري الرحلة اللي بتناسب وقتك وسعرك،
              وخلي سيرنا يهتم بالباقي.
            </p>
          </div>
        </div>
      </section>

      <section
        ref={searchRef}
        className="relative z-20 mx-auto -mt-6 w-full max-w-[1120px] px-5 sm:px-7"
      >
        <div
          className="relative overflow-hidden rounded-[24px] border border-border bg-surface shadow-[0_25px_70px_rgba(19,54,72,0.12)]"
          style={{
            opacity: searchVisible ? 1 : 0,
            transform: searchVisible
              ? "translateY(0) scale(1)"
              : "translateY(35px) scale(.97)",
            transition:
              "opacity 1200ms ease, transform 1400ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <div className="pointer-events-none absolute -right-28 -top-28 h-64 w-64 rounded-full bg-primary/8 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-28 -left-28 h-64 w-64 rounded-full bg-soft-teal/60 blur-3xl" />

          <div className="relative flex items-center justify-between gap-5 border-b border-border px-6 py-5 max-[850px]:flex-col max-[850px]:items-start max-[650px]:px-4 max-[650px]:py-4">
            <div
              className="flex items-center gap-3"
              style={{
                opacity: searchVisible ? 1 : 0,
                transform: searchVisible
                  ? "translateY(0)"
                  : "translateY(18px)",
                transition: "all 800ms ease 300ms",
              }}
            >
              <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-[13px] bg-soft-teal text-primary">
                <span className="absolute inset-0 rounded-[13px] bg-primary/10" />

                <FiMapPin className="relative text-lg" />
              </span>

              <div className="flex flex-col gap-1">
                <strong className="text-[13px] font-black text-text sm:text-sm">
                  عدّل بحثك
                </strong>

                <span className="text-[10px] font-medium text-muted sm:text-[11px]">
                  غيّر الوجهة أو التاريخ وشوف الرحلات الجديدة
                </span>
              </div>
            </div>

            <div
              className="flex items-center gap-2 rounded-full bg-soft-teal px-4 py-2 text-[10px] font-extrabold text-primary"
              style={{
                opacity: searchVisible ? 1 : 0,
                transform: searchVisible
                  ? "translateY(0)"
                  : "translateY(15px)",
                transition: "all 800ms ease 450ms",
              }}
            >
              <BsStars />

              <span>
                بحث سريع وواضح
              </span>
            </div>
          </div>

          <form
            onSubmit={handleSearch}
            className="relative grid grid-cols-[1fr_auto_1fr_1fr_0.8fr_auto] items-end gap-3 p-5 max-[950px]:grid-cols-2 max-[950px]:gap-4 max-[650px]:gap-3 max-[650px]:p-4"
          >
            <div className="contents max-[950px]:flex max-[950px]:items-end max-[950px]:gap-2 max-[650px]:gap-1">
              <label
                className="flex min-w-0 flex-1 flex-col gap-2"
                style={{
                  opacity: searchVisible ? 1 : 0,
                  transform: searchVisible
                    ? "translateY(0)"
                    : "translateY(18px)",
                  transition: "all 800ms ease 550ms",
                }}
              >
                <span className="text-[10px] font-extrabold text-muted sm:text-[11px]">
                  من وين؟
                </span>

                <div className="group relative">
                  <FiMapPin
                    className={`${iconClass} group-hover:scale-110`}
                  />

                  <select
                    value={origin}
                    onChange={(e) =>
                      setOrigin(e.target.value)
                    }
                    disabled={citiesLoading}
                    className={fieldClass}
                  >
                    {cities.map((city) => (
                      <option
                        key={city.id}
                        value={city.id}
                      >
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
              </label>

              <button
                type="button"
                onClick={swapCities}
                aria-label="تبديل المحافظات"
                className="mb-1 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border bg-soft-teal text-primary shadow-sm transition-all duration-500 hover:scale-110 hover:bg-primary hover:text-white max-[650px]:h-8 max-[650px]:w-8"
                style={{
                  opacity: searchVisible ? 1 : 0,
                  transform: searchVisible
                    ? "translateY(0)"
                    : "translateY(18px)",
                  transition:
                    "opacity 800ms ease 650ms, transform 800ms cubic-bezier(0.16,1,0.3,1) 650ms",
                }}
              >
                <FiRepeat
                  className={`text-[15px] transition-transform duration-700 ${
                    isSwapped
                      ? "rotate-180"
                      : "rotate-0"
                  }`}
                />
              </button>

              <label
                className="flex min-w-0 flex-1 flex-col gap-2"
                style={{
                  opacity: searchVisible ? 1 : 0,
                  transform: searchVisible
                    ? "translateY(0)"
                    : "translateY(18px)",
                  transition: "all 800ms ease 700ms",
                }}
              >
                <span className="text-[10px] font-extrabold text-muted sm:text-[11px]">
                  لوين؟
                </span>

                <div className="group relative">
                  <FiMapPin
                    className={`${iconClass} group-hover:scale-110`}
                  />

                  <select
                    value={destination}
                    onChange={(e) =>
                      setDestination(e.target.value)
                    }
                    disabled={citiesLoading}
                    className={fieldClass}
                  >
                    {cities.map((city) => (
                      <option
                        key={city.id}
                        value={city.id}
                      >
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
              </label>
            </div>

            <label
              className="flex min-w-0 flex-col gap-2"
              style={{
                opacity: searchVisible ? 1 : 0,
                transform: searchVisible
                  ? "translateY(0)"
                  : "translateY(18px)",
                transition: "all 800ms ease 800ms",
              }}
            >
              <span className="text-[10px] font-extrabold text-muted sm:text-[11px]">
                تاريخ الرحلة
              </span>

              <div className="group relative">
                <FiCalendar
                  className={`${iconClass} group-hover:scale-110`}
                />

                <input
                  type="date"
                  value={searchDate}
                  onChange={(e) =>
                    setSearchDate(e.target.value)
                  }
                  className={fieldClass}
                />
              </div>
            </label>

            <label
              className="flex min-w-0 flex-col gap-2"
              style={{
                opacity: searchVisible ? 1 : 0,
                transform: searchVisible
                  ? "translateY(0)"
                  : "translateY(18px)",
                transition: "all 800ms ease 900ms",
              }}
            >
              <span className="text-[10px] font-extrabold text-muted sm:text-[11px]">
                المسافرين
              </span>

              <div className="group relative">
                <FiUsers
                  className={`${iconClass} group-hover:scale-110`}
                />

                <select
                  value={searchPeople}
                  onChange={(e) =>
                    setSearchPeople(e.target.value)
                  }
                  className={fieldClass}
                >
                  <option value="1">
                    1 مسافر
                  </option>

                  <option value="2">
                    2 مسافرين
                  </option>

                  <option value="3">
                    3 مسافرين
                  </option>

                  <option value="4">
                    4 مسافرين
                  </option>
                </select>
              </div>
            </label>

            <button
              type="submit"
              className="group flex h-[50px] items-center justify-center gap-2 whitespace-nowrap rounded-[14px] bg-primary px-5 text-[11px] font-extrabold text-white shadow-[0_10px_25px_rgba(10,169,155,0.18)] transition-all duration-500 hover:-translate-y-1 hover:bg-primary-deep hover:shadow-[0_15px_30px_rgba(10,169,155,0.25)] active:translate-y-0 active:scale-[0.98] max-[950px]:col-span-2 max-[950px]:w-full max-[650px]:h-11 max-[650px]:rounded-xl"
              style={{
                opacity: searchVisible ? 1 : 0,
                transform: searchVisible
                  ? "translateY(0)"
                  : "translateY(18px)",
                transition:
                  "opacity 800ms ease 1050ms, transform 800ms cubic-bezier(0.16,1,0.3,1) 1050ms",
              }}
            >
              <FiSearch className="text-[15px] transition-transform duration-500 group-hover:scale-110" />

              <span>
                ابحث عن رحلات
              </span>
            </button>
          </form>
        </div>
      </section>

      <section
        ref={resultsRef}
        className="mx-auto w-full max-w-[1216px] px-5 pb-20 pt-14 sm:px-7 lg:pt-16"
      >
        <div
          style={{
            opacity: resultsVisible ? 1 : 0,
            transform: resultsVisible
              ? "translateY(0)"
              : "translateY(30px)",
            transition:
              "opacity 900ms ease, transform 1000ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />

                <span className="text-[11px] font-extrabold text-primary">
                  الرحلات المتاحة
                </span>
              </div>

              <h2 className="text-[28px] font-black text-text sm:text-[34px]">
                اختاري الرحلة اللي بتناسبك
              </h2>

              <p className="mt-2 text-[12px] font-medium text-muted sm:text-[13px]">
                {date
                  ? formatDate(date)
                  : "اختاري تاريخ الرحلة"}
              </p>
            </div>

            <button
              type="button"
              onClick={scrollToSearch}
              className="flex w-fit items-center gap-2 rounded-[13px] border border-border bg-surface px-4 py-3 text-[11px] font-extrabold text-text shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:text-primary"
            >
              <FiSearch />

              تعديل البحث
            </button>
          </div>

          {companies.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  setCompanyFilter("all")
                }
                className={`rounded-full px-4 py-2 text-[10px] font-extrabold transition-all duration-300 ${
                  companyFilter === "all"
                    ? "bg-primary text-white shadow-[0_8px_20px_rgba(10,169,155,0.18)]"
                    : "bg-surface text-muted hover:bg-soft-teal hover:text-primary"
                }`}
              >
                كل الشركات
              </button>

              {companies.map((company) => (
                <button
                  key={company.id}
                  type="button"
                  onClick={() =>
                    setCompanyFilter(
                      String(company.id)
                    )
                  }
                  className={`rounded-full px-4 py-2 text-[10px] font-extrabold transition-all duration-300 ${
                    String(companyFilter) ===
                    String(company.id)
                      ? "bg-primary text-white shadow-[0_8px_20px_rgba(10,169,155,0.18)]"
                      : "bg-surface text-muted hover:bg-soft-teal hover:text-primary"
                  }`}
                >
                  {company.name}
                </button>
              ))}
            </div>
          )}

          <div className="mb-7 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setTimeFilter(
                  timeFilter === "morning"
                    ? "all"
                    : "morning"
                )
              }
              className={`rounded-[12px] border px-4 py-2 text-[10px] font-extrabold transition-all ${
                timeFilter === "morning"
                  ? "border-primary bg-soft-teal text-primary"
                  : "border-border bg-surface text-muted hover:border-primary/40"
              }`}
            >
              صباحًا
            </button>

            <button
              type="button"
              onClick={() =>
                setTimeFilter(
                  timeFilter === "afternoon"
                    ? "all"
                    : "afternoon"
                )
              }
              className={`rounded-[12px] border px-4 py-2 text-[10px] font-extrabold transition-all ${
                timeFilter === "afternoon"
                  ? "border-primary bg-soft-teal text-primary"
                  : "border-border bg-surface text-muted hover:border-primary/40"
              }`}
            >
              بعد الظهر
            </button>

            <button
              type="button"
              onClick={() =>
                setTimeFilter(
                  timeFilter === "evening"
                    ? "all"
                    : "evening"
                )
              }
              className={`rounded-[12px] border px-4 py-2 text-[10px] font-extrabold transition-all ${
                timeFilter === "evening"
                  ? "border-primary bg-soft-teal text-primary"
                  : "border-border bg-surface text-muted hover:border-primary/40"
              }`}
            >
              مساءً
            </button>

            <button
              type="button"
              onClick={() =>
                setTimeFilter(
                  timeFilter === "night"
                    ? "all"
                    : "night"
                )
              }
              className={`rounded-[12px] border px-4 py-2 text-[10px] font-extrabold transition-all ${
                timeFilter === "night"
                  ? "border-primary bg-soft-teal text-primary"
                  : "border-border bg-surface text-muted hover:border-primary/40"
              }`}
            >
              ليلًا
            </button>

            <select
              value={sort}
              onChange={(e) =>
                setSort(e.target.value)
              }
              className="mr-auto rounded-[12px] border border-border bg-surface px-4 py-2 text-[10px] font-extrabold text-text outline-none transition-all focus:border-primary"
            >
              <option value="departure">
                الأقرب بالوقت
              </option>

              <option value="price">
                الأرخص
              </option>

              <option value="duration">
                الأقصر مدة
              </option>
            </select>
          </div>

          {isLoading && (
            <div className="grid gap-5 lg:grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-[230px] animate-pulse rounded-[22px] border border-border bg-surface"
                />
              ))}
            </div>
          )}

          {isError && !isLoading && (
            <div className="rounded-[22px] border border-border bg-surface px-6 py-12 text-center shadow-custom">
              <h3 className="text-lg font-black text-text">
                ما قدرنا نجيب الرحلات
              </h3>

              <p className="mt-2 text-sm text-muted">
                جرّبي تغيير البحث أو التاريخ.
              </p>
            </div>
          )}

          {!isLoading &&
            !isError &&
            filteredTrips.length === 0 && (
              <div className="rounded-[22px] border border-border bg-surface px-6 py-14 text-center shadow-custom">
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-soft-teal text-primary">
                  <FiSearch className="text-xl" />
                </div>

                <h3 className="text-lg font-black text-text">
                  ما لقينا رحلات بهالبحث
                </h3>

                <p className="mt-2 text-sm text-muted">
                  جرّبي تاريخ أو وجهة مختلفة.
                </p>

                <button
                  type="button"
                  onClick={scrollToSearch}
                  className="mt-6 rounded-[13px] bg-primary px-5 py-3 text-[11px] font-extrabold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-primary-deep"
                >
                  تعديل البحث
                </button>
              </div>
            )}

          {!isLoading &&
            !isError &&
            filteredTrips.length > 0 && (
              <div className="grid gap-5 lg:grid-cols-2">
                {filteredTrips.map((trip, index) => (
                  <article
                    key={trip.id}
                    className="group overflow-hidden rounded-[22px] border border-border bg-surface shadow-[0_15px_50px_rgba(19,54,72,0.06)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(19,54,72,0.11)]"
                    style={{
                      opacity: resultsVisible ? 1 : 0,
                      transform: resultsVisible
                        ? "translateY(0)"
                        : "translateY(30px)",
                      transition: `opacity 800ms ease ${
                        index * 120 + 200
                      }ms, transform 900ms cubic-bezier(0.16,1,0.3,1) ${
                        index * 120 + 200
                      }ms`,
                    }}
                  >
                    <div className="flex items-center justify-between border-b border-border px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="grid h-11 w-11 place-items-center overflow-hidden rounded-[13px] bg-soft-teal text-primary">
                          {trip.company?.logoUrl ? (
                            <img
                              src={trip.company.logoUrl}
                              alt={trip.company.name}
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <FiMapPin className="text-lg" />
                          )}
                        </div>

                        <div>
                          <h3 className="text-[13px] font-black text-text">
                            {trip.company?.name ||
                              "شركة النقل"}
                          </h3>

                          <span className="text-[10px] font-bold text-muted">
                            {trip.code || "رحلة"}
                          </span>
                        </div>
                      </div>

                      <span className="rounded-full bg-soft-teal px-3 py-1.5 text-[9px] font-extrabold text-primary">
                        متاحة
                      </span>
                    </div>

                    <div className="px-5 py-5">
                      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                        <div>
                          <span className="block text-[10px] font-bold text-muted">
                            الانطلاق
                          </span>

                          <strong className="mt-1 block text-[22px] font-black text-text">
                            {formatTime(
                              trip.departureAt
                            )}
                          </strong>

                          <span className="mt-1 block text-[11px] font-extrabold text-text">
                            {trip.origin?.name ||
                              originName}
                          </span>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                          <div className="h-px w-16 bg-border" />

                          <FiArrowLeft className="text-primary" />

                          <span className="flex items-center gap-1 text-[9px] font-bold text-muted">
                            <FiClock />

                            {formatDuration(
                              trip.departureAt,
                              trip.arrivalAt
                            )}
                          </span>
                        </div>

                        <div className="text-left">
                          <span className="block text-[10px] font-bold text-muted">
                            الوصول
                          </span>

                          <strong className="mt-1 block text-[22px] font-black text-text">
                            {formatTime(
                              trip.arrivalAt
                            )}
                          </strong>

                          <span className="mt-1 block text-[11px] font-extrabold text-text">
                            {trip.destination?.name ||
                              destinationName}
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 flex items-end justify-between gap-4 border-t border-border pt-5">
                        <div>
                          <span className="block text-[10px] font-bold text-muted">
                            سعر التذكرة
                          </span>

                          <strong className="mt-1 block text-[20px] font-black text-primary">
                            {formatPrice(trip.price)}
                          </strong>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/booking/${trip.id}?people=${people}`
                            )
                          }
                          className="flex items-center gap-2 rounded-[13px] bg-primary px-5 py-3 text-[10px] font-extrabold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-primary-deep"
                        >
                          احجز الرحلة

                          <FiArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
        </div>
      </section>
    </main>
  )
}

export default ResultsPage
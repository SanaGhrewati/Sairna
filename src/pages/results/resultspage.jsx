import { useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import {
  FiArrowLeft,
  FiClock,
  FiFilter,
  FiMapPin,
  FiRefreshCw,
  FiTruck,
  FiUsers,
  FiChevronDown,
  FiCheck,
} from "react-icons/fi"
import { BsStars } from "react-icons/bs"
import { useGetTrips } from "../../hooks/use-trips"

function ResultsPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const originId = searchParams.get("originId")
  const destinationId = searchParams.get("destinationId")
  const date = searchParams.get("date")
  const people = searchParams.get("people") || "1"

  const [companyFilter, setCompanyFilter] = useState("all")
  const [timeFilter, setTimeFilter] = useState("all")
  const [sort, setSort] = useState("earliest")
  const [showFilters, setShowFilters] = useState(false)

  const filters = {
    originId: originId ? Number(originId) : undefined,
    destinationId: destinationId ? Number(destinationId) : undefined,
    date: date || undefined,
  }

  const {
    data: tripsData,
    isLoading,
    isError,
  } = useGetTrips(filters)

  const trips = Array.isArray(tripsData)
    ? tripsData
    : tripsData?.items || []

  const companies = useMemo(() => {
    const uniqueCompanies = new Map()

    trips.forEach((trip) => {
      if (trip.company?.id) {
        uniqueCompanies.set(trip.company.id, trip.company)
      }
    })

    return Array.from(uniqueCompanies.values())
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
        if (!trip.departureAt) return false

        const hour = Number(trip.departureAt.slice(11, 13))

        if (timeFilter === "morning") {
          return hour < 12
        }

        if (timeFilter === "afternoon") {
          return hour >= 12 && hour < 17
        }

        if (timeFilter === "evening") {
          return hour >= 17
        }

        return true
      })
    }

    result.sort((a, b) => {
      if (sort === "cheap") {
        return Number(a.price) - Number(b.price)
      }

      if (sort === "quick") {
        const durationA =
          new Date(a.arrivalAt).getTime() -
          new Date(a.departureAt).getTime()

        const durationB =
          new Date(b.arrivalAt).getTime() -
          new Date(b.departureAt).getTime()

        return durationA - durationB
      }

      return (
        new Date(a.departureAt).getTime() -
        new Date(b.departureAt).getTime()
      )
    })

    return result
  }, [trips, companyFilter, timeFilter, sort])

  const originName =
    trips[0]?.origin?.name ||
    getCityName(originId)

  const destinationName =
    trips[0]?.destination?.name ||
    getCityName(destinationId)

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("ar-SY")
  }

  const formatTime = (dateTime) => {
    if (!dateTime) return "--:--"

    const date = new Date(dateTime)

    return date.toLocaleTimeString("ar-SY", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  const formatDate = (value) => {
    if (!value) return "—"

    const date = new Date(`${value}T00:00:00`)

    return date.toLocaleDateString("ar-SY", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })
  }

  const getDuration = (departure, arrival) => {
    if (!departure || !arrival) return "—"

    const minutes = Math.round(
      (new Date(arrival).getTime() -
        new Date(departure).getTime()) /
        60000
    )

    if (minutes <= 0) return "—"

    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60

    if (hours === 0) {
      return `${mins} دقيقة`
    }

    if (mins === 0) {
      return `${hours} ساعات`
    }

    return `${hours}س ${mins}د`
  }

  const resetFilters = () => {
    setCompanyFilter("all")
    setTimeFilter("all")
    setSort("earliest")
  }

  const handleBooking = (trip) => {
    navigate(`/booking/${trip.id}?people=${people}`)
  }

  return (
    <main dir="rtl" className="min-h-screen bg-bg">
      <section className="relative overflow-hidden bg-surface-alt">
        <div className="mx-auto w-full max-w-[1216px] px-5 pb-10 pt-7 md:px-7 lg:pb-12">
          <div className="mb-7 flex items-center gap-2 text-[11px] font-bold text-muted">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="transition-colors hover:text-primary"
            >
              الرئيسية
            </button>

            <FiArrowLeft size={13} />

            <span>نتائج البحث</span>
          </div>

          <div className="flex items-center justify-between gap-8">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-soft-teal px-3 py-1.5 text-[10px] font-extrabold text-primary">
                <BsStars size={13} />
                <span>لنكمل الطريق</span>
              </div>

              <h1 className="m-0 text-[32px] font-black leading-[1.3] tracking-[-1px] text-text sm:text-[40px] lg:text-[48px]">
                اختار الرحلة{" "}
                <span className="bg-gradient-to-l from-primary-deep to-primary bg-clip-text text-transparent">
                  اللي بتشبهك.
                </span>
              </h1>

              <p className="mt-3 max-w-[570px] text-[13px] leading-7 text-muted sm:text-[14px]">
                قارن بين الشركات والأوقات، واحجز مقعدك بكل سهولة.
              </p>
            </div>

            <div className="hidden h-[105px] w-[105px] shrink-0 items-center justify-center rounded-[30px] bg-dark text-white shadow-custom-md lg:flex">
              <FiTruck size={58} strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1216px] px-5 pb-16 md:px-7">
        <div className="relative z-10 -mt-5 rounded-[18px] border border-border bg-surface p-4 shadow-custom md:p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-extrabold text-primary">
                رحلة البحث
              </span>

              <h2 className="mt-1 text-[14px] font-black text-text">
                {originName} ← {destinationName}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="rounded-[10px] border border-border bg-surface-alt px-3 py-2 text-[10px] font-extrabold text-text transition-all hover:border-primary hover:text-primary"
            >
              تعديل البحث
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
            <SearchSummary
              label="من"
              value={originName}
              icon={<FiMapPin size={15} />}
            />

            <SearchSummary
              label="إلى"
              value={destinationName}
              icon={<FiMapPin size={15} />}
            />

            <SearchSummary
              label="تاريخ الرحلة"
              value={formatDate(date)}
              icon={<FiClock size={15} />}
            />

            <SearchSummary
              label="المسافرون"
              value={`${people} ${Number(people) === 1 ? "مسافر" : "مسافرين"}`}
              icon={<FiUsers size={15} />}
            />
          </div>
        </div>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-soft-teal text-[13px] font-black text-primary">
                01
              </span>

              <div>
                <h2 className="m-0 text-[15px] font-black text-text">
                  اختار شركة النقل
                </h2>

                <p className="mt-1 text-[11px] text-muted">
                  حدد الشركة اللي بتفضّلها، ومنعرضلك مواعيدها المتاحة.
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-2 text-[11px] font-extrabold text-muted md:flex">
              02
              <FiArrowLeft size={14} />
              اختار الوقت والمقعد
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5 lg:gap-2.5">
            <CompanyButton
              active={companyFilter === "all"}
              onClick={() => setCompanyFilter("all")}
              icon={<FiTruck size={22} />}
              name="كل الشركات"
              description="قارن الخيارات"
            />

            {companies.map((company) => (
              <CompanyButton
                key={company.id}
                active={String(companyFilter) === String(company.id)}
                onClick={() => setCompanyFilter(company.id)}
                name={company.name}
                description="رحلات متاحة"
                logo={company.logoUrl}
              />
            ))}
          </div>
        </section>

        <section className="mt-9">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-[10px] font-extrabold text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                الرحلات المتاحة
              </div>

              <h2 className="m-0 text-[24px] font-black tracking-[-0.6px] text-text sm:text-[29px]">
                اختار الوقت والمقعد
              </h2>

              <p className="mt-2 text-[11px] leading-6 text-muted">
                {filteredTrips.length > 0
                  ? `لقينا لك ${filteredTrips.length} رحلة مناسبة لبحثك.`
                  : "ما لقينا رحلات مطابقة للخيارات الحالية."}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowFilters((value) => !value)}
                className="inline-flex min-h-10 items-center gap-2 rounded-[11px] border border-border bg-surface px-3.5 text-[11px] font-extrabold text-text transition-all hover:border-primary hover:text-primary lg:hidden"
              >
                <FiFilter size={15} />
                الفلاتر
              </button>

              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="min-h-10 appearance-none rounded-[11px] border border-border bg-surface px-4 pe-9 text-[11px] font-extrabold text-text outline-none transition-all focus:border-primary"
                >
                  <option value="earliest">الأبكر أولاً</option>
                  <option value="cheap">الأقل سعراً</option>
                  <option value="quick">الأسرع</option>
                </select>

                <FiChevronDown
                  size={14}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
            <aside
              className={`
                ${showFilters ? "block" : "hidden"}
                rounded-[18px] border border-border bg-surface p-4
                lg:block
              `}
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiFilter size={16} className="text-primary" />

                  <h3 className="m-0 text-[13px] font-black text-text">
                    تصفية النتائج
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1 text-[10px] font-extrabold text-primary"
                >
                  <FiRefreshCw size={12} />
                  إعادة
                </button>
              </div>

              <FilterGroup title="وقت الانطلاق">
                <FilterOption
                  active={timeFilter === "all"}
                  label="كل الأوقات"
                  onClick={() => setTimeFilter("all")}
                />

                <FilterOption
                  active={timeFilter === "morning"}
                  label="الصباح — قبل 12"
                  onClick={() => setTimeFilter("morning")}
                />

                <FilterOption
                  active={timeFilter === "afternoon"}
                  label="بعد الظهر — 12 إلى 17"
                  onClick={() => setTimeFilter("afternoon")}
                />

                <FilterOption
                  active={timeFilter === "evening"}
                  label="المساء — بعد 17"
                  onClick={() => setTimeFilter("evening")}
                />
              </FilterGroup>

              <FilterGroup title="شركة النقل">
                <FilterOption
                  active={companyFilter === "all"}
                  label="كل الشركات"
                  onClick={() => setCompanyFilter("all")}
                />

                {companies.map((company) => (
                  <FilterOption
                    key={company.id}
                    active={
                      String(companyFilter) === String(company.id)
                    }
                    label={company.name}
                    onClick={() => setCompanyFilter(company.id)}
                  />
                ))}
              </FilterGroup>
            </aside>

            <div className="min-w-0">
              {isLoading && (
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <TripSkeleton key={item} />
                  ))}
                </div>
              )}

              {isError && !isLoading && (
                <div className="rounded-[18px] border border-border bg-surface px-5 py-12 text-center shadow-custom">
                  <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-soft-teal text-primary">
                    <FiRefreshCw size={22} />
                  </div>

                  <h3 className="m-0 text-[15px] font-black text-text">
                    صار في مشكلة بجلب الرحلات
                  </h3>

                  <p className="mx-auto mt-2 max-w-[420px] text-[11px] leading-6 text-muted">
                    تأكدي من الاتصال بالإنترنت وحاولي مرة ثانية.
                  </p>

                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="mt-5 rounded-xl bg-primary px-5 py-3 text-[11px] font-extrabold text-white transition-all hover:bg-primary-deep"
                  >
                    إعادة المحاولة
                  </button>
                </div>
              )}

              {!isLoading &&
                !isError &&
                filteredTrips.length === 0 && (
                  <div className="rounded-[18px] border border-border bg-surface px-5 py-14 text-center shadow-custom">
                    <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-soft-teal text-primary">
                      <FiTruck size={25} />
                    </div>

                    <h3 className="m-0 text-[16px] font-black text-text">
                      ما في رحلات مطابقة
                    </h3>

                    <p className="mx-auto mt-2 max-w-[420px] text-[11px] leading-6 text-muted">
                      جربي تغيير وقت الرحلة أو شركة النقل حتى نعرضلك
                      خيارات أكثر.
                    </p>

                    <button
                      type="button"
                      onClick={resetFilters}
                      className="mt-5 inline-flex items-center gap-2 rounded-xl border border-border bg-surface-alt px-5 py-3 text-[11px] font-extrabold text-text transition-all hover:border-primary hover:text-primary"
                    >
                      <FiRefreshCw size={13} />
                      مسح الفلاتر
                    </button>
                  </div>
                )}

              {!isLoading &&
                !isError &&
                filteredTrips.length > 0 && (
                  <div className="space-y-3.5">
                    {filteredTrips.map((trip) => (
                      <TripCard
                        key={trip.id}
                        trip={trip}
                        onBooking={() => handleBooking(trip)}
                        formatPrice={formatPrice}
                        formatTime={formatTime}
                        getDuration={getDuration}
                      />
                    ))}
                  </div>
                )}
            </div>
          </div>
        </section>
      </section>
    </main>
  )
}

function SearchSummary({ label, value, icon }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5 rounded-xl border border-border bg-surface-alt px-3 py-2.5">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[10px] bg-soft-teal text-primary">
        {icon}
      </span>

      <div className="min-w-0">
        <span className="block text-[9px] font-bold text-muted">
          {label}
        </span>

        <strong className="mt-0.5 block truncate text-[11px] font-black text-text">
          {value}
        </strong>
      </div>
    </div>
  )
}

function CompanyButton({
  active,
  onClick,
  icon,
  name,
  description,
  logo,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex min-w-0 flex-col items-center justify-center
        gap-1.5 rounded-[13px] border px-2 py-3.5
        text-center transition-all duration-200
        hover:-translate-y-0.5 hover:border-primary
        ${
          active
            ? "border-primary bg-soft-teal shadow-[0_0_0_2px_rgba(16,177,155,0.08)]"
            : "border-border bg-surface"
        }
      `}
    >
      <span
        className={`
          grid h-9 w-9 place-items-center overflow-hidden rounded-xl
          ${
            active
              ? "bg-primary text-white"
              : "bg-surface-alt text-primary"
          }
        `}
      >
        {logo ? (
          <img
            src={logo}
            alt=""
            className="h-full w-full object-contain p-1.5"
          />
        ) : (
          icon || <FiTruck size={19} />
        )}
      </span>

      <span className="line-clamp-2 text-[10px] font-black leading-[1.45] text-text sm:text-[11px]">
        {name}
      </span>

      <small className="text-[9px] font-bold text-muted">
        {description}
      </small>
    </button>
  )
}

function FilterGroup({ title, children }) {
  return (
    <div className="border-t border-border py-4 first:border-t-0 first:pt-0">
      <h4 className="mb-2.5 text-[11px] font-black text-text">
        {title}
      </h4>

      <div className="space-y-1">{children}</div>
    </div>
  )
}

function FilterOption({ active, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex w-full items-center justify-between rounded-[9px]
        px-2.5 py-2 text-right text-[10px] font-bold
        transition-all
        ${
          active
            ? "bg-soft-teal text-primary"
            : "text-muted hover:bg-surface-alt hover:text-text"
        }
      `}
    >
      <span>{label}</span>

      {active && <FiCheck size={13} />}
    </button>
  )
}

function TripCard({
  trip,
  onBooking,
  formatPrice,
  formatTime,
  getDuration,
}) {
  const availableSeats =
    trip.availableSeats ??
    trip.totalSeats - (trip._count?.bookingSeats || 0)

  const isAvailable =
    trip.status === "AVAILABLE" && Number(availableSeats) > 0

  return (
    <article className="overflow-hidden rounded-[18px] border border-border bg-surface shadow-[0_8px_30px_rgba(19,54,72,0.045)] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-custom">
      <div className="p-4 sm:p-5">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-surface-alt text-primary">
              {trip.company?.logoUrl ? (
                <img
                  src={trip.company.logoUrl}
                  alt=""
                  className="h-full w-full object-contain p-1.5"
                />
              ) : (
                <FiTruck size={23} />
              )}
            </span>

            <div className="min-w-0">
              <h3 className="truncate text-[13px] font-black text-text">
                {trip.company?.name || "شركة النقل"}
              </h3>

              <div className="mt-1 flex items-center gap-2 text-[9px] font-bold text-muted">
                <span>رحلة مباشرة</span>
                <span className="h-1 w-1 rounded-full bg-primary" />
                <span>{trip.code || `رحلة #${trip.id}`}</span>
              </div>
            </div>
          </div>

          <span
            className={`
              self-start rounded-full px-2.5 py-1 text-[9px] font-extrabold
              ${
                isAvailable
                  ? "bg-soft-teal text-primary"
                  : "bg-red-50 text-red-500"
              }
            `}
          >
            {isAvailable ? "متاحة للحجز" : "غير متاحة"}
          </span>
        </div>

        <div className="grid items-center gap-4 md:grid-cols-[1fr_120px_1fr]">
          <div className="text-right">
            <span className="text-[9px] font-bold text-muted">
              الانطلاق
            </span>

            <strong className="mt-1 block text-[25px] font-black leading-none tracking-[-1px] text-text">
              {formatTime(trip.departureAt)}
            </strong>

            <span className="mt-2 block text-[11px] font-extrabold text-text">
              {trip.origin?.name || "—"}
            </span>
          </div>

          <div className="hidden flex-col items-center md:flex">
            <span className="mb-2 text-[9px] font-bold text-muted">
              {getDuration(trip.departureAt, trip.arrivalAt)}
            </span>

            <div className="flex w-full items-center gap-1.5">
              <span className="h-2 w-2 rounded-full border-2 border-primary bg-surface" />

              <span className="h-px flex-1 bg-border" />

              <FiTruck size={15} className="shrink-0 text-primary" />

              <span className="h-px flex-1 bg-border" />

              <span className="h-2 w-2 rounded-full bg-primary" />
            </div>

            <span className="mt-2 text-[9px] font-bold text-primary">
              مباشر
            </span>
          </div>

          <div className="text-right md:text-left">
            <span className="text-[9px] font-bold text-muted">
              الوصول
            </span>

            <strong className="mt-1 block text-[25px] font-black leading-none tracking-[-1px] text-text">
              {formatTime(trip.arrivalAt)}
            </strong>

            <span className="mt-2 block text-[11px] font-extrabold text-text">
              {trip.destination?.name || "—"}
            </span>
          </div>
        </div>

        <div className="my-5 border-t border-dashed border-border" />

        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface-alt px-2.5 py-1.5 text-[9px] font-extrabold text-muted">
              <FiClock size={12} />
              {getDuration(trip.departureAt, trip.arrivalAt)}
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface-alt px-2.5 py-1.5 text-[9px] font-extrabold text-muted">
              <FiUsers size={12} />
              {availableSeats} مقعد متاح
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface-alt px-2.5 py-1.5 text-[9px] font-extrabold text-muted">
              <FiMapPin size={12} />
              رحلة مباشرة
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 sm:justify-end">
            <div className="text-right">
              <span className="block text-[9px] font-bold text-muted">
                السعر للمسافر
              </span>

              <strong className="mt-0.5 block text-[19px] font-black text-primary">
                {formatPrice(trip.price)}
                <span className="ms-1 text-[9px] font-extrabold">
                  ل.س
                </span>
              </strong>
            </div>

            <button
              type="button"
              disabled={!isAvailable}
              onClick={onBooking}
              className={`
                min-h-[43px] rounded-xl px-5 text-[11px] font-black
                transition-all
                ${
                  isAvailable
                    ? "bg-primary text-white hover:-translate-y-0.5 hover:bg-primary-deep"
                    : "cursor-not-allowed bg-surface-alt text-muted"
                }
              `}
            >
              {isAvailable ? "احجز مقعدك" : "غير متاحة"}
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

function TripSkeleton() {
  return (
    <div className="animate-pulse rounded-[18px] border border-border bg-surface p-5">
      <div className="mb-6 flex justify-between gap-4">
        <div className="flex gap-3">
          <div className="h-11 w-11 rounded-xl bg-surface-alt" />

          <div>
            <div className="h-3 w-32 rounded bg-surface-alt" />
            <div className="mt-2 h-2.5 w-24 rounded bg-surface-alt" />
          </div>
        </div>

        <div className="h-6 w-20 rounded-full bg-surface-alt" />
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div>
          <div className="h-2.5 w-14 rounded bg-surface-alt" />
          <div className="mt-2 h-7 w-20 rounded bg-surface-alt" />
          <div className="mt-2 h-2.5 w-14 rounded bg-surface-alt" />
        </div>

        <div className="hidden items-center justify-center md:flex">
          <div className="h-px w-full bg-surface-alt" />
        </div>

        <div>
          <div className="h-2.5 w-14 rounded bg-surface-alt" />
          <div className="mt-2 h-7 w-20 rounded bg-surface-alt" />
          <div className="mt-2 h-2.5 w-14 rounded bg-surface-alt" />
        </div>
      </div>

      <div className="my-5 h-px bg-surface-alt" />

      <div className="flex justify-between gap-4">
        <div className="h-7 w-48 rounded bg-surface-alt" />
        <div className="h-10 w-28 rounded-xl bg-surface-alt" />
      </div>
    </div>
  )
}

function getCityName(id) {
  const cities = {
    1: "دمشق",
    2: "حلب",
    3: "حمص",
    4: "حماة",
    5: "اللاذقية",
    6: "طرطوس",
    7: "إدلب",
  }

  return cities[id] || "—"
}

export default ResultsPage
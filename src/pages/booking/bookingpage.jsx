import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import {
  FiArrowRight,
  FiCheck,
  FiClock,
  FiCreditCard,
  FiShield,
  FiUser,
  FiUsers,
} from "react-icons/fi"

import Button from "../../components/button/button"
import { useGetTrip, useGetTripSeats } from "../../hooks/use-trips"
import sairnaApi from "../../api/axios"

function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translate3d(0,0,0) scale(1)"
          : "translate3d(0,24px,0) scale(.985)",
        filter: visible ? "blur(0)" : "blur(2px)",
        transition: `opacity 900ms cubic-bezier(.16,1,.3,1) ${delay}ms, transform 950ms cubic-bezier(.16,1,.3,1) ${delay}ms, filter 800ms ease ${delay}ms`,
        willChange: "opacity, transform, filter",
      }}
    >
      {children}
    </div>
  )
}

function SeatRow({
  seats,
  selectedSeats,
  occupiedSeats,
  onToggle,
  rowIndex,
}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.1,
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="grid grid-cols-4 gap-2.5"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translate3d(0,0,0) scale(1)"
          : "translate3d(0,28px,0) scale(.96)",
        filter: visible ? "blur(0)" : "blur(3px)",
        transition: `opacity 800ms cubic-bezier(.16,1,.3,1) ${rowIndex * 100}ms, transform 900ms cubic-bezier(.16,1,.3,1) ${rowIndex * 100}ms, filter 700ms ease ${rowIndex * 100}ms`,
        willChange: "opacity, transform, filter",
      }}
    >
      {seats.map((seatNumber, seatIndex) => {
        const occupied = occupiedSeats.includes(seatNumber)
        const selected = selectedSeats.includes(seatNumber)

        return (
          <button
            key={seatNumber}
            type="button"
            disabled={occupied}
            onClick={() => onToggle(seatNumber)}
            className={`
              group relative grid aspect-square min-h-10 place-items-center
              rounded-[10px] border text-[11px] font-black
              transition-all duration-500
              ease-[cubic-bezier(.16,1,.3,1)]
              ${
                occupied
                  ? "cursor-not-allowed border-border bg-border/60 text-muted"
                  : selected
                    ? "border-primary bg-primary text-white shadow-[0_8px_22px_rgba(10,169,155,0.22)] -translate-y-1 scale-[1.04]"
                    : "border-border bg-surface text-text hover:-translate-y-1 hover:scale-[1.04] hover:border-primary hover:text-primary hover:shadow-[0_10px_25px_rgba(19,54,72,0.08)] active:scale-95"
              }
            `}
            style={{
              transitionDelay: `${seatIndex * 25}ms`,
            }}
          >
            <span
              className={`
                absolute inset-[3px] rounded-[7px] opacity-0
                transition-opacity duration-500
                ${
                  selected
                    ? "bg-white/10 opacity-100"
                    : "group-hover:bg-primary/5 group-hover:opacity-100"
                }
              `}
            />

            <span className="relative z-10">{seatNumber}</span>

            {selected && (
              <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-white text-primary shadow-sm">
                <FiCheck className="text-[9px]" />
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

function BookingPage() {
  const { tripId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const requestedPeople = Number(searchParams.get("people") || 1)
  const people = Math.min(Math.max(requestedPeople, 1), 4)

  const [step, setStep] = useState("seats")
  const [selectedSeats, setSelectedSeats] = useState([])
  const [paymentMethod, setPaymentMethod] = useState("office")
  const [passengers, setPassengers] = useState(
    Array.from({ length: people }, () => ({
      name: "",
      phone: "",
    }))
  )
  const [isBooking, setIsBooking] = useState(false)
  const [bookingError, setBookingError] = useState("")

  const { data: trip, isLoading: tripLoading } = useGetTrip(tripId)
  const { data: seatsData, isLoading: seatsLoading } = useGetTripSeats(tripId)

  const totalSeats = seatsData?.totalSeats || trip?.totalSeats || 40
  const occupiedSeats = seatsData?.occupiedSeats || []
  const availableSeats =
    seatsData?.availableSeats ??
    trip?.availableSeats ??
    totalSeats - occupiedSeats.length

  const price = Number(trip?.price || 0)
  const totalPrice = price * selectedSeats.length

  const seatRows = useMemo(() => {
    const rows = []

    for (let i = 1; i <= totalSeats; i += 4) {
      rows.push([
        i,
        i + 1,
        i + 2,
        i + 3,
      ].filter((seat) => seat <= totalSeats))
    }

    return rows
  }, [totalSeats])

  const formatPrice = (value) => {
    return new Intl.NumberFormat("ar-SY").format(value)
  }

  const formatTime = (value) => {
    if (!value) return "--:--"

    return new Date(value).toLocaleTimeString("ar-SY", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (value) => {
    if (!value) return ""

    return new Date(value).toLocaleDateString("ar-SY", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })
  }

  const getDuration = () => {
    if (!trip?.departureAt || !trip?.arrivalAt) return ""

    const start = new Date(trip.departureAt)
    const end = new Date(trip.arrivalAt)

    const minutes = Math.max(
      0,
      Math.round((end - start) / (1000 * 60))
    )

    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (hours && remainingMinutes) {
      return `${hours} س و ${remainingMinutes} د`
    }

    if (hours) {
      return `${hours} س`
    }

    return `${remainingMinutes} د`
  }

  const toggleSeat = (seatNumber) => {
    if (occupiedSeats.includes(seatNumber)) return

    setSelectedSeats((current) => {
      if (current.includes(seatNumber)) {
        return current.filter((seat) => seat !== seatNumber)
      }

      if (current.length >= people) {
        return current
      }

      return [...current, seatNumber].sort((a, b) => a - b)
    })
  }

  const updatePassenger = (index, field, value) => {
    setPassengers((current) =>
      current.map((passenger, passengerIndex) =>
        passengerIndex === index
          ? {
              ...passenger,
              [field]: value,
            }
          : passenger
      )
    )
  }

  const validatePassengers = () => {
    return passengers.every(
      (passenger) =>
        passenger.name.trim().length >= 2 &&
        passenger.phone.trim().length >= 7
    )
  }

  const handleContinueFromSeats = () => {
    if (selectedSeats.length !== people) return

    setStep("passengers")
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const handleContinueFromPassengers = () => {
    if (!validatePassengers()) {
      setBookingError("يرجى إدخال اسم ورقم هاتف صحيح لكل مسافر")
      return
    }

    setBookingError("")
    setStep("review")

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const handleBooking = async () => {
    if (!validatePassengers()) {
      setBookingError("يرجى التأكد من بيانات المسافرين")
      return
    }

    if (selectedSeats.length !== people) {
      setBookingError("يرجى اختيار المقاعد المطلوبة")
      return
    }

    try {
      setIsBooking(true)
      setBookingError("")

      const payload = {
        tripId: Number(tripId),
        seats: selectedSeats.map((seatNumber, index) => ({
          seatNumber,
          passengerName: passengers[index].name.trim(),
          passengerPhone: passengers[index].phone.trim(),
        })),
      }

      await sairnaApi.post("/bookings", payload)

      navigate("/success", {
        state: {
          trip,
          selectedSeats,
          passengers,
          totalPrice,
          paymentMethod,
        },
      })
    } catch (error) {
      setBookingError(
        error?.response?.data?.message ||
          "حدث خطأ أثناء تأكيد الحجز، حاول مرة أخرى"
      )
    } finally {
      setIsBooking(false)
    }
  }

  const steps = [
    {
      id: "seats",
      label: "المقاعد",
      number: 1,
    },
    {
      id: "passengers",
      label: "المسافرين",
      number: 2,
    },
    {
      id: "review",
      label: "مراجعة الحجز",
      number: 3,
    },
  ]

  const currentStepIndex = steps.findIndex((item) => item.id === step)

  if (tripLoading || seatsLoading) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-bg px-5 py-16"
      >
        <div className="mx-auto max-w-[1100px]">
          <div className="animate-pulse space-y-6">
            <div className="mx-auto h-10 w-48 rounded-xl bg-surface-alt" />
            <div className="h-32 rounded-[28px] bg-surface-alt" />
            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
              <div className="h-[500px] rounded-[28px] bg-surface-alt" />
              <div className="h-[420px] rounded-[28px] bg-surface-alt" />
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!trip) {
    return (
      <main
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-bg px-5"
      >
        <div className="rounded-[28px] border border-border bg-surface p-8 text-center shadow-custom">
          <h2 className="mb-3 text-xl font-black text-text">
            الرحلة غير موجودة
          </h2>

          <p className="mb-6 text-sm font-medium text-muted">
            يبدو أن الرحلة التي اخترتها لم تعد متاحة.
          </p>

          <Button onClick={() => navigate("/results")}>
            العودة للرحلات
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen overflow-hidden bg-bg px-4 py-8 sm:px-6 lg:px-8 lg:py-12"
    >
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -right-40 top-20 h-80 w-80 rounded-full bg-primary/5 blur-3xl animate-[pulse_7s_ease-in-out_infinite]" />
        <div className="absolute -left-40 bottom-20 h-80 w-80 rounded-full bg-soft-teal/50 blur-3xl animate-[pulse_9s_ease-in-out_infinite]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1120px]">
        <Reveal>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-sm font-extrabold text-muted transition-all duration-500 hover:-translate-x-1 hover:text-primary"
          >
            <FiArrowRight />
            <span>العودة للرحلات</span>
          </button>
        </Reveal>

        <Reveal delay={100}>
          <div className="mb-7 text-center">
            <span className="mb-3 inline-flex rounded-full bg-soft-teal px-4 py-2 text-[10px] font-black text-primary">
              احجز رحلتك بسهولة
            </span>

            <h1 className="text-2xl font-black tracking-tight text-text sm:text-3xl">
              كمّل حجز رحلتك
            </h1>

            <p className="mx-auto mt-2 max-w-[560px] text-xs font-medium leading-7 text-muted sm:text-sm">
              اختار مقاعدك، أدخل بيانات المسافرين، وبعدها راجع تفاصيل الحجز
              قبل التأكيد.
            </p>
          </div>
        </Reveal>

        <Reveal delay={180}>
          <div className="mb-8 rounded-[24px] border border-border bg-surface p-4 shadow-custom sm:p-5">
            <div className="flex items-center justify-center">
              {steps.map((item, index) => {
                const active = index <= currentStepIndex

                return (
                  <div
                    key={item.id}
                    className="flex flex-1 items-center"
                  >
                    <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
                      <div
                        className={`
                          grid h-9 w-9 place-items-center rounded-full
                          text-xs font-black
                          transition-all duration-700
                          ${
                            active
                              ? "bg-primary text-white shadow-[0_8px_25px_rgba(10,169,155,0.2)] scale-105"
                              : "bg-surface-alt text-muted"
                          }
                        `}
                      >
                        {index < currentStepIndex ? (
                          <FiCheck />
                        ) : (
                          item.number
                        )}
                      </div>

                      <span
                        className={`
                          text-[10px] font-black transition-colors duration-500 sm:text-xs
                          ${
                            active
                              ? "text-primary"
                              : "text-muted"
                          }
                        `}
                      >
                        {item.label}
                      </span>
                    </div>

                    {index < steps.length - 1 && (
                      <div className="mb-5 h-[2px] flex-1 overflow-hidden rounded-full bg-border">
                        <div
                          className={`h-full rounded-full bg-primary transition-all duration-1000 ease-[cubic-bezier(.16,1,.3,1)] ${
                            index < currentStepIndex
                              ? "w-full"
                              : "w-0"
                          }`}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </Reveal>

        <div className="grid items-start gap-6 lg:grid-cols-[1fr_320px]">
          <div>
            {step === "seats" && (
              <Reveal key="seats" delay={220}>
                <div className="rounded-[28px] border border-border bg-surface p-4 shadow-custom transition-all duration-700 hover:shadow-custom-md sm:p-6">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-base font-black text-text sm:text-lg">
                        اختار مقاعدك
                      </h2>

                      <p className="mt-1 text-[10px] font-medium text-muted sm:text-xs">
                        مطلوب اختيار {people}{" "}
                        {people === 1 ? "مقعد" : "مقاعد"}
                      </p>
                    </div>

                    <div className="rounded-full bg-soft-teal px-3 py-2 text-[10px] font-black text-primary">
                      {selectedSeats.length} / {people}
                    </div>
                  </div>

                  <div className="mb-5 flex flex-wrap items-center justify-center gap-3">
                    <div className="flex items-center gap-2 text-[9px] font-bold text-muted">
                      <span className="h-3.5 w-3.5 rounded-[4px] border border-border bg-surface" />
                      متاح
                    </div>

                    <div className="flex items-center gap-2 text-[9px] font-bold text-muted">
                      <span className="h-3.5 w-3.5 rounded-[4px] bg-primary" />
                      مختار
                    </div>

                    <div className="flex items-center gap-2 text-[9px] font-bold text-muted">
                      <span className="h-3.5 w-3.5 rounded-[4px] bg-border" />
                      محجوز
                    </div>
                  </div>

                  <Reveal delay={300}>
                    <div className="mx-auto w-full max-w-[370px]">
                      <div className="mx-auto mb-4 w-[70%] max-w-[270px] rounded-t-[26px] border border-border bg-surface-alt px-3 py-2.5 text-center shadow-sm transition-all duration-700 hover:-translate-y-1 hover:bg-soft-teal/40">
                        <div className="mx-auto mb-1 grid h-7 w-7 place-items-center rounded-full bg-dark text-white shadow-sm transition-all duration-500 hover:scale-110 hover:rotate-3">
                          <span className="text-xs">🚌</span>
                        </div>

                        <span className="text-[9px] font-black text-text">
                          مقدمة الحافلة
                        </span>
                      </div>

                      <div className="rounded-[22px] border border-border bg-surface-alt p-3.5 shadow-sm transition-all duration-700 hover:shadow-md sm:p-4">
                        <div className="space-y-2.5">
                          {seatRows.map((row, index) => (
                            <SeatRow
                              key={index}
                              seats={row}
                              selectedSeats={selectedSeats}
                              occupiedSeats={occupiedSeats}
                              onToggle={toggleSeat}
                              rowIndex={index}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </Reveal>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-[16px] bg-surface-alt p-3 text-center transition-all duration-500 hover:-translate-y-1 hover:bg-soft-teal/40">
                      <span className="block text-[9px] font-bold text-muted">
                        إجمالي المقاعد
                      </span>

                      <strong className="mt-1 block text-sm font-black text-text">
                        {totalSeats}
                      </strong>
                    </div>

                    <div className="rounded-[16px] bg-surface-alt p-3 text-center transition-all duration-500 hover:-translate-y-1 hover:bg-soft-teal/40">
                      <span className="block text-[9px] font-bold text-muted">
                        المقاعد المتاحة
                      </span>

                      <strong className="mt-1 block text-sm font-black text-primary">
                        {availableSeats}
                      </strong>
                    </div>

                    <div className="rounded-[16px] bg-surface-alt p-3 text-center transition-all duration-500 hover:-translate-y-1 hover:bg-soft-teal/40">
                      <span className="block text-[9px] font-bold text-muted">
                        السعر للمقعد
                      </span>

                      <strong className="mt-1 block text-sm font-black text-text">
                        {formatPrice(price)}
                      </strong>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      type="button"
                      disabled={selectedSeats.length !== people}
                      onClick={handleContinueFromSeats}
                      className="group flex h-12 w-full items-center justify-center gap-2 rounded-[14px] bg-primary text-xs font-black text-white shadow-[0_10px_30px_rgba(10,169,155,0.16)] transition-all duration-500 hover:-translate-y-1 hover:bg-primary-deep hover:shadow-[0_16px_35px_rgba(10,169,155,0.24)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                    >
                      متابعة بيانات المسافرين
                      <FiArrowRight className="transition-transform duration-500 group-hover:-translate-x-1" />
                    </button>
                  </div>
                </div>
              </Reveal>
            )}

            {step === "passengers" && (
              <Reveal key="passengers" delay={150}>
                <div className="rounded-[28px] border border-border bg-surface p-5 shadow-custom sm:p-7">
                  <div className="mb-6">
                    <h2 className="text-lg font-black text-text">
                      بيانات المسافرين
                    </h2>

                    <p className="mt-1 text-xs font-medium leading-6 text-muted">
                      أدخل بيانات كل شخص حسب المقعد الذي اخترته.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {passengers.map((passenger, index) => (
                      <div
                        key={index}
                        className="rounded-[20px] border border-border bg-surface-alt p-4 transition-all duration-600 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
                        style={{
                          animationDelay: `${index * 100}ms`,
                        }}
                      >
                        <div className="mb-4 flex items-center gap-3">
                          <div className="grid h-9 w-9 place-items-center rounded-full bg-soft-teal text-primary">
                            <FiUser className="text-sm" />
                          </div>

                          <div>
                            <h3 className="text-xs font-black text-text">
                              المسافر {index + 1}
                            </h3>

                            <p className="text-[9px] font-medium text-muted">
                              المقعد رقم {selectedSeats[index]}
                            </p>
                          </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="block">
                            <span className="mb-2 block text-[10px] font-extrabold text-muted">
                              الاسم الكامل
                            </span>

                            <input
                              type="text"
                              value={passenger.name}
                              onChange={(e) =>
                                updatePassenger(
                                  index,
                                  "name",
                                  e.target.value
                                )
                              }
                              placeholder="اكتب الاسم الكامل"
                              className="h-11 w-full rounded-[12px] border border-border bg-surface px-3 text-xs font-bold text-text outline-none transition-all duration-300 placeholder:text-muted/60 focus:border-primary focus:ring-4 focus:ring-primary/10"
                            />
                          </label>

                          <label className="block">
                            <span className="mb-2 block text-[10px] font-extrabold text-muted">
                              رقم الهاتف
                            </span>

                            <input
                              type="tel"
                              value={passenger.phone}
                              onChange={(e) =>
                                updatePassenger(
                                  index,
                                  "phone",
                                  e.target.value
                                )
                              }
                              placeholder="09xxxxxxxx"
                              className="h-11 w-full rounded-[12px] border border-border bg-surface px-3 text-xs font-bold text-text outline-none transition-all duration-300 placeholder:text-muted/60 focus:border-primary focus:ring-4 focus:ring-primary/10"
                            />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>

                  {bookingError && (
                    <div className="mt-4 rounded-[14px] bg-red-50 px-4 py-3 text-center text-[10px] font-bold text-red-600">
                      {bookingError}
                    </div>
                  )}

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => {
                        setBookingError("")
                        setStep("seats")
                      }}
                      className="h-12 flex-1 rounded-[14px] border border-border bg-surface text-xs font-black text-text transition-all duration-500 hover:-translate-y-1 hover:border-primary hover:text-primary"
                    >
                      العودة للمقاعد
                    </button>

                    <button
                      type="button"
                      onClick={handleContinueFromPassengers}
                      className="group flex h-12 flex-1 items-center justify-center gap-2 rounded-[14px] bg-primary text-xs font-black text-white shadow-[0_10px_30px_rgba(10,169,155,0.16)] transition-all duration-500 hover:-translate-y-1 hover:bg-primary-deep hover:shadow-[0_16px_35px_rgba(10,169,155,0.24)]"
                    >
                      مراجعة الحجز
                      <FiArrowRight className="transition-transform duration-500 group-hover:-translate-x-1" />
                    </button>
                  </div>
                </div>
              </Reveal>
            )}

            {step === "review" && (
              <Reveal key="review" delay={150}>
                <div className="space-y-5">
                  <div className="rounded-[28px] border border-border bg-surface p-5 shadow-custom sm:p-7">
                    <div className="mb-6">
                      <h2 className="text-lg font-black text-text">
                        مراجعة الحجز
                      </h2>

                      <p className="mt-1 text-xs font-medium leading-6 text-muted">
                        تأكد من المعلومات قبل تأكيد الحجز.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {passengers.map((passenger, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between gap-4 rounded-[16px] bg-surface-alt p-4 transition-all duration-500 hover:-translate-y-1 hover:bg-soft-teal/40"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-soft-teal text-primary">
                              <FiUser />
                            </div>

                            <div className="min-w-0">
                              <strong className="block truncate text-xs font-black text-text">
                                {passenger.name}
                              </strong>

                              <span className="mt-1 block text-[9px] font-medium text-muted">
                                {passenger.phone}
                              </span>
                            </div>
                          </div>

                          <div className="shrink-0 rounded-full bg-primary/10 px-3 py-1.5 text-[9px] font-black text-primary">
                            مقعد {selectedSeats[index]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-border bg-surface p-5 shadow-custom sm:p-7">
                    <div className="mb-5 flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-soft-teal text-primary">
                        <FiCreditCard />
                      </div>

                      <div>
                        <h3 className="text-sm font-black text-text">
                          طريقة الدفع
                        </h3>

                        <p className="text-[9px] font-medium text-muted">
                          اختر طريقة الدفع المناسبة
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("office")}
                        className={`rounded-[16px] border p-4 text-right transition-all duration-500 ${
                          paymentMethod === "office"
                            ? "border-primary bg-soft-teal/50 shadow-sm"
                            : "border-border bg-surface-alt hover:-translate-y-1 hover:border-primary/40"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <strong className="block text-xs font-black text-text">
                              الدفع في المكتب
                            </strong>

                            <span className="mt-1 block text-[9px] font-medium text-muted">
                              الدفع عند الحضور إلى مكتب الشركة
                            </span>
                          </div>

                          <span
                            className={`grid h-5 w-5 place-items-center rounded-full border ${
                              paymentMethod === "office"
                                ? "border-primary bg-primary text-white"
                                : "border-border"
                            }`}
                          >
                            {paymentMethod === "office" && (
                              <FiCheck className="text-[11px]" />
                            )}
                          </span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("demo")}
                        className={`rounded-[16px] border p-4 text-right transition-all duration-500 ${
                          paymentMethod === "demo"
                            ? "border-primary bg-soft-teal/50 shadow-sm"
                            : "border-border bg-surface-alt hover:-translate-y-1 hover:border-primary/40"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <strong className="block text-xs font-black text-text">
                              الدفع الإلكتروني
                            </strong>

                            <span className="mt-1 block text-[9px] font-medium text-muted">
                              خيار تجريبي حالياً
                            </span>
                          </div>

                          <span
                            className={`grid h-5 w-5 place-items-center rounded-full border ${
                              paymentMethod === "demo"
                                ? "border-primary bg-primary text-white"
                                : "border-border"
                            }`}
                          >
                            {paymentMethod === "demo" && (
                              <FiCheck className="text-[11px]" />
                            )}
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {bookingError && (
                    <div className="rounded-[16px] bg-red-50 px-4 py-3 text-center text-[10px] font-bold text-red-600">
                      {bookingError}
                    </div>
                  )}

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => {
                        setBookingError("")
                        setStep("passengers")
                      }}
                      className="h-12 flex-1 rounded-[14px] border border-border bg-surface text-xs font-black text-text transition-all duration-500 hover:-translate-y-1 hover:border-primary hover:text-primary"
                    >
                      العودة للبيانات
                    </button>

                    <button
                      type="button"
                      disabled={isBooking}
                      onClick={handleBooking}
                      className="group flex h-12 flex-1 items-center justify-center gap-2 rounded-[14px] bg-primary text-xs font-black text-white shadow-[0_10px_30px_rgba(10,169,155,0.16)] transition-all duration-500 hover:-translate-y-1 hover:bg-primary-deep hover:shadow-[0_16px_35px_rgba(10,169,155,0.24)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isBooking ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          جاري تأكيد الحجز...
                        </>
                      ) : (
                        <>
                          <FiCheck className="transition-transform duration-500 group-hover:scale-125" />
                          تأكيد الحجز
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </Reveal>
            )}
          </div>

          <Reveal delay={300}>
            <aside className="lg:sticky lg:top-6">
              <div className="overflow-hidden rounded-[28px] border border-border bg-surface shadow-custom transition-all duration-700 hover:shadow-custom-md">
                <div className="bg-dark px-5 py-5 text-white">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[9px] font-bold text-white/60">
                        ملخص الرحلة
                      </span>

                      <h3 className="mt-1 text-sm font-black">
                        {trip.origin?.name || "مدينة الانطلاق"}
                        <span className="mx-2 text-primary">←</span>
                        {trip.destination?.name || "الوجهة"}
                      </h3>
                    </div>

                    <div className="grid h-10 w-10 place-items-center rounded-full bg-white/10">
                      <FiUsers className="text-primary" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-5">
                  <div className="rounded-[18px] bg-surface-alt p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <span className="block text-[9px] font-bold text-muted">
                          المغادرة
                        </span>

                        <strong className="mt-1 block text-base font-black text-text">
                          {formatTime(trip.departureAt)}
                        </strong>
                      </div>

                      <FiClock className="text-primary" />

                      <div className="text-left">
                        <span className="block text-[9px] font-bold text-muted">
                          الوصول
                        </span>

                        <strong className="mt-1 block text-base font-black text-text">
                          {formatTime(trip.arrivalAt)}
                        </strong>
                      </div>
                    </div>

                    <div className="border-t border-border pt-3 text-center text-[9px] font-bold text-muted">
                      {formatDate(trip.departureAt)}
                      {getDuration() && (
                        <span className="mx-1 text-primary">
                          • {getDuration()}
                        </span>
                      )}
                    </div>
                  </div>

                  {trip.company?.name && (
                    <div className="flex items-center justify-between gap-3 rounded-[16px] border border-border p-3 transition-all duration-500 hover:border-primary/30 hover:bg-soft-teal/20">
                      <div>
                        <span className="block text-[9px] font-bold text-muted">
                          شركة النقل
                        </span>

                        <strong className="mt-1 block text-xs font-black text-text">
                          {trip.company.name}
                        </strong>
                      </div>

                      {trip.company.logoUrl ? (
                        <img
                          src={trip.company.logoUrl}
                          alt={trip.company.name}
                          className="h-9 w-9 rounded-full object-cover"
                        />
                      ) : (
                        <div className="grid h-9 w-9 place-items-center rounded-full bg-soft-teal text-primary">
                          🚌
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-3 border-t border-border pt-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-muted">
                        عدد المسافرين
                      </span>

                      <strong className="font-black text-text">
                        {people}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-muted">
                        المقاعد
                      </span>

                      <strong className="font-black text-text">
                        {selectedSeats.length
                          ? selectedSeats.join("، ")
                          : "لم يتم الاختيار"}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-muted">
                        سعر المقعد
                      </span>

                      <strong className="font-black text-text">
                        {formatPrice(price)}
                      </strong>
                    </div>
                  </div>

                  <div className="rounded-[18px] bg-soft-teal p-4">
                    <div className="flex items-end justify-between gap-3">
                      <span className="text-[10px] font-black text-muted">
                        المجموع
                      </span>

                      <div className="text-left">
                        <strong className="block text-xl font-black text-primary">
                          {formatPrice(totalPrice)}
                        </strong>

                        <span className="text-[8px] font-bold text-muted">
                          ليرة سورية
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 rounded-[14px] bg-surface-alt p-3">
                    <FiShield className="mt-0.5 shrink-0 text-primary" />

                    <p className="text-[9px] font-bold leading-5 text-muted">
                      بيانات حجزك محمية، ولن يتم إرسال بيانات الدفع ضمن طلب
                      الحجز الحالي.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </Reveal>
        </div>
      </div>
    </main>
  )
}

export default BookingPage
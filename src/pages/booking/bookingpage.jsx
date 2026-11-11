import { useMemo, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import {
  FiArrowRight,
  FiCheck,
  FiClock,
  FiCreditCard,
  FiMapPin,
  FiShield,
  FiUser,
  FiUsers,
} from "react-icons/fi"

import Button from "../../components/button/button"
import { useGetTrip, useGetTripSeats } from "../../hooks/use-trips"
import sairnaApi from "../../api/axios"

function BookingPage() {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const peopleFromUrl = Number(searchParams.get("people")) || 1
  const people = Math.min(Math.max(peopleFromUrl, 1), 4)

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

  const { data: trip, isLoading: tripLoading, isError: tripError } =
    useGetTrip(tripId)

  const {
    data: seatsData,
    isLoading: seatsLoading,
    isError: seatsError,
  } = useGetTripSeats(tripId)

  const totalSeats = seatsData?.totalSeats || trip?.totalSeats || 40

  const occupiedSeats = useMemo(() => {
    return seatsData?.occupiedSeats || []
  }, [seatsData])

  const availableSeats =
    seatsData?.availableSeats ??
    trip?.availableSeats ??
    totalSeats - occupiedSeats.length

  const price = Number(trip?.price || 0)
  const totalPrice = price * selectedSeats.length

  const formatPrice = (value) => {
    return new Intl.NumberFormat("ar-SY").format(value)
  }

  const formatTime = (date) => {
    if (!date) return "--:--"

    return new Date(date).toLocaleTimeString("ar-SY", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (date) => {
    if (!date) return ""

    return new Date(date).toLocaleDateString("ar-SY", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })
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

      return [...current, seatNumber]
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
    for (const passenger of passengers) {
      if (!passenger.name.trim()) {
        return "يرجى إدخال اسم جميع المسافرين"
      }

      if (!passenger.phone.trim()) {
        return "يرجى إدخال رقم هاتف جميع المسافرين"
      }
    }

    return ""
  }

  const goToPassengers = () => {
    setBookingError("")

    if (selectedSeats.length !== people) {
      setBookingError(`يرجى اختيار ${people} ${people === 1 ? "مقعد" : "مقاعد"}`)
      return
    }

    setStep("passengers")
  }

  const goToReview = () => {
    setBookingError("")

    const error = validatePassengers()

    if (error) {
      setBookingError(error)
      return
    }

    setStep("review")
  }

  const goBack = () => {
    setBookingError("")

    if (step === "passengers") {
      setStep("seats")
      return
    }

    if (step === "review") {
      setStep("passengers")
    }
  }

  const handleBooking = async () => {
    setBookingError("")

    if (!tripId) {
      setBookingError("لم يتم العثور على الرحلة")
      return
    }

    if (selectedSeats.length !== people) {
      setBookingError("يرجى التأكد من اختيار المقاعد المطلوبة")
      return
    }

    const passengerError = validatePassengers()

    if (passengerError) {
      setBookingError(passengerError)
      setStep("passengers")
      return
    }

    try {
      setIsBooking(true)

      const payload = {
        tripId: Number(tripId),
        seats: selectedSeats.map((seatNumber, index) => ({
          seatNumber,
          passengerName: passengers[index].name.trim(),
          passengerPhone: passengers[index].phone.trim(),
        })),
      }

      const response = await sairnaApi.post("/bookings", payload)

      navigate("/success", {
        state: {
          booking: response.data,
          trip,
          selectedSeats,
          passengers,
          paymentMethod,
          totalPrice,
        },
      })
    } catch (error) {
      console.error("Booking error:", error)

      const message =
        error?.response?.data?.message ||
        "حدث خطأ أثناء تأكيد الحجز، يرجى المحاولة مرة أخرى."

      setBookingError(message)
    } finally {
      setIsBooking(false)
    }
  }

  if (tripLoading || seatsLoading) {
    return (
      <main
        dir="rtl"
        className="min-h-[70vh] bg-bg px-4 py-16"
      >
        <div className="mx-auto max-w-[1216px]">
          <div className="animate-pulse">
            <div className="mb-6 h-8 w-48 rounded-lg bg-surface-alt" />
            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
              <div className="h-[500px] rounded-[22px] bg-surface" />
              <div className="h-[400px] rounded-[22px] bg-surface" />
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (tripError || seatsError || !trip) {
    return (
      <main
        dir="rtl"
        className="min-h-[70vh] bg-bg px-4 py-16"
      >
        <div className="mx-auto max-w-[700px] rounded-[22px] border border-border bg-surface p-8 text-center shadow-custom">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-red-50 text-red-500">
            <FiShield size={28} />
          </div>

          <h1 className="mb-3 text-xl font-black text-text">
            تعذر تحميل الرحلة
          </h1>

          <p className="mb-6 text-sm leading-7 text-muted">
            حدثت مشكلة أثناء تحميل بيانات الرحلة. يرجى المحاولة مرة أخرى.
          </p>

          <Button onClick={() => window.location.reload()}>
            إعادة المحاولة
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-bg px-4 py-10 md:px-6 lg:py-14"
    >
      <div className="mx-auto max-w-[1216px]">

        <div className="mb-8 flex items-center gap-2 text-xs font-bold text-muted">
          <button
            onClick={() => navigate("/results")}
            className="transition-colors hover:text-primary"
          >
            نتائج البحث
          </button>

          <span>/</span>

          <span className="text-text">
            إتمام الحجز
          </span>
        </div>

        <section className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-soft-teal px-4 py-2 text-xs font-black text-primary">
            <FiCheck size={14} />
            حجز رحلتك
          </div>

          <h1 className="mb-3 text-3xl font-black leading-tight text-text md:text-4xl">
            خلينا نجهّز رحلتك
          </h1>

          <p className="max-w-[650px] text-sm leading-7 text-muted md:text-base">
            اختاري مقاعدك، أدخلي بيانات المسافرين، وبعدها راجعي
            تفاصيل الحجز قبل التأكيد.
          </p>
        </section>

        <div className="mb-8 grid grid-cols-3 gap-2 md:gap-4">
          <BookingStep
            number="01"
            title="اختيار المقاعد"
            active={step === "seats"}
            completed={
              step === "passengers" || step === "review"
            }
          />

          <BookingStep
            number="02"
            title="بيانات المسافرين"
            active={step === "passengers"}
            completed={step === "review"}
          />

          <BookingStep
            number="03"
            title="المراجعة والتأكيد"
            active={step === "review"}
          />
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[1fr_360px]">

          <section className="min-w-0">

            {step === "seats" && (
              <div className="rounded-[22px] border border-border bg-surface p-5 shadow-custom md:p-7">

                <div className="mb-7">
                  <h2 className="mb-2 text-xl font-black text-text">
                    اختاري المقاعد
                  </h2>

                  <p className="text-xs leading-6 text-muted">
                    اختاري {people}{" "}
                    {people === 1 ? "مقعد" : "مقاعد"} للمسافرين.
                  </p>
                </div>

                <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <SeatInfo
                    icon={<FiUsers />}
                    label="المطلوب"
                    value={`${people} مقعد`}
                  />

                  <SeatInfo
                    icon={<FiCheck />}
                    label="المتاح"
                    value={`${availableSeats} مقعد`}
                  />

                  <SeatInfo
                    icon={<FiCreditCard />}
                    label="سعر المقعد"
                    value={`${formatPrice(price)} ل.س`}
                  />
                </div>

                <div className="mb-7 flex flex-wrap gap-5 text-[11px] font-bold text-muted">
                  <LegendItem type="available" text="متاح" />
                  <LegendItem type="selected" text="مختار" />
                  <LegendItem type="occupied" text="محجوز" />
                </div>

                <div className="mx-auto max-w-[450px]">

                  <div className="mb-5 rounded-t-[45px] border border-border bg-surface-alt px-6 py-5 text-center">
                    <div className="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-full bg-dark text-white">
                      <span className="text-lg">🚌</span>
                    </div>

                    <span className="text-xs font-black text-text">
                      مقدمة الحافلة
                    </span>
                  </div>

                  <div className="rounded-[25px] border border-border bg-surface-alt p-4 sm:p-6">

                    <div className="mb-5 flex items-center justify-between border-b border-border pb-4">
                      <span className="text-[10px] font-bold text-muted">
                        النافذة
                      </span>

                      <span className="text-[10px] font-bold text-muted">
                        الممر
                      </span>

                      <span className="text-[10px] font-bold text-muted">
                        النافذة
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 sm:gap-3">

                      {Array.from(
                        { length: totalSeats },
                        (_, index) => {
                          const seatNumber = index + 1
                          const occupied =
                            occupiedSeats.includes(seatNumber)
                          const selected =
                            selectedSeats.includes(seatNumber)

                          return (
                            <button
                              key={seatNumber}
                              type="button"
                              disabled={occupied}
                              onClick={() =>
                                toggleSeat(seatNumber)
                              }
                              className={`
                                relative grid aspect-square min-h-12 place-items-center
                                rounded-xl border text-xs font-black
                                transition-all duration-200
                                ${
                                  occupied
                                    ? "cursor-not-allowed border-border bg-border/60 text-muted"
                                    : selected
                                      ? "border-primary bg-primary text-white shadow-lg shadow-primary/20 -translate-y-0.5"
                                      : "border-border bg-surface text-text hover:-translate-y-0.5 hover:border-primary hover:text-primary"
                                }
                              `}
                            >
                              {seatNumber}

                              {selected && (
                                <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-white text-primary shadow">
                                  <FiCheck size={10} />
                                </span>
                              )}
                            </button>
                          )
                        }
                      )}

                    </div>
                  </div>
                </div>

                {bookingError && (
                  <ErrorMessage message={bookingError} />
                )}

                <div className="mt-8 flex justify-end">
                  <Button
                    onClick={goToPassengers}
                    className="w-full sm:w-auto"
                  >
                    متابعة
                    <FiArrowRight className="rotate-180" />
                  </Button>
                </div>
              </div>
            )}

            {step === "passengers" && (
              <div className="rounded-[22px] border border-border bg-surface p-5 shadow-custom md:p-7">

                <div className="mb-7">
                  <h2 className="mb-2 text-xl font-black text-text">
                    بيانات المسافرين
                  </h2>

                  <p className="text-xs leading-6 text-muted">
                    أدخلي بيانات كل مسافر حسب المقعد المختار.
                  </p>
                </div>

                <div className="space-y-5">
                  {passengers.map((passenger, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-border bg-surface-alt p-5"
                    >
                      <div className="mb-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="grid h-10 w-10 place-items-center rounded-xl bg-soft-teal text-primary">
                            <FiUser size={18} />
                          </span>

                          <div>
                            <h3 className="text-sm font-black text-text">
                              المسافر {index + 1}
                            </h3>

                            <p className="mt-1 text-[10px] font-bold text-muted">
                              المقعد {selectedSeats[index]}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">

                        <div>
                          <label className="mb-2 block text-xs font-black text-text">
                            الاسم الكامل
                          </label>

                          <input
                            type="text"
                            value={passenger.name}
                            onChange={(event) =>
                              updatePassenger(
                                index,
                                "name",
                                event.target.value
                              )
                            }
                            placeholder="مثال: أحمد علي"
                            className="h-12 w-full rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-text outline-none transition focus:border-primary"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-xs font-black text-text">
                            رقم الهاتف
                          </label>

                          <input
                            type="tel"
                            dir="ltr"
                            value={passenger.phone}
                            onChange={(event) =>
                              updatePassenger(
                                index,
                                "phone",
                                event.target.value
                              )
                            }
                            placeholder="0912345678"
                            className="h-12 w-full rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-text outline-none transition focus:border-primary"
                          />
                        </div>

                      </div>
                    </div>
                  ))}
                </div>

                {bookingError && (
                  <ErrorMessage message={bookingError} />
                )}

                <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                  <Button
                    variant="outline"
                    onClick={goBack}
                  >
                    رجوع
                  </Button>

                  <Button
                    onClick={goToReview}
                  >
                    مراجعة الحجز
                    <FiArrowRight className="rotate-180" />
                  </Button>
                </div>
              </div>
            )}

            {step === "review" && (
              <div className="space-y-5">

                <div className="rounded-[22px] border border-border bg-surface p-5 shadow-custom md:p-7">

                  <div className="mb-6">
                    <h2 className="mb-2 text-xl font-black text-text">
                      كل شي جاهز؟
                    </h2>

                    <p className="text-xs leading-6 text-muted">
                      راجعي معلومات الرحلة والمسافرين قبل ما تثبتي الحجز.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {passengers.map((passenger, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 rounded-xl border border-border bg-surface-alt p-4"
                      >
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-soft-teal text-primary">
                          <FiUser size={17} />
                        </span>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-black text-text">
                            {passenger.name}
                          </p>

                          <p
                            dir="ltr"
                            className="mt-1 text-left text-xs font-bold text-muted"
                          >
                            {passenger.phone}
                          </p>
                        </div>

                        <span className="shrink-0 rounded-lg bg-primary/10 px-3 py-2 text-[10px] font-black text-primary">
                          المقعد {selectedSeats[index]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[22px] border border-border bg-surface p-5 shadow-custom md:p-7">

                  <div className="mb-6">
                    <h2 className="mb-2 text-lg font-black text-text">
                      طريقة تأكيد الحجز
                    </h2>

                    <p className="text-xs leading-6 text-muted">
                      اختاري الطريقة المناسبة لتأكيد حجزك.
                    </p>
                  </div>

                  <div className="space-y-3">

                    <label
                      className={`
                        flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition-all
                        ${
                          paymentMethod === "office"
                            ? "border-primary bg-soft-teal"
                            : "border-border bg-surface hover:border-primary"
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="office"
                        checked={paymentMethod === "office"}
                        onChange={(event) =>
                          setPaymentMethod(event.target.value)
                        }
                        className="sr-only"
                      />

                      <span
                        className={`
                          grid h-12 w-12 shrink-0 place-items-center rounded-xl
                          ${
                            paymentMethod === "office"
                              ? "bg-primary text-white"
                              : "bg-surface-alt text-primary"
                          }
                        `}
                      >
                        <FiCreditCard size={22} />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-black text-text">
                          الدفع في مكتب الشركة
                        </span>

                        <span className="mt-1 block text-[11px] leading-5 text-muted">
                          ادفعي عند الحضور لمكتب الشركة قبل الرحلة.
                        </span>
                      </span>

                      <span
                        className={`
                          grid h-5 w-5 shrink-0 place-items-center rounded-full border-2
                          ${
                            paymentMethod === "office"
                              ? "border-primary"
                              : "border-border"
                          }
                        `}
                      >
                        {paymentMethod === "office" && (
                          <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                        )}
                      </span>
                    </label>

                    <label
                      className={`
                        flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition-all
                        ${
                          paymentMethod === "demo"
                            ? "border-primary bg-soft-teal"
                            : "border-border bg-surface hover:border-primary"
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="demo"
                        checked={paymentMethod === "demo"}
                        onChange={(event) =>
                          setPaymentMethod(event.target.value)
                        }
                        className="sr-only"
                      />

                      <span
                        className={`
                          grid h-12 w-12 shrink-0 place-items-center rounded-xl
                          ${
                            paymentMethod === "demo"
                              ? "bg-primary text-white"
                              : "bg-surface-alt text-primary"
                          }
                        `}
                      >
                        <FiCreditCard size={22} />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-black text-text">
                          دفع إلكتروني
                        </span>

                        <span className="mt-1 block text-[11px] leading-5 text-muted">
                          محاكاة لواجهة الدفع فقط؛ لن يتم تحصيل أي مبلغ.
                        </span>
                      </span>

                      <span
                        className={`
                          grid h-5 w-5 shrink-0 place-items-center rounded-full border-2
                          ${
                            paymentMethod === "demo"
                              ? "border-primary"
                              : "border-border"
                          }
                        `}
                      >
                        {paymentMethod === "demo" && (
                          <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                        )}
                      </span>
                    </label>

                  </div>

                  <div className="mt-5 flex gap-3 rounded-xl bg-soft-teal p-4">
                    <FiShield className="mt-0.5 shrink-0 text-primary" />

                    <p className="text-[11px] font-bold leading-6 text-text">
                      طريقة الدفع محفوظة في الواجهة فقط حالياً، ولن يتم
                      إرسال أي بيانات دفع إلى الخادم لأن API الحالي للحجز
                      لا يحتوي على حقل لطريقة الدفع.
                    </p>
                  </div>
                </div>

                {bookingError && (
                  <ErrorMessage message={bookingError} />
                )}

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                  <Button
                    variant="outline"
                    onClick={goBack}
                    disabled={isBooking}
                  >
                    رجوع
                  </Button>

                  <Button
                    onClick={handleBooking}
                    disabled={isBooking}
                    className="min-w-[190px]"
                  >
                    {isBooking ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        جاري تأكيد الحجز...
                      </>
                    ) : (
                      <>
                        <FiCheck />
                        تأكيد الحجز
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </section>

          <aside className="lg:sticky lg:top-24">

            <div className="overflow-hidden rounded-[22px] border border-border bg-surface shadow-custom">

              <div className="bg-dark p-5 text-white md:p-6">
                <p className="mb-2 text-[11px] font-bold text-white/60">
                  ملخص الرحلة
                </p>

                <h2 className="text-lg font-black">
                  {trip.origin?.name || "—"}
                  <span className="mx-2 text-primary">←</span>
                  {trip.destination?.name || "—"}
                </h2>

                <p className="mt-2 text-[11px] font-bold text-white/60">
                  {formatDate(trip.departureAt)}
                </p>
              </div>

              <div className="space-y-5 p-5 md:p-6">

                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-soft-teal text-primary">
                    {trip.company?.logoUrl ? (
                      <img
                        src={trip.company.logoUrl}
                        alt={trip.company.name}
                        className="h-8 w-8 object-contain"
                      />
                    ) : (
                      <span className="text-lg">🚌</span>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-black text-text">
                      {trip.company?.name || "شركة النقل"}
                    </p>

                    <p className="mt-1 text-[10px] font-bold text-muted">
                      شركة النقل
                    </p>
                  </div>
                </div>

                <div className="h-px bg-border" />

                <div className="grid grid-cols-2 gap-4">

                  <div>
                    <div className="mb-2 flex items-center gap-2 text-muted">
                      <FiClock size={13} />
                      <span className="text-[10px] font-bold">
                        المغادرة
                      </span>
                    </div>

                    <p className="text-lg font-black text-text">
                      {formatTime(trip.departureAt)}
                    </p>

                    <p className="mt-1 text-xs font-bold text-muted">
                      {trip.origin?.name}
                    </p>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center gap-2 text-muted">
                      <FiClock size={13} />
                      <span className="text-[10px] font-bold">
                        الوصول
                      </span>
                    </div>

                    <p className="text-lg font-black text-text">
                      {formatTime(trip.arrivalAt)}
                    </p>

                    <p className="mt-1 text-xs font-bold text-muted">
                      {trip.destination?.name}
                    </p>
                  </div>

                </div>

                <div className="h-px bg-border" />

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted">
                    المقاعد
                  </span>

                  <span className="text-xs font-black text-text">
                    {selectedSeats.length
                      ? selectedSeats.sort((a, b) => a - b).join("، ")
                      : "لم يتم الاختيار"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted">
                    عدد المسافرين
                  </span>

                  <span className="text-xs font-black text-text">
                    {people}
                  </span>
                </div>

                <div className="h-px bg-border" />

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs font-bold text-muted">
                      الإجمالي
                    </p>

                    <p className="mt-1 text-[10px] font-bold text-muted">
                      {formatPrice(price)} × {selectedSeats.length}
                    </p>
                  </div>

                  <p className="text-xl font-black text-primary">
                    {formatPrice(totalPrice)}{" "}
                    <span className="text-xs">ل.س</span>
                  </p>
                </div>

              </div>
            </div>

            <div className="mt-4 flex gap-3 rounded-2xl border border-border bg-surface p-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-soft-teal text-primary">
                <FiShield size={16} />
              </span>

              <p className="text-[10px] font-bold leading-5 text-muted">
                بياناتك تستخدم فقط لإتمام حجز الرحلة وتسجيل معلومات
                المسافرين.
              </p>
            </div>

          </aside>
        </div>
      </div>
    </main>
  )
}

function BookingStep({
  number,
  title,
  active,
  completed,
}) {
  return (
    <div
      className={`
        flex items-center gap-2 rounded-2xl border p-3 md:gap-3 md:p-4
        ${
          active
            ? "border-primary bg-soft-teal"
            : completed
              ? "border-primary/30 bg-surface"
              : "border-border bg-surface"
        }
      `}
    >
      <span
        className={`
          grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[10px] font-black
          ${
            active || completed
              ? "bg-primary text-white"
              : "bg-surface-alt text-muted"
          }
        `}
      >
        {completed ? <FiCheck size={14} /> : number}
      </span>

      <span className="hidden min-[420px]:block">
        <span
          className={`
            block text-[9px] font-bold
            ${
              active || completed
                ? "text-primary"
                : "text-muted"
            }
          `}
        >
          المرحلة
        </span>

        <span className="block text-[11px] font-black text-text md:text-xs">
          {title}
        </span>
      </span>
    </div>
  )
}

function SeatInfo({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-border bg-surface-alt p-3">
      <div className="mb-2 flex items-center gap-2 text-primary">
        {icon}
        <span className="text-[10px] font-bold text-muted">
          {label}
        </span>
      </div>

      <p className="text-sm font-black text-text">
        {value}
      </p>
    </div>
  )
}

function LegendItem({ type, text }) {
  const classes = {
    available: "border-border bg-surface",
    selected: "border-primary bg-primary",
    occupied: "border-border bg-border/60",
  }

  return (
    <span className="flex items-center gap-2">
      <span
        className={`h-4 w-4 rounded-md border ${classes[type]}`}
      />

      {text}
    </span>
  )
}

function ErrorMessage({ message }) {
  return (
    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-bold leading-6 text-red-600">
      {message}
    </div>
  )
}

export default BookingPage
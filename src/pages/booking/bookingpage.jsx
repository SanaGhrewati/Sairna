import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiClock,
  FiMapPin,
  FiShield,
  FiUser,
  FiUsers,
  FiTruck,
  FiCreditCard,
} from "react-icons/fi"
import { BsStars } from "react-icons/bs"

import { useGetTrip, useGetTripSeats } from "../../hooks/use-trips"


function BookingPage() {
  const { tripId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const peopleFromUrl = Number(searchParams.get("people")) || 1

  const { data: tripData, isLoading: tripLoading, isError: tripError } =
    useGetTrip(tripId)

  const {
    data: seatsData,
    isLoading: seatsLoading,
    isError: seatsError,
  } = useGetTripSeats(tripId)

  const [step, setStep] = useState("seats")

  const [selectedSeats, setSelectedSeats] = useState([])

  const [passengers, setPassengers] = useState(
    Array.from({ length: peopleFromUrl }, () => ({
      name: "",
      phone: "",
    }))
  )

  const trip = tripData

  const occupiedSeats = useMemo(() => {
    return Array.isArray(seatsData?.occupiedSeats)
      ? seatsData.occupiedSeats.map(Number)
      : []
  }, [seatsData])

  const totalSeats =
    Number(seatsData?.totalSeats) ||
    Number(trip?.totalSeats) ||
    40

  const availableSeats =
    Number(seatsData?.availableSeats) ||
    Math.max(totalSeats - occupiedSeats.length, 0)

  const price = Number(trip?.price) || 0

  const totalPrice = price * peopleFromUrl

  const formatMoney = (value) => {
    return new Intl.NumberFormat("ar-SY").format(value) + " ل.س"
  }

  const formatTime = (date) => {
    if (!date) return "--:--"

    return new Date(date).toLocaleTimeString("ar-SY", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  const formatDate = (date) => {
    if (!date) return "-"

    return new Date(date).toLocaleDateString("ar-SY", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  /*
   * ننشئ أرقام المقاعد اعتماداً على totalSeats القادم من الـ API.
   *
   * مثال:
   * totalSeats = 40
   *
   * تصبح المقاعد:
   * 1 → 40
   */
  const seats = useMemo(() => {
    return Array.from({ length: totalSeats }, (_, index) => index + 1)
  }, [totalSeats])

  /*
   * إذا تغير عدد المسافرين في الـ URL،
   * نعيد عدد نماذج المسافرين.
   */
  useEffect(() => {
    setPassengers(
      Array.from({ length: peopleFromUrl }, () => ({
        name: "",
        phone: "",
      }))
    )

    setSelectedSeats([])
    setStep("seats")
  }, [peopleFromUrl, tripId])

  const handleSeatClick = (seatNumber) => {
    if (occupiedSeats.includes(seatNumber)) {
      return
    }

    setSelectedSeats((currentSeats) => {
      if (currentSeats.includes(seatNumber)) {
        return currentSeats.filter((seat) => seat !== seatNumber)
      }

      if (currentSeats.length >= peopleFromUrl) {
        return currentSeats
      }

      return [...currentSeats, seatNumber].sort((a, b) => a - b)
    })
  }

  const handlePassengerChange = (index, field, value) => {
    setPassengers((currentPassengers) => {
      const updated = [...currentPassengers]

      updated[index] = {
        ...updated[index],
        [field]: value,
      }

      return updated
    })
  }

  const handleNext = () => {
    if (step === "seats") {
      if (selectedSeats.length !== peopleFromUrl) {
        alert(`اختاري ${peopleFromUrl} ${peopleFromUrl === 1 ? "مقعد" : "مقاعد"} قبل المتابعة.`)
        return
      }

      setStep("passengers")
      return
    }

    if (step === "passengers") {
      const invalidPassenger = passengers.some(
        (passenger) =>
          passenger.name.trim().length < 3 ||
          passenger.phone.trim().length < 9
      )

      if (invalidPassenger) {
        alert("تأكدي من إدخال اسم ورقم هاتف صحيح لكل مسافر.")
        return
      }

      setStep("review")
      return
    }

    /*
     * لا ننشئ حجزاً وهمياً هنا.
     *
     * عندما نصل إلى endpoint إنشاء الحجز الحقيقي
     * سنربط هذا الزر مباشرة بالـ API.
     */
    alert(
      "تم تجهيز بيانات الحجز. الخطوة التالية هي ربط زر التأكيد مع endpoint إنشاء الحجز في الـ Backend."
    )
  }

  const handleBack = () => {
    if (step === "passengers") {
      setStep("seats")
      return
    }

    if (step === "review") {
      setStep("passengers")
      return
    }

    navigate("/results")
  }

  if (tripLoading || seatsLoading) {
    return <BookingLoading />
  }

  if (tripError || seatsError || !trip) {
    return (
      <section className="min-h-[70vh] px-4 py-20">
        <div
          dir="rtl"
          className="mx-auto max-w-[700px] rounded-[22px] border border-border bg-surface p-8 text-center shadow-custom"
        >
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-soft-teal text-primary">
            <FiTruck size={28} />
          </div>

          <h2 className="mb-3 text-xl font-black text-text">
            تعذّر تحميل الرحلة
          </h2>

          <p className="mb-6 text-sm leading-8 text-muted">
            ما قدرنا نجيب تفاصيل الرحلة أو المقاعد حالياً. جرّبي الرجوع إلى
            نتائج البحث والمحاولة مرة ثانية.
          </p>

          <button
            type="button"
            onClick={() => navigate("/results")}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-extrabold text-white transition hover:bg-primary-deep"
          >
            <FiArrowRight />
            العودة للرحلات
          </button>
        </div>
      </section>
    )
  }

  return (
    <main dir="rtl" className="min-h-screen bg-bg">
      {/* =========================
          Booking Header
      ========================== */}

      <section className="booking-head px-4 pt-8">
        <div className="mx-auto max-w-[1216px]">
          {/* Breadcrumb */}

          <div className="mb-5 flex items-center gap-2 text-[11px] font-bold text-muted">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="transition hover:text-primary"
            >
              الرئيسية
            </button>

            <FiArrowLeft size={14} />

            <button
              type="button"
              onClick={() => navigate("/results")}
              className="transition hover:text-primary"
            >
              الرحلات
            </button>

            <FiArrowLeft size={14} />

            <span>إتمام الحجز</span>
          </div>

          {/* Title */}

          <div className="flex items-end justify-between gap-5">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 text-[11px] font-black text-primary">
                <BsStars size={15} />
                باقي شوي وتوصل
              </div>

              <h1 className="m-0 text-[31px] font-black leading-tight text-text max-[650px]:text-[26px]">
                كمّل حجز{" "}
                <span className="bg-gradient-to-l from-[#078a91] to-[#15ba9d] bg-clip-text text-transparent">
                  رحلتك.
                </span>
              </h1>
            </div>

            <button
              type="button"
              onClick={() => navigate("/results")}
              className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-muted transition hover:text-primary"
            >
              <FiArrowRight size={16} />
              تغيير الرحلة
            </button>
          </div>

          {/* Stepper */}

          <BookingStepper currentStep={step} />
        </div>
      </section>

      {/* =========================
          Booking Content
      ========================== */}

      <section className="mx-auto grid max-w-[1216px] grid-cols-[minmax(0,1fr)_320px] items-start gap-[21px] px-4 pb-[90px] max-[900px]:grid-cols-1 max-[900px]:gap-[13px] max-[900px]:pb-[55px]">
        {/* Main */}

        <div className="min-w-0 rounded-[20px] border border-border bg-surface p-[29px] shadow-custom max-[650px]:rounded-[15px] max-[650px]:p-[17px]">
          {step === "seats" && (
            <SeatStage
              seats={seats}
              occupiedSeats={occupiedSeats}
              selectedSeats={selectedSeats}
              people={peopleFromUrl}
              availableSeats={availableSeats}
              onSeatClick={handleSeatClick}
            />
          )}

          {step === "passengers" && (
            <PassengerStage
              passengers={passengers}
              onChange={handlePassengerChange}
            />
          )}

          {step === "review" && (
            <ReviewStage
              trip={trip}
              selectedSeats={selectedSeats}
              passengers={passengers}
              people={peopleFromUrl}
              totalPrice={totalPrice}
              formatMoney={formatMoney}
            />
          )}

          {/* Controls */}

          <div className="mt-7 flex items-center justify-between gap-3 border-t border-border pt-5 max-[500px]:flex-col-reverse">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-5 text-xs font-extrabold text-muted transition hover:border-primary hover:text-primary max-[500px]:w-full"
            >
              <FiArrowRight size={16} />

              {step === "seats" ? "رجوع للرحلات" : "السابق"}
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-xs font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-primary-deep max-[500px]:w-full"
            >
              {step === "review" ? "تأكيد الحجز" : "متابعة الحجز"}

              <FiArrowLeft size={16} />
            </button>
          </div>
        </div>

        {/* Summary */}

        <BookingSummary
          trip={trip}
          people={peopleFromUrl}
          selectedSeats={selectedSeats}
          price={price}
          totalPrice={totalPrice}
          formatMoney={formatMoney}
          formatDate={formatDate}
          formatTime={formatTime}
        />
      </section>
    </main>
  )
}


/* =========================================================
   Booking Stepper
========================================================= */

function BookingStepper({ currentStep }) {
  const steps = [
    {
      key: "seats",
      label: "اختيار المقاعد",
    },
    {
      key: "passengers",
      label: "بيانات المسافرين",
    },
    {
      key: "review",
      label: "مراجعة الحجز",
    },
  ]

  const currentIndex = steps.findIndex(
    (item) => item.key === currentStep
  )

  return (
    <div className="my-[34px] flex items-center justify-center max-[650px]:my-[23px]">
      {steps.map((item, index) => {
        const isCurrent = index === currentIndex
        const isDone = index < currentIndex

        return (
          <div key={item.key} className="flex items-center">
            <div
              className={`
                flex items-center gap-[9px]
                ${isCurrent || isDone ? "text-primary-deep" : "text-muted"}
              `}
            >
              <span
                className={`
                  grid h-[30px] w-[30px] place-items-center rounded-full
                  border text-[11px] font-black
                  max-[650px]:h-[26px] max-[650px]:w-[26px]
                  ${
                    isCurrent || isDone
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-surface-alt text-muted"
                  }
                `}
              >
                {isDone ? <FiCheck size={15} /> : index + 1}
              </span>

              <b className="whitespace-nowrap text-[11px] max-[650px]:text-[9px]">
                {item.label}
              </b>
            </div>

            {index < steps.length - 1 && (
              <div className="mx-[17px] h-px w-[89px] bg-border max-[650px]:mx-2 max-[650px]:w-5" />
            )}
          </div>
        )
      })}
    </div>
  )
}


/* =========================================================
   Seats Stage
========================================================= */

function SeatStage({
  seats,
  occupiedSeats,
  selectedSeats,
  people,
  availableSeats,
  onSeatClick,
}) {
  const rows = []

  for (let i = 0; i < seats.length; i += 4) {
    rows.push(seats.slice(i, i + 4))
  }

  return (
    <div>
      <div className="mb-[21px]">
        <h2 className="mb-1.5 flex items-center gap-[11px] text-xl font-black text-text max-[650px]:text-[17px]">
          <FiUsers className="text-primary" size={21} />
          اختار مقعدك
        </h2>

        <p className="m-0 text-xs leading-7 text-muted">
          اختاري {people} {people === 1 ? "مقعد" : "مقاعد"} للرحلة.
        </p>
      </div>

      <div className="grid grid-cols-[minmax(270px,1fr)_minmax(190px,.8fr)] gap-[26px] max-[900px]:grid-cols-1">
        {/* Bus */}

        <div className="w-full max-w-[353px] justify-self-center rounded-[100px_100px_26px_26px] border border-border bg-surface-alt px-[18px] pb-[25px] pt-[21px] shadow-[inset_0_0_0_6px_rgba(228,236,239,.35)] max-[900px]:max-w-[340px]">
          {/* Driver */}

          <div className="mb-[18px] flex items-center justify-between border-b border-dashed border-[#bdced2] px-2 pb-4 pt-2 text-[10px] font-extrabold text-muted">
            <span className="flex items-center gap-1.5">
              <FiTruck size={16} />
              السائق
            </span>

            <span className="text-2xl text-text">◉</span>
          </div>

          {/* Seats */}

          <div className="space-y-[9px]">
            {rows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="grid grid-cols-[27px_1fr_1fr_15px_1fr_1fr] items-center gap-[7px]"
              >
                <span className="text-center text-[10px] text-muted">
                  {rowIndex + 1}
                </span>

                {[row[0], row[1], null, row[2], row[3]].map(
                  (seat, index) => {
                    if (!seat) {
                      return (
                        <span
                          key={`empty-${index}`}
                          className="block"
                        />
                      )
                    }

                    const isOccupied = occupiedSeats.includes(seat)
                    const isSelected = selectedSeats.includes(seat)

                    return (
                      <SeatButton
                        key={seat}
                        seatNumber={seat}
                        occupied={isOccupied}
                        selected={isSelected}
                        onClick={() => onSeatClick(seat)}
                      />
                    )
                  }
                )}
              </div>
            ))}
          </div>

          {/* Legend */}

          <div className="mt-5 flex flex-wrap items-center justify-center gap-4 border-t border-border pt-4 text-[9px] font-bold text-muted">
            <LegendItem type="available" label="متاح" />
            <LegendItem type="selected" label="مختار" />
            <LegendItem type="occupied" label="محجوز" />
          </div>
        </div>

        {/* Aside */}

        <div className="grid content-start gap-3">
          <div className="rounded-2xl border border-border bg-surface-alt p-[17px]">
            <div className="mb-3 flex items-center gap-2">
              <FiCheck className="text-primary" size={18} />

              <strong className="text-sm font-black text-text">
                اختيار المقاعد
              </strong>
            </div>

            <p className="m-0 text-[11px] leading-7 text-muted">
              يمكنك اختيار عدد مقاعد يساوي عدد المسافرين فقط.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <InfoBox
                label="المطلوب"
                value={`${people} ${people === 1 ? "مقعد" : "مقاعد"}`}
              />

              <InfoBox
                label="المختار"
                value={`${selectedSeats.length}`}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-[17px]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted">
                المقاعد المتاحة
              </span>

              <strong className="text-sm font-black text-primary">
                {availableSeats}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


/* =========================================================
   Seat Button
========================================================= */

function SeatButton({
  seatNumber,
  occupied,
  selected,
  onClick,
}) {
  return (
    <button
      type="button"
      disabled={occupied}
      onClick={onClick}
      aria-label={`المقعد ${seatNumber}`}
      className={`
        relative grid h-[39px] min-w-0 place-items-center rounded-[9px]
        border text-xs font-black transition
        ${
          occupied
            ? "cursor-not-allowed border-border bg-[#dce7e9] text-[#9fb3b8]"
            : selected
              ? "border-primary bg-primary text-white"
              : "border-[#c9dade] bg-surface text-[#8fadb4] hover:scale-105 hover:border-primary hover:text-primary"
        }
      `}
    >
      <FiUser size={16} />

      <small className="absolute bottom-px left-1 text-[8px] font-normal">
        {seatNumber}
      </small>
    </button>
  )
}


/* =========================================================
   Legend
========================================================= */

function LegendItem({ type, label }) {
  const styles = {
    available: "border-[#c9dade] bg-surface",
    selected: "border-primary bg-primary",
    occupied: "border-border bg-[#dce7e9]",
  }

  return (
    <span className="flex items-center gap-1.5">
      <span
        className={`h-3 w-3 rounded-[4px] border ${styles[type]}`}
      />

      {label}
    </span>
  )
}


/* =========================================================
   Passenger Stage
========================================================= */

function PassengerStage({ passengers, onChange }) {
  return (
    <div>
      <div className="mb-[21px]">
        <h2 className="mb-1.5 flex items-center gap-[11px] text-xl font-black text-text max-[650px]:text-[17px]">
          <FiUser className="text-primary" size={21} />
          بيانات المسافرين
        </h2>

        <p className="m-0 text-xs leading-7 text-muted">
          أدخلي اسم ورقم هاتف كل مسافر.
        </p>
      </div>

      <div className="space-y-4">
        {passengers.map((passenger, index) => (
          <div
            key={index}
            className="rounded-2xl border border-border bg-surface-alt p-5 max-[650px]:p-[15px]"
          >
            <div className="mb-4 flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-soft-teal text-xs font-black text-primary">
                {index + 1}
              </span>

              <div>
                <h3 className="m-0 text-sm font-black text-text">
                  المسافر {index + 1}
                </h3>

                <p className="m-0 text-[10px] text-muted">
                  بيانات التواصل
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 max-[650px]:grid-cols-1">
              <InputField
                label="اسم المسافر"
                placeholder="اكتب الاسم الكامل"
                value={passenger.name}
                onChange={(value) =>
                  onChange(index, "name", value)
                }
              />

              <InputField
                label="رقم الهاتف"
                placeholder="09xxxxxxxx"
                type="tel"
                value={passenger.phone}
                onChange={(value) =>
                  onChange(index, "phone", value)
                }
                dir="ltr"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-start gap-2 text-[10px] leading-7 text-muted">
        <FiShield className="mt-1 shrink-0 text-primary" size={15} />

        <p className="m-0">
          تأكدي من صحة رقم الهاتف لأنه يستخدم ضمن بيانات الحجز.
        </p>
      </div>
    </div>
  )
}


/* =========================================================
   Input
========================================================= */

function InputField({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  dir,
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-extrabold text-text">
        {label}
      </span>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        dir={dir}
        onChange={(e) => onChange(e.target.value)}
        className="h-[48px] w-full rounded-xl border border-border bg-surface px-3 text-xs text-text outline-none transition placeholder:text-muted/60 focus:border-primary"
      />
    </label>
  )
}


/* =========================================================
   Review Stage
========================================================= */

function ReviewStage({
  trip,
  selectedSeats,
  passengers,
  people,
  totalPrice,
  formatMoney,
}) {
  return (
    <div>
      <div className="mb-[21px]">
        <h2 className="mb-1.5 flex items-center gap-[11px] text-xl font-black text-text max-[650px]:text-[17px]">
          <FiCheck className="text-primary" size={21} />
          مراجعة الحجز
        </h2>

        <p className="m-0 text-xs leading-7 text-muted">
          راجعي تفاصيل الرحلة والبيانات قبل تأكيد الحجز.
        </p>
      </div>

      <div className="space-y-4">
        {/* Route */}

        <div className="rounded-2xl border border-border bg-surface-alt p-5">
          <div className="mb-4 flex items-center gap-2">
            <FiMapPin className="text-primary" size={18} />

            <strong className="text-sm font-black text-text">
              تفاصيل الرحلة
            </strong>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 text-center">
            <div>
              <small className="block text-[10px] text-muted">
                الانطلاق
              </small>

              <strong className="mt-1 block text-lg font-black text-text">
                {trip.origin?.name}
              </strong>

              <span className="mt-1 block text-xs text-muted">
                {new Date(trip.departureAt).toLocaleTimeString(
                  "ar-SY",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  }
                )}
              </span>
            </div>

            <FiArrowLeft className="text-primary" size={23} />

            <div>
              <small className="block text-[10px] text-muted">
                الوصول
              </small>

              <strong className="mt-1 block text-lg font-black text-text">
                {trip.destination?.name}
              </strong>

              <span className="mt-1 block text-xs text-muted">
                {new Date(trip.arrivalAt).toLocaleTimeString(
                  "ar-SY",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  }
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Seats */}

        <ReviewRow
          icon={<FiUsers />}
          title="المقاعد"
          value={selectedSeats.join("، ")}
        />

        {/* Passengers */}

        <div className="rounded-2xl border border-border bg-surface-alt p-5">
          <div className="mb-4 flex items-center gap-2">
            <FiUser className="text-primary" size={18} />

            <strong className="text-sm font-black text-text">
              المسافرون
            </strong>
          </div>

          <div className="space-y-2">
            {passengers.map((passenger, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-3 rounded-xl bg-surface p-3"
              >
                <span className="text-xs font-bold text-text">
                  {index + 1}. {passenger.name}
                </span>

                <span
                  dir="ltr"
                  className="text-[10px] text-muted"
                >
                  {passenger.phone}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Price */}

        <div className="rounded-2xl border border-primary/20 bg-soft-teal p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="block text-[10px] text-muted">
                {people} {people === 1 ? "مسافر" : "مسافرين"}
              </span>

              <strong className="mt-1 block text-xl font-black text-text">
                السعر الإجمالي
              </strong>
            </div>

            <strong className="text-xl font-black text-primary">
              {formatMoney(totalPrice)}
            </strong>
          </div>
        </div>
      </div>
    </div>
  )
}


/* =========================================================
   Review Row
========================================================= */

function ReviewRow({ icon, title, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface-alt p-4">
      <div className="flex items-center gap-2">
        <span className="text-primary">{icon}</span>

        <span className="text-xs font-bold text-text">
          {title}
        </span>
      </div>

      <strong className="text-xs font-black text-text">
        {value}
      </strong>
    </div>
  )
}


/* =========================================================
   Booking Summary
========================================================= */

function BookingSummary({
  trip,
  people,
  selectedSeats,
  price,
  totalPrice,
  formatMoney,
  formatDate,
  formatTime,
}) {
  return (
    <aside className="rounded-[20px] border border-border bg-surface p-5 shadow-custom max-[900px]:order-[-1] max-[650px]:rounded-[15px] max-[650px]:p-[17px]">
      {/* Title */}

      <div className="mb-5 flex items-center gap-2.5">
        <FiCreditCard className="text-primary" size={21} />

        <h3 className="m-0 text-base font-black text-text">
          ملخص الحجز
        </h3>
      </div>

      {/* Company */}

      <div className="mb-5 flex items-center gap-3">
        <div className="grid h-[48px] w-[48px] shrink-0 place-items-center rounded-xl bg-soft-teal text-primary">
          <FiTruck size={23} />
        </div>

        <div>
          <strong className="block text-sm font-black text-text">
            {trip.company?.name || "شركة النقل"}
          </strong>

          <small className="mt-1 block text-[10px] text-muted">
            رحلة مباشرة
          </small>
        </div>
      </div>

      {/* Route */}

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 border-y border-border py-5 text-center">
        <div>
          <small className="block text-[9px] text-muted">
            الانطلاق
          </small>

          <b className="mt-1 block text-sm font-black text-text">
            {trip.origin?.name}
          </b>

          <span
            dir="ltr"
            className="mt-1 block text-[10px] text-muted"
          >
            {formatTime(trip.departureAt)}
          </span>
        </div>

        <FiArrowLeft className="text-primary" size={19} />

        <div>
          <small className="block text-[9px] text-muted">
            الوصول
          </small>

          <b className="mt-1 block text-sm font-black text-text">
            {trip.destination?.name}
          </b>

          <span
            dir="ltr"
            className="mt-1 block text-[10px] text-muted"
          >
            {formatTime(trip.arrivalAt)}
          </span>
        </div>
      </div>

      {/* Details */}

      <div className="grid gap-0">
        <SummaryDetail
          label="تاريخ الرحلة"
          value={formatDate(trip.departureAt)}
        />

        <SummaryDetail
          label="المسافرين"
          value={people}
        />

        <SummaryDetail
          label="المقاعد"
          value={
            selectedSeats.length
              ? selectedSeats.join("، ")
              : "لم تُحدّد بعد"
          }
        />

        <SummaryDetail
          label="السعر للمسافر"
          value={formatMoney(price)}
        />
      </div>

      {/* Total */}

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
        <span className="text-xs font-bold text-muted">
          السعر الإجمالي
        </span>

        <b className="text-lg font-black text-primary">
          {formatMoney(totalPrice)}
        </b>
      </div>

      {/* Trust */}

      <p className="mt-4 flex items-start gap-1.5 text-[9px] leading-6 text-muted">
        <FiShield className="mt-1 shrink-0 text-primary" size={14} />

        لا يوجد دفع حقيقي ضمن المشروع التعليمي.
      </p>
    </aside>
  )
}


/* =========================================================
   Summary Detail
========================================================= */

function SummaryDetail({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border py-3 last:border-b-0 max-[650px]:flex-col max-[650px]:items-start">
      <span className="text-[10px] text-muted">
        {label}
      </span>

      <strong className="text-[10px] font-black text-text">
        {value}
      </strong>
    </div>
  )
}


/* =========================================================
   Info Box
========================================================= */

function InfoBox({ label, value }) {
  return (
    <div className="rounded-xl bg-surface p-3">
      <span className="block text-[9px] text-muted">
        {label}
      </span>

      <strong className="mt-1 block text-sm font-black text-text">
        {value}
      </strong>
    </div>
  )
}


/* =========================================================
   Loading
========================================================= */

function BookingLoading() {
  return (
    <section
      dir="rtl"
      className="min-h-[75vh] bg-bg px-4 py-10"
    >
      <div className="mx-auto max-w-[1216px]">
        <div className="mb-8 h-5 w-40 animate-pulse rounded bg-surface-alt" />

        <div className="mb-8 h-10 w-72 animate-pulse rounded bg-surface-alt" />

        <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-5 max-[900px]:grid-cols-1">
          <div className="h-[500px] animate-pulse rounded-[20px] bg-surface-alt" />

          <div className="h-[400px] animate-pulse rounded-[20px] bg-surface-alt" />
        </div>
      </div>
    </section>
  )
}

export default BookingPage
import { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  FiArrowLeft,
  FiCheck,
  FiClock,
  FiHome,
  FiMapPin,
  FiShield,
  FiUser,
} from "react-icons/fi"

import Button from "../../components/button/button"

function SuccessPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const {
    booking,
    trip,
    selectedSeats = [],
    passengers = [],
    paymentMethod = "office",
    totalPrice = 0,
  } = location.state || {}

  const [visible, setVisible] = useState(false)
  const pageRef = useRef(null)

  useEffect(() => {
    const element = pageRef.current

    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -40px 0px",
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  const formatPrice = (value) => {
    return new Intl.NumberFormat("ar-SY").format(
      Number(value || 0)
    )
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

  const bookingId =
    booking?.id ||
    booking?.bookingId ||
    booking?.code ||
    "—"

  const animation = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible
      ? "translateY(0) scale(1)"
      : "translateY(35px) scale(0.97)",
    transition: `opacity 850ms ease ${delay}ms, transform 900ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
  })

  return (
    <main
      ref={pageRef}
      dir="rtl"
      className="min-h-screen overflow-hidden bg-bg px-4 py-12 md:px-6 lg:py-16"
    >
      <div className="mx-auto max-w-[900px]">

        <section
          className="mb-8 text-center"
          style={animation(0)}
        >
          <div
            className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-soft-teal text-primary"
            style={{
              transform: visible
                ? "scale(1) rotate(0deg)"
                : "scale(0.5) rotate(-25deg)",
              opacity: visible ? 1 : 0,
              transition:
                "opacity 700ms ease, transform 900ms cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <div className="grid h-12 w-12 place-items-center rounded-full bg-primary text-white shadow-[0_10px_30px_rgba(10,169,155,0.25)]">
              <FiCheck size={25} />
            </div>
          </div>

          <div
            className="mb-3 inline-flex items-center gap-2 rounded-full bg-soft-teal px-4 py-2 text-xs font-black text-primary"
            style={animation(250)}
          >
            <FiCheck size={14} />
            تم تأكيد الحجز
          </div>

          <h1
            className="mb-3 text-3xl font-black text-text md:text-4xl"
            style={animation(400)}
          >
            رحلتك صارت جاهزة 🎉
          </h1>

          <p
            className="mx-auto max-w-[600px] text-sm leading-7 text-muted"
            style={animation(550)}
          >
            تم إرسال طلب الحجز بنجاح. احتفظي بتفاصيل الحجز
            للرجوع إليها لاحقاً.
          </p>
        </section>

        <section
          className="mb-5 rounded-[22px] border border-border bg-surface p-5 shadow-custom md:p-6"
          style={animation(700)}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="mb-2 text-[10px] font-bold text-muted">
                رقم الحجز
              </p>

              <p className="text-xl font-black tracking-wide text-primary">
                {bookingId}
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-soft-teal px-4 py-3 text-xs font-black text-primary">
              <FiShield size={15} />
              الحجز تم بنجاح
            </div>

          </div>
        </section>

        {trip && (
          <section
            className="mb-5 overflow-hidden rounded-[22px] border border-border bg-surface shadow-custom"
            style={animation(850)}
          >
            <div className="bg-dark p-5 text-white md:p-6">

              <p className="mb-2 text-[10px] font-bold text-white/60">
                تفاصيل الرحلة
              </p>

              <h2 className="text-xl font-black">
                {trip.origin?.name || "—"}

                <span className="mx-2 text-primary">
                  ←
                </span>

                {trip.destination?.name || "—"}
              </h2>

              <p className="mt-2 text-[11px] font-bold text-white/60">
                {formatDate(trip.departureAt)}
              </p>

            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-3 md:p-6">

              <InfoItem
                icon={<FiClock />}
                label="المغادرة"
                value={formatTime(trip.departureAt)}
                delay={1050}
                visible={visible}
              />

              <InfoItem
                icon={<FiMapPin />}
                label="الوصول"
                value={formatTime(trip.arrivalAt)}
                delay={1200}
                visible={visible}
              />

              <InfoItem
                icon={<FiUser />}
                label="المسافرين"
                value={`${passengers.length} مسافر`}
                delay={1350}
                visible={visible}
              />

            </div>
          </section>
        )}

        {passengers.length > 0 && (
          <section
            className="mb-5 rounded-[22px] border border-border bg-surface p-5 shadow-custom md:p-6"
            style={animation(1450)}
          >
            <h2 className="mb-5 text-lg font-black text-text">
              بيانات المسافرين
            </h2>

            <div className="space-y-3">

              {passengers.map((passenger, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-xl border border-border bg-surface-alt p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible
                      ? "translateX(0)"
                      : "translateX(30px)",
                    transition: `opacity 700ms ease ${1600 + index * 120}ms, transform 800ms cubic-bezier(0.16,1,0.3,1) ${1600 + index * 120}ms`,
                  }}
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
          </section>
        )}

        <section
          className="mb-6 rounded-[22px] border border-border bg-surface p-5 shadow-custom md:p-6"
          style={animation(1850)}
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="mb-2 text-[10px] font-bold text-muted">
                طريقة الدفع
              </p>

              <p className="text-sm font-black text-text">
                {paymentMethod === "office"
                  ? "الدفع في مكتب الشركة"
                  : "الدفع الإلكتروني"}
              </p>
            </div>

            <div className="text-right sm:text-left">

              <p className="mb-1 text-[10px] font-bold text-muted">
                المبلغ الإجمالي
              </p>

              <p className="text-xl font-black text-primary">
                {formatPrice(totalPrice)}{" "}
                <span className="text-xs">
                  ل.س
                </span>
              </p>

            </div>

          </div>
        </section>

        <div
          className="mb-7 rounded-2xl border border-border bg-surface-alt p-4 text-center"
          style={animation(2000)}
        >
          <p className="text-xs font-bold leading-6 text-muted">
            احتفظي بمعلومات الحجز، وتأكدي من الحضور إلى نقطة
            الانطلاق قبل موعد الرحلة بوقت كافٍ.
          </p>
        </div>

        <div
          className="flex flex-col gap-3 sm:flex-row sm:justify-center"
          style={animation(2150)}
        >
          <Button
            onClick={() => navigate("/trips")}
            className="w-full transition-transform duration-300 hover:-translate-y-1 sm:w-auto"
          >
            حجوزاتي
            <FiArrowLeft />
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="w-full transition-transform duration-300 hover:-translate-y-1 sm:w-auto"
          >
            <FiHome />
            العودة للرئيسية
          </Button>
        </div>

      </div>
    </main>
  )
}

function InfoItem({
  icon,
  label,
  value,
  delay,
  visible,
}) {
  return (
    <div
      className="flex items-center gap-3"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateY(0)"
          : "translateY(20px)",
        transition: `opacity 700ms ease ${delay}ms, transform 800ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-soft-teal text-primary">
        {icon}
      </span>

      <div>
        <p className="text-[10px] font-bold text-muted">
          {label}
        </p>

        <p className="mt-1 text-sm font-black text-text">
          {value}
        </p>
      </div>
    </div>
  )
}

export default SuccessPage
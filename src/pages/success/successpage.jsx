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

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-bg px-4 py-12 md:px-6 lg:py-16"
    >
      <div className="mx-auto max-w-[900px]">

        <section className="mb-8 text-center">

          <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-soft-teal text-primary">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-primary text-white">
              <FiCheck size={25} />
            </div>
          </div>

          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-soft-teal px-4 py-2 text-xs font-black text-primary">
            <FiCheck size={14} />
            تم تأكيد الحجز
          </div>

          <h1 className="mb-3 text-3xl font-black text-text md:text-4xl">
            رحلتك صارت جاهزة 🎉
          </h1>

          <p className="mx-auto max-w-[600px] text-sm leading-7 text-muted">
            تم إرسال طلب الحجز بنجاح. احتفظي بتفاصيل الحجز
            للرجوع إليها لاحقاً.
          </p>
        </section>

        <section className="mb-5 rounded-[22px] border border-border bg-surface p-5 shadow-custom md:p-6">

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
          <section className="mb-5 overflow-hidden rounded-[22px] border border-border bg-surface shadow-custom">

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
              />

              <InfoItem
                icon={<FiMapPin />}
                label="الوصول"
                value={formatTime(trip.arrivalAt)}
              />

              <InfoItem
                icon={<FiUser />}
                label="المسافرين"
                value={`${passengers.length} مسافر`}
              />

            </div>
          </section>
        )}

        {passengers.length > 0 && (
          <section className="mb-5 rounded-[22px] border border-border bg-surface p-5 shadow-custom md:p-6">

            <h2 className="mb-5 text-lg font-black text-text">
              بيانات المسافرين
            </h2>

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
          </section>
        )}

        <section className="mb-6 rounded-[22px] border border-border bg-surface p-5 shadow-custom md:p-6">

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

        <div className="mb-7 rounded-2xl border border-border bg-surface-alt p-4 text-center">

          <p className="text-xs font-bold leading-6 text-muted">
            احتفظي بمعلومات الحجز، وتأكدي من الحضور إلى نقطة
            الانطلاق قبل موعد الرحلة بوقت كافٍ.
          </p>

        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">

          <Button
            onClick={() => navigate("/trips")}
            className="w-full sm:w-auto"
          >
            حجوزاتي
            <FiArrowLeft />
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="w-full sm:w-auto"
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
}) {
  return (
    <div className="flex items-center gap-3">

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
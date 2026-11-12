import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import {
  FaArrowLeft,
  FaBus,
  FaCheckCircle,
  FaChevronLeft,
  FaClock,
  FaHome,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaRoad,
  FaTicketAlt,
  FaUsers,
} from "react-icons/fa"
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet"
import L from "leaflet"
import { useBooking } from "../../hooks/use-bookings"
import "leaflet/dist/leaflet.css"

const createMarkerIcon = (type) =>
  L.divIcon({
    className: "",
    html: `
      <div style="
        width:38px;
        height:38px;
        border-radius:50%;
        background:${type === "start" ? "#0aa99b" : "#103a4e"};
        display:flex;
        align-items:center;
        justify-content:center;
        color:white;
        font-size:14px;
        border:4px solid white;
        box-shadow:0 8px 22px rgba(19,54,72,0.22);
      ">
        ●
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  })

const createBusIcon = () =>
  L.divIcon({
    className: "",
    html: `
      <div style="
        width:46px;
        height:46px;
        border-radius:50%;
        background:#0aa99b;
        display:flex;
        align-items:center;
        justify-content:center;
        color:white;
        font-size:18px;
        border:4px solid white;
        box-shadow:0 10px 28px rgba(10,169,155,0.35);
      ">
        🚌
      </div>
    `,
    iconSize: [46, 46],
    iconAnchor: [23, 23],
  })

function MapRoute({ positions, progress }) {
  const map = useMap()

  const vehiclePosition = useMemo(() => {
    if (positions.length < 2) return null

    const [start, end] = positions
    const ratio = progress / 100

    return [
      start[0] + (end[0] - start[0]) * ratio,
      start[1] + (end[1] - start[1]) * ratio,
    ]
  }, [positions, progress])

  useEffect(() => {
    if (positions.length < 2) return

    const bounds = L.latLngBounds(positions)

    map.fitBounds(bounds, {
      padding: [55, 55],
      maxZoom: 8,
    })
  }, [map, positions])

  if (!vehiclePosition) return null

  return (
    <Marker
      position={vehiclePosition}
      icon={createBusIcon()}
    >
      <Popup>
        <div dir="rtl" className="text-center">
          <strong>موقع الرحلة</strong>
          <br />
          تتقدم الرحلة بشكل تجريبي
        </div>
      </Popup>
    </Marker>
  )
}

function TrackingPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const bookingId = searchParams.get("bookingId")

  const pageRef = useRef(null)

  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(34)
  const [speed, setSpeed] = useState(82)
  const [remainingMinutes, setRemainingMinutes] = useState(74)

  const {
    data: bookingResponse,
    isLoading,
    isError,
  } = useBooking(bookingId)

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

  useEffect(() => {
    if (!bookingResponse) return

    setProgress(34)
    setRemainingMinutes(74)
    setSpeed(82)

    const interval = setInterval(() => {
      setProgress((current) => {
        if (current >= 96) return 34
        return current + 0.35
      })

      setRemainingMinutes((current) => {
        if (current <= 1) return 74
        return current - 1
      })

      setSpeed(() => {
        const values = [78, 81, 84, 86, 82, 80, 85, 88]
        return values[Math.floor(Math.random() * values.length)]
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [bookingResponse])

  const animation = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible
      ? "translateY(0) scale(1)"
      : "translateY(35px) scale(0.97)",
    transition: `opacity 850ms ease ${delay}ms, transform 900ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
  })

  const booking =
    bookingResponse?.booking ||
    bookingResponse?.data ||
    bookingResponse

  const trip = booking?.trip || {}

  const origin =
    trip.origin ||
    booking?.origin ||
    {}

  const destination =
    trip.destination ||
    booking?.destination ||
    {}

  const company =
    trip.company ||
    booking?.company ||
    {}

  const departureAt =
    trip.departureAt ||
    booking?.departureAt

  const arrivalAt =
    trip.arrivalAt ||
    booking?.arrivalAt

  const bookingNumber =
    booking?.id ||
    booking?.bookingId ||
    booking?.code ||
    bookingId ||
    "—"

  const status =
    String(
      booking?.status ||
        booking?.bookingStatus ||
        ""
    ).toUpperCase()

  const statusData =
    status === "CONFIRMED"
      ? {
          label: "تم تأكيد الحجز",
          className: "bg-soft-teal text-primary-deep",
        }
      : status === "PENDING"
        ? {
            label: "قيد المراجعة",
            className: "bg-[#fff2da] text-[#a16c21]",
          }
        : status === "CANCELLED"
          ? {
              label: "الحجز ملغي",
              className: "bg-red-50 text-red-500",
            }
          : status === "COMPLETED"
            ? {
                label: "الرحلة مكتملة",
                className: "bg-surface-alt text-muted",
              }
            : {
                label: "الرحلة قيد التتبع",
                className: "bg-soft-teal text-primary-deep",
              }

  const seats =
    booking?.seats ||
    booking?.bookingSeats ||
    []

  const seatNumbers = Array.isArray(seats)
    ? seats
        .map(
          (seat) =>
            seat?.seatNumber ??
            seat?.number ??
            seat
        )
        .join("، ")
    : booking?.seatNumber || "—"

  const formatTime = (date) => {
    if (!date) return "—"

    return new Date(date).toLocaleTimeString("ar-SY", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (date) => {
    if (!date) return "—"

    return new Date(date).toLocaleDateString("ar-SY", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const originPosition =
    Number.isFinite(Number(origin?.latitude)) &&
    Number.isFinite(Number(origin?.longitude))
      ? [
          Number(origin.latitude),
          Number(origin.longitude),
        ]
      : null

  const destinationPosition =
    Number.isFinite(Number(destination?.latitude)) &&
    Number.isFinite(Number(destination?.longitude))
      ? [
          Number(destination.latitude),
          Number(destination.longitude),
        ]
      : null

  const positions =
    originPosition && destinationPosition
      ? [originPosition, destinationPosition]
      : []

  const routeLength = Math.max(
    0,
    Math.round(
      Math.sqrt(
        Math.pow(
          Number(destination?.latitude || 0) -
            Number(origin?.latitude || 0),
          2
        ) +
          Math.pow(
            Number(destination?.longitude || 0) -
              Number(origin?.longitude || 0),
            2
          )
      ) * 111
    )
  )

  if (!bookingId) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-bg px-4 py-12"
      >
        <div className="mx-auto flex min-h-[520px] max-w-[760px] items-center justify-center">
          <div className="rounded-[22px] border border-border bg-surface px-7 py-9 text-center shadow-custom">
            <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-soft-teal text-primary">
              <FaTicketAlt size={24} />
            </div>

            <h1 className="mb-2 text-xl font-black text-text">
              اختاري رحلة لتتبعيها
            </h1>

            <p className="mb-6 text-xs font-bold leading-6 text-muted">
              افتحي التتبع من إحدى حجوزاتك حتى نعرض لك
              تفاصيل الرحلة وحركتها على الخريطة.
            </p>

            <button
              type="button"
              onClick={() => navigate("/trips")}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-extrabold text-white transition duration-300 hover:-translate-y-1 hover:bg-primary-deep"
            >
              <FaTicketAlt size={13} />
              حجوزاتي
            </button>
          </div>
        </div>
      </main>
    )
  }

  if (isLoading) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-bg px-4 py-12"
      >
        <div className="mx-auto flex min-h-[520px] max-w-[760px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />

            <p className="text-xs font-bold text-muted">
              جاري تحميل تفاصيل الرحلة...
            </p>
          </div>
        </div>
      </main>
    )
  }

  if (isError || !booking) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-bg px-4 py-12"
      >
        <div className="mx-auto flex min-h-[520px] max-w-[760px] items-center justify-center">
          <div className="rounded-[22px] border border-border bg-surface px-7 py-9 text-center shadow-custom">
            <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-red-50 text-red-500">
              <FaInfoCircle size={24} />
            </div>

            <h1 className="mb-2 text-xl font-black text-text">
              تعذر تحميل الرحلة
            </h1>

            <p className="mb-6 text-xs font-bold leading-6 text-muted">
              ما قدرنا نجيب تفاصيل هذا الحجز.
              جربي الرجوع إلى حجوزاتك.
            </p>

            <button
              type="button"
              onClick={() => navigate("/trips")}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-extrabold text-white transition duration-300 hover:-translate-y-1 hover:bg-primary-deep"
            >
              <FaTicketAlt size={13} />
              حجوزاتي
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main
      ref={pageRef}
      dir="rtl"
      className="min-h-screen overflow-hidden bg-bg"
    >
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-surface-alt to-bg px-4 pb-11 pt-7">
        <div
          className="pointer-events-none absolute -left-24 -top-44 h-[350px] w-[350px] rounded-full border border-dashed border-primary/10"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible
              ? "scale(1) rotate(0deg)"
              : "scale(.8) rotate(-25deg)",
            transition:
              "opacity 1000ms ease, transform 1200ms cubic-bezier(0.16,1,0.3,1)",
          }}
        />

        <div className="relative mx-auto max-w-[1216px]">
          <div
            className="mb-5 flex items-center gap-2 text-[11px] font-extrabold text-muted"
            style={animation(100)}
          >
            <Link
              to="/"
              className="transition hover:text-primary"
            >
              الرئيسية
            </Link>

            <FaChevronLeft size={10} />

            <Link
              to="/trips"
              className="transition hover:text-primary"
            >
              حجوزاتي
            </Link>

            <FaChevronLeft size={10} />

            <span className="text-text">
              تتبع الرحلة
            </span>
          </div>

          <span
            className="inline-block text-[11px] font-extrabold text-primary"
            style={animation(250)}
          >
            رحلتك قدامك
          </span>

          <h1
            className="mb-2 mt-2 text-[30px] font-black tracking-tight text-text sm:text-[40px]"
            style={animation(400)}
          >
            تتبّع رحلتك{" "}
            <span className="text-primary">
              لحظة بلحظة.
            </span>
          </h1>

          <p
            className="max-w-[620px] text-xs leading-6 text-muted sm:text-[13px]"
            style={animation(550)}
          >
            شوف وين وصلت رحلتك وقديش باقي لتوصل،
            مع تفاصيل واضحة عن السرعة والوقت المتبقي.
          </p>
        </div>
      </section>

      <section className="px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-[1216px]">

          <div
            className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            style={animation(700)}
          >
            <div>
              <p className="mb-1 text-[10px] font-bold text-muted">
                رقم الحجز
              </p>

              <p
                dir="ltr"
                className="text-lg font-black text-primary"
              >
                {bookingNumber}
              </p>
            </div>

            <span
              className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-[10px] font-extrabold ${statusData.className}`}
            >
              <FaCheckCircle size={13} />
              {statusData.label}
            </span>
          </div>

          <section
            className="mb-5 overflow-hidden rounded-[22px] border border-border bg-surface shadow-custom"
            style={animation(850)}
          >
            <div className="bg-dark p-5 text-white sm:p-7">

              <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold text-white/50">
                    الرحلة الحالية
                  </p>

                  <h2 className="mt-1 text-xl font-black sm:text-2xl">
                    {origin.name || "—"}
                    <span className="mx-2 text-primary">
                      ←
                    </span>
                    {destination.name || "—"}
                  </h2>
                </div>

                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/15 text-primary">
                  <FaBus size={21} />
                </div>
              </div>

              <div className="relative">

                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-[3000ms] ease-linear"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>

                <div
                  className="absolute top-1/2 -translate-y-1/2 transition-all duration-[3000ms] ease-linear"
                  style={{
                    right: `${progress}%`,
                    transform: "translate(50%, -50%)",
                  }}
                >
                  <div className="grid h-10 w-10 place-items-center rounded-full border-4 border-dark bg-primary text-white shadow-[0_8px_25px_rgba(10,169,155,0.35)]">
                    <FaBus size={15} />
                  </div>
                </div>

              </div>

              <div className="mt-7 flex items-center justify-between text-[10px] font-bold">
                <span className="text-white/60">
                  {origin.name || "نقطة الانطلاق"}
                </span>

                <span className="font-black text-primary">
                  {Math.round(progress)}%
                </span>

                <span className="text-white/60">
                  {destination.name || "الوجهة"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4 sm:p-6">

              <TrackingStat
                icon={<FaClock />}
                label="الوقت المتبقي"
                value={`${remainingMinutes} دقيقة`}
                delay={1050}
                visible={visible}
              />

              <TrackingStat
                icon={<FaRoad />}
                label="السرعة الحالية"
                value={`${speed} كم/س`}
                delay={1150}
                visible={visible}
              />

              <TrackingStat
                icon={<FaBus />}
                label="تقدم الرحلة"
                value={`${Math.round(progress)}%`}
                delay={1250}
                visible={visible}
              />

              <TrackingStat
                icon={<FaMapMarkerAlt />}
                label="المسافة التقريبية"
                value={`${routeLength || "—"} كم`}
                delay={1350}
                visible={visible}
              />

            </div>
          </section>

          <section
            className="mb-5 overflow-hidden rounded-[22px] border border-border bg-surface shadow-custom"
            style={animation(1450)}
          >
            <div className="border-b border-border px-5 py-5 sm:px-6">
              <h2 className="text-lg font-black text-text">
                خريطة الرحلة
              </h2>

              <p className="mt-1 text-[11px] font-bold text-muted">
                موقع السيارة يتحرك بشكل تجريبي على مسار الرحلة
              </p>
            </div>

            <div className="bg-surface-alt p-3 sm:p-4">

              {positions.length === 2 ? (
                <div className="h-[350px] overflow-hidden rounded-[18px] sm:h-[430px]">
                  <MapContainer
                    center={originPosition}
                    zoom={7}
                    scrollWheelZoom={false}
                    className="h-full w-full"
                  >
                    <TileLayer
                      attribution="&copy; OpenStreetMap contributors"
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <Polyline
                      positions={positions}
                      pathOptions={{
                        color: "#0aa99b",
                        weight: 5,
                        opacity: 0.85,
                        dashArray: "10 8",
                      }}
                    />

                    <Marker
                      position={originPosition}
                      icon={createMarkerIcon("start")}
                    >
                      <Popup>
                        <div dir="rtl">
                          <strong>
                            {origin.name}
                          </strong>
                          <br />
                          نقطة الانطلاق
                        </div>
                      </Popup>
                    </Marker>

                    <Marker
                      position={destinationPosition}
                      icon={createMarkerIcon("end")}
                    >
                      <Popup>
                        <div dir="rtl">
                          <strong>
                            {destination.name}
                          </strong>
                          <br />
                          الوجهة
                        </div>
                      </Popup>
                    </Marker>

                    <MapRoute
                      positions={positions}
                      progress={progress}
                    />
                  </MapContainer>
                </div>
              ) : (
                <div className="flex h-[350px] items-center justify-center rounded-[18px] bg-surface sm:h-[430px]">
                  <div className="max-w-[320px] text-center">
                    <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-soft-teal text-primary">
                      <FaMapMarkerAlt size={22} />
                    </div>

                    <h3 className="mb-2 text-sm font-black text-text">
                      الخريطة غير متاحة
                    </h3>

                    <p className="text-[11px] font-bold leading-6 text-muted">
                      بيانات الحجز وصلت، لكن إحداثيات المدن
                      غير متوفرة حالياً لعرض الخريطة.
                    </p>
                  </div>
                </div>
              )}

            </div>
          </section>

          <section
            className="mb-5 rounded-[22px] border border-border bg-surface p-5 shadow-custom sm:p-6"
            style={animation(1600)}
          >
            <h2 className="mb-5 text-lg font-black text-text">
              تفاصيل الرحلة
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">

              <InfoRow
                icon={<FaMapMarkerAlt />}
                label="نقطة الانطلاق"
                value={origin.name || "—"}
              />

              <InfoRow
                icon={<FaMapMarkerAlt />}
                label="الوجهة"
                value={destination.name || "—"}
              />

              <InfoRow
                icon={<FaClock />}
                label="موعد المغادرة"
                value={formatTime(departureAt)}
              />

              <InfoRow
                icon={<FaClock />}
                label="موعد الوصول"
                value={formatTime(arrivalAt)}
              />

              <InfoRow
                icon={<FaBus />}
                label="شركة النقل"
                value={company.name || "—"}
              />

              <InfoRow
                icon={<FaUsers />}
                label="المقاعد"
                value={seatNumbers}
              />

            </div>
          </section>

          <div
            className="mb-7 rounded-2xl border border-primary/10 bg-soft-teal p-4 text-center"
            style={animation(1750)}
          >
            <div className="mb-2 flex items-center justify-center gap-2 text-primary">
              <FaInfoCircle size={13} />

              <span className="text-[11px] font-black">
                تنبيه
              </span>
            </div>

            <p className="text-[10px] font-bold leading-6 text-muted sm:text-[11px]">
              السرعة والوقت المتبقي وحركة السيارة المعروضة
              حالياً تجريبية لواجهة الموقع وليست بيانات GPS
              حقيقية.
            </p>
          </div>

          <div
            className="flex flex-col gap-3 sm:flex-row sm:justify-center"
            style={animation(1900)}
          >
            <button
              type="button"
              onClick={() => navigate("/trips")}
              className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs font-extrabold text-white transition duration-300 hover:-translate-y-1 hover:bg-primary-deep hover:shadow-lg sm:w-auto"
            >
              حجوزاتي
              <FaArrowLeft />
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-5 text-xs font-extrabold text-text transition duration-300 hover:-translate-y-1 hover:border-primary hover:text-primary sm:w-auto"
            >
              <FaHome />
              العودة للرئيسية
            </button>
          </div>

        </div>
      </section>
    </main>
  )
}

function TrackingStat({
  icon,
  label,
  value,
  delay,
  visible,
}) {
  return (
    <div
      className="rounded-xl bg-surface-alt p-3 transition duration-300 hover:-translate-y-1"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateY(0)"
          : "translateY(20px)",
        transition: `opacity 700ms ease ${delay}ms, transform 800ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-soft-teal text-primary">
        {icon}
      </span>

      <p className="mt-3 text-[9px] font-bold text-muted">
        {label}
      </p>

      <p className="mt-1 text-xs font-black text-text sm:text-sm">
        {value}
      </p>
    </div>
  )
}

function InfoRow({
  icon,
  label,
  value,
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-surface-alt p-3.5 transition duration-300 hover:-translate-y-1">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-soft-teal text-primary">
        {icon}
      </span>

      <div className="min-w-0">
        <p className="text-[9px] font-bold text-muted">
          {label}
        </p>

        <p className="mt-1 truncate text-xs font-black text-text">
          {value}
        </p>
      </div>
    </div>
  )
}

export default TrackingPage
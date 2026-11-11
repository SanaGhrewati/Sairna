import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { MapContainer, Marker, Popup, Polyline, TileLayer, useMap } from "react-leaflet"
import { FiArrowLeft, FiMapPin, FiNavigation, FiRefreshCw } from "react-icons/fi"
import { BsStars } from "react-icons/bs"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useMyBookings } from "../../hooks/use-bookings"

const originIcon = new L.DivIcon({
  className: "custom-map-marker",
  html: `<div style="width:34px;height:34px;border-radius:50%;background:#0aa99b;border:4px solid white;box-shadow:0 8px 20px rgba(19,54,72,.22);display:flex;align-items:center;justify-content:center;color:white;font-size:14px">●</div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
})

const destinationIcon = new L.DivIcon({
  className: "custom-map-marker",
  html: `<div style="width:34px;height:34px;border-radius:50%;background:#103a4e;border:4px solid white;box-shadow:0 8px 20px rgba(19,54,72,.22);display:flex;align-items:center;justify-content:center;color:white;font-size:14px">●</div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
})

function FitRoute({ positions }) {
  const map = useMap()

  useEffect(() => {
    if (positions.length < 2) return

    const bounds = L.latLngBounds(positions)
    map.fitBounds(bounds, {
      padding: [45, 45],
      maxZoom: 7,
    })
  }, [map, positions])

  return null
}

function TrackingPreview() {
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const navigate = useNavigate()
  const { data, isLoading, isError, refetch } = useMyBookings()

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
      {
        threshold: 0.12,
        rootMargin: "0px 0px -70px 0px",
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  const bookings = useMemo(() => {
    if (!Array.isArray(data)) return []

    return [...data].sort((a, b) => {
      const dateA = new Date(a?.trip?.departureAt || 0).getTime()
      const dateB = new Date(b?.trip?.departureAt || 0).getTime()
      return dateA - dateB
    })
  }, [data])

  const booking = useMemo(() => {
    if (!bookings.length) return null

    const now = Date.now()

    const upcoming = bookings.find((item) => {
      const departure = new Date(item?.trip?.departureAt || 0).getTime()
      const status = String(item?.status || "").toLowerCase()

      return (
        departure >= now &&
        status !== "cancelled" &&
        status !== "canceled"
      )
    })

    return upcoming || bookings[0]
  }, [bookings])

  const origin = booking?.trip?.origin
  const destination = booking?.trip?.destination

  const originLat = Number(origin?.latitude)
  const originLng = Number(origin?.longitude)
  const destinationLat = Number(destination?.latitude)
  const destinationLng = Number(destination?.longitude)

  const hasCoordinates =
    Number.isFinite(originLat) &&
    Number.isFinite(originLng) &&
    Number.isFinite(destinationLat) &&
    Number.isFinite(destinationLng)

  const positions = hasCoordinates
    ? [
        [originLat, originLng],
        [destinationLat, destinationLng],
      ]
    : []

  const departureDate = booking?.trip?.departureAt
    ? new Date(booking.trip.departureAt)
    : null

  const formattedDate = departureDate
    ? departureDate.toLocaleDateString("ar-SY", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : ""

  const formattedTime = departureDate
    ? departureDate.toLocaleTimeString("ar-SY", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : ""

  const handleTracking = () => {
    if (!booking?.id) return
    navigate(`/tracking?bookingId=${booking.id}`)
  }

  return (
    <section
      ref={sectionRef}
      dir="rtl"
      className="relative w-full overflow-hidden bg-bg px-5 py-[90px] sm:px-7 sm:py-[110px] lg:py-[135px]"
    >
      <div className="mx-auto w-full max-w-[1216px]">
        <div
          className="mx-auto mb-12 max-w-[720px] text-center sm:mb-16"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible
              ? "translateY(0) scale(1)"
              : "translateY(30px) scale(.96)",
            transition:
              "opacity 900ms ease, transform 1000ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-soft-teal px-4 py-2 text-[10px] font-extrabold text-primary sm:text-[11px]">
            <BsStars className="text-sm" />
            <span>تتبّع رحلتك</span>
          </div>

          <h2 className="m-0 text-[34px] font-black leading-[1.25] tracking-[-1px] text-text sm:text-[44px] lg:text-[52px]">
            رحلتك بين{" "}
            <span className="bg-gradient-to-l from-primary-deep to-primary bg-clip-text text-transparent">
              المدن السورية
            </span>
          </h2>

          <p className="mt-4 text-[13px] font-medium leading-8 text-muted sm:text-[15px]">
            تابع تفاصيل الرحلة التي حجزتها من نقطة الانطلاق حتى وجهتك.
          </p>
        </div>

        {!isLoading && !booking && !isError && (
          <div
            className="mx-auto max-w-[760px] rounded-[28px] border border-border bg-surface p-8 text-center shadow-[0_20px_60px_rgba(19,54,72,0.06)] sm:p-12"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible
                ? "translateY(0)"
                : "translateY(40px)",
              transition:
                "opacity 900ms ease 200ms, transform 1000ms cubic-bezier(0.16,1,0.3,1) 200ms",
            }}
          >
            <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-[20px] bg-soft-teal text-primary">
              <FiNavigation className="text-2xl" />
            </div>

            <h3 className="m-0 text-[20px] font-black text-text sm:text-[23px]">
              ما عندك حجز حالي
            </h3>

            <p className="mx-auto mt-3 max-w-[500px] text-[12px] font-medium leading-7 text-muted sm:text-[14px]">
              احجز رحلتك أولاً، وبعدها رح تقدر تشوف مسار رحلتك هون.
            </p>

            <button
              type="button"
              onClick={() => navigate("/results")}
              className="mt-6 inline-flex items-center gap-2 rounded-[15px] bg-primary px-6 py-3 text-[11px] font-extrabold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-primary-deep"
            >
              احجز رحلة
              <FiArrowLeft />
            </button>
          </div>
        )}

        {isError && (
          <div className="mx-auto max-w-[760px] rounded-[28px] border border-border bg-surface p-8 text-center shadow-[0_20px_60px_rgba(19,54,72,0.06)]">
            <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-[20px] bg-soft-teal text-primary">
              <FiRefreshCw className="text-2xl" />
            </div>

            <h3 className="m-0 text-[20px] font-black text-text">
              تعذر تحميل الحجز
            </h3>

            <p className="mt-3 text-[12px] font-medium leading-7 text-muted">
              حاول تحديث البيانات مرة ثانية.
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-6 inline-flex items-center gap-2 rounded-[15px] bg-primary px-6 py-3 text-[11px] font-extrabold text-white transition-all duration-300 hover:bg-primary-deep"
            >
              إعادة المحاولة
              <FiRefreshCw />
            </button>
          </div>
        )}

        {booking && origin && destination && (
          <div
            className="overflow-hidden rounded-[30px] border border-border bg-surface shadow-[0_25px_70px_rgba(19,54,72,0.08)]"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible
                ? "translateY(0) scale(1)"
                : "translateY(50px) scale(.97)",
              transition:
                "opacity 1000ms ease 250ms, transform 1100ms cubic-bezier(0.16,1,0.3,1) 250ms",
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-[.8fr_1.2fr]">
              <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10">
                <div>
                  <div className="mb-6 flex items-center gap-2 text-[10px] font-extrabold text-primary sm:text-[11px]">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-soft-teal">
                      <FiNavigation />
                    </span>
                    مسار الرحلة
                  </div>

                  <div className="relative">
                    <div className="absolute right-[11px] top-7 h-[calc(100%-56px)] w-[2px] bg-border" />

                    <div className="relative flex gap-4">
                      <div className="relative z-10 mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border-4 border-surface bg-primary shadow-sm" />

                      <div>
                        <span className="text-[10px] font-bold text-muted">
                          نقطة الانطلاق
                        </span>

                        <h3 className="mt-1 text-[21px] font-black text-text sm:text-[24px]">
                          {origin.name}
                        </h3>
                      </div>
                    </div>

                    <div className="relative mt-10 flex gap-4">
                      <div className="relative z-10 mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border-4 border-surface bg-dark shadow-sm" />

                      <div>
                        <span className="text-[10px] font-bold text-muted">
                          الوجهة
                        </span>

                        <h3 className="mt-1 text-[21px] font-black text-text sm:text-[24px]">
                          {destination.name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-3">
                    <div className="rounded-[18px] bg-surface-alt p-4">
                      <span className="block text-[9px] font-bold text-muted">
                        تاريخ الرحلة
                      </span>
                      <strong className="mt-2 block text-[12px] font-black text-text">
                        {formattedDate || "غير متوفر"}
                      </strong>
                    </div>

                    <div className="rounded-[18px] bg-surface-alt p-4">
                      <span className="block text-[9px] font-bold text-muted">
                        وقت الانطلاق
                      </span>
                      <strong className="mt-2 block text-[12px] font-black text-text">
                        {formattedTime || "غير متوفر"}
                      </strong>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleTracking}
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-[16px] bg-dark px-5 py-4 text-[11px] font-extrabold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-dark-deep"
                >
                  عرض تفاصيل الرحلة
                  <FiArrowLeft />
                </button>
              </div>

              <div className="relative min-h-[390px] overflow-hidden lg:min-h-[500px]">
                {hasCoordinates ? (
                  <MapContainer
                    center={[
                      (originLat + destinationLat) / 2,
                      (originLng + destinationLng) / 2,
                    ]}
                    zoom={6}
                    scrollWheelZoom={false}
                    dragging={true}
                    className="h-full min-h-[390px] w-full lg:min-h-[500px]"
                  >
                    <TileLayer
                      attribution='&copy; OpenStreetMap contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <FitRoute positions={positions} />

                    <Polyline
                      positions={positions}
                      pathOptions={{
                        color: "#0aa99b",
                        weight: 5,
                        opacity: 0.85,
                      }}
                    />

                    <Marker
                      position={[originLat, originLng]}
                      icon={originIcon}
                    >
                      <Popup>{origin.name}</Popup>
                    </Marker>

                    <Marker
                      position={[destinationLat, destinationLng]}
                      icon={destinationIcon}
                    >
                      <Popup>{destination.name}</Popup>
                    </Marker>
                  </MapContainer>
                ) : (
                  <div className="flex h-full min-h-[390px] items-center justify-center bg-surface-alt p-8 text-center lg:min-h-[500px]">
                    <div>
                      <FiMapPin className="mx-auto text-3xl text-primary" />
                      <p className="mt-4 text-[12px] font-bold text-muted">
                        لا تتوفر إحداثيات المدينتين حالياً
                      </p>
                    </div>
                  </div>
                )}

                <div className="pointer-events-none absolute bottom-4 right-4 z-[500] rounded-[14px] bg-surface/95 px-4 py-3 shadow-lg backdrop-blur-md">
                  <div className="flex items-center gap-2 text-[9px] font-bold text-muted">
                    <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                    الانطلاق
                    <span className="mx-1 h-1 w-1 rounded-full bg-border" />
                    <span className="h-2.5 w-2.5 rounded-full bg-dark" />
                    الوجهة
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default TrackingPreview
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaChevronLeft,
  FaTicketAlt,
  FaCheckCircle,
  FaInfoCircle,
  FaPlus,
  FaMapMarkerAlt,
  FaUsers,
  FaWallet,
  FaTimesCircle,
  FaSpinner,
  FaLocationArrow,
} from "react-icons/fa";
import { useMyBookings, useCancelBooking } from "../../hooks/use-bookings";

function TripsPage() {
  const navigate = useNavigate();
  const [selectedBooking, setSelectedBooking] = useState(null);

  const { data, isLoading, isError } = useMyBookings();
  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking();

  const bookings = Array.isArray(data)
    ? data
    : data?.items || data?.bookings || data?.data || [];

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("ar-SY", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleTimeString("ar-SY", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null) return "—";

    return `${Number(price).toLocaleString("ar-SY")} ل.س`;
  };

  const getStatus = (status) => {
    const normalized = String(status || "").toUpperCase();

    if (normalized === "CONFIRMED") {
      return {
        label: "تم تأكيد الحجز",
        className: "bg-soft-teal text-primary-deep",
        icon: <FaCheckCircle size={14} />,
      };
    }

    if (normalized === "PENDING") {
      return {
        label: "قيد المراجعة",
        className: "bg-[#fff2da] text-[#a16c21]",
        icon: <FaInfoCircle size={14} />,
      };
    }

    if (normalized === "CANCELLED") {
      return {
        label: "الحجز ملغي",
        className: "bg-red-50 text-red-500",
        icon: <FaTimesCircle size={14} />,
      };
    }

    if (normalized === "COMPLETED") {
      return {
        label: "الرحلة مكتملة",
        className: "bg-surface-alt text-muted",
        icon: <FaCheckCircle size={14} />,
      };
    }

    return {
      label: status || "حجز",
      className: "bg-surface-alt text-muted",
      icon: <FaInfoCircle size={14} />,
    };
  };

  const handleCancel = (booking) => {
    const bookingId = booking.id || booking.bookingId;

    if (!bookingId) return;

    const confirmed = window.confirm(
      "هل أنت متأكد من رغبتك في إلغاء هذا الحجز؟",
    );

    if (!confirmed) return;

    setSelectedBooking(bookingId);

    cancelBooking(bookingId, {
      onSettled: () => {
        setSelectedBooking(null);
      },
    });
  };

  if (isLoading) {
    return (
      <main dir="rtl" className="min-h-[70vh] bg-bg px-4 py-12">
        <div className="mx-auto flex min-h-[400px] max-w-[760px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
            <p className="text-xs font-bold text-muted">
              جاري تحميل حجوزاتك...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main dir="rtl" className="min-h-[70vh] bg-bg px-4 py-12">
        <div className="mx-auto flex min-h-[400px] max-w-[760px] items-center justify-center">
          <div className="rounded-[20px] border border-border bg-surface px-7 py-8 text-center shadow-custom">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-red-50 text-red-500">
              <FaInfoCircle size={23} />
            </div>

            <h2 className="mb-2 text-lg font-black text-text">
              تعذر تحميل الحجوزات
            </h2>

            <p className="mb-5 text-xs font-bold text-muted">
              حدثت مشكلة أثناء تحميل حجوزاتك، حاول مرة ثانية.
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-xl bg-primary px-5 py-2.5 text-xs font-extrabold text-white transition hover:bg-primary-deep"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main dir="rtl" className="inner-main min-h-[70vh] bg-bg">
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-surface-alt to-bg px-4 pb-11 pt-7">
        <div className="pointer-events-none absolute -left-24 -top-44 h-[350px] w-[350px] rounded-full border border-dashed border-primary/10" />

        <div className="relative mx-auto max-w-[1216px]">
          <div className="mb-5 flex items-center gap-2 text-[11px] font-extrabold text-muted">
            <Link to="/" className="transition hover:text-primary">
              الرئيسية
            </Link>

            <FaChevronLeft size={11} />

            <span className="text-text">حجوزاتي</span>
          </div>

          <span className="text-[11px] font-extrabold text-primary">
            كل رحلاتك بمكان واحد
          </span>

          <h1 className="mb-1 mt-2 text-[30px] font-black tracking-tight text-text sm:text-[40px]">
            تذاكرك <span className="text-primary">دايماً معك.</span>
          </h1>

          <p className="text-xs text-muted sm:text-[13px]">
            راقب حجوزاتك، وارجع لتفاصيل الرحلة وقت ما تحتاج.
          </p>
        </div>
      </section>

      <section className="px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-[1216px]">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-[18px] font-black text-text">
                رحلاتي القادمة
              </h2>

              <p className="mt-0.5 text-[11px] text-muted">
                {bookings.length
                  ? "رحلاتك المحجوزة من سيرنا"
                  : "ما عندك حجوزات حالياً"}
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/results")}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[10px] bg-primary px-4 text-xs font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-primary-deep"
            >
              <FaPlus size={13} />
              حجز جديد
            </button>
          </div>

          {bookings.length === 0 ? (
            <div className="rounded-[20px] border border-border bg-surface px-6 py-12 text-center shadow-custom">
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-soft-teal text-primary">
                <FaTicketAlt size={25} />
              </div>

              <h3 className="mb-2 text-lg font-black text-text">
                ما عندك حجوزات حالياً
              </h3>

              <p className="mx-auto mb-6 max-w-[420px] text-xs font-bold leading-6 text-muted">
                أول ما تحجز رحلة رح تلاقي تفاصيلها وتذكرتك هون.
              </p>

              <button
                type="button"
                onClick={() => navigate("/results")}
                className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs font-extrabold text-white transition hover:bg-primary-deep"
              >
                <FaPlus size={13} />
                احجز رحلتك الأولى
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {bookings.map((booking) => {
                const trip = booking.trip || {};
                const origin = trip.origin || booking.origin || {};
                const destination =
                  trip.destination || booking.destination || {};
                const company = trip.company || booking.company || {};

                const departureAt = trip.departureAt || booking.departureAt;

                const arrivalAt = trip.arrivalAt || booking.arrivalAt;

                const seats = booking.seats || booking.bookingSeats || [];

                const seatNumbers = Array.isArray(seats)
                  ? seats
                      .map((seat) => seat.seatNumber ?? seat.number ?? seat)
                      .join("، ")
                  : booking.seatNumber || "—";

                const bookingId =
                  booking.id || booking.bookingId || booking.code;

                const status = getStatus(
                  booking.status || booking.bookingStatus,
                );

                const bookingStatus = String(
                  booking.status || booking.bookingStatus || "",
                ).toUpperCase();

                const isCancelled = bookingStatus === "CANCELLED";

                const isCompleted = bookingStatus === "COMPLETED";

                const isCancellingThis =
                  isCancelling && selectedBooking === bookingId;

                return (
                  <article
                    key={bookingId}
                    className="overflow-hidden rounded-[19px] border border-border bg-surface"
                  >
                    <div className="flex items-center justify-between gap-4 border-b border-dashed border-border bg-surface-alt px-5 py-4 sm:px-6">
                      <div className="flex items-center gap-2.5">
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-soft-teal text-primary">
                          <FaTicketAlt size={17} />
                        </span>

                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-muted">
                            رقم الحجز
                          </span>

                          <b
                            dir="ltr"
                            className="text-[13px] font-black text-text"
                          >
                            {bookingId || "—"}
                          </b>
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-extrabold ${status.className}`}
                      >
                        {status.icon}
                        {status.label}
                      </span>
                    </div>

                    <div className="grid gap-6 px-5 py-7 sm:grid-cols-[1.1fr_1fr] sm:px-6">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-col">
                          <small className="mb-1 text-[10px] text-muted">
                            من
                          </small>

                          <h3 className="text-[20px] font-black text-text">
                            {origin.name || "—"}
                          </h3>

                          <b className="mt-1 text-xs text-text">
                            {formatTime(departureAt)}
                          </b>
                        </div>

                        <div className="flex flex-1 flex-col items-center gap-1.5 text-primary">
                          <FaLocationArrow size={17} />

                          <div className="w-full border-t border-dashed border-border" />

                          <small className="whitespace-nowrap text-[9px] text-muted">
                            {formatDate(departureAt)}
                          </small>
                        </div>

                        <div className="flex flex-col">
                          <small className="mb-1 text-[10px] text-muted">
                            إلى
                          </small>

                          <h3 className="text-[20px] font-black text-text">
                            {destination.name || "—"}
                          </h3>

                          <b className="mt-1 text-xs text-text">
                            {formatTime(arrivalAt)}
                          </b>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2.5 border-r-0 sm:border-r sm:border-border sm:pr-6">
                        <span className="flex items-center gap-2 text-[11px] font-bold text-muted">
                          <FaMapMarkerAlt size={14} className="text-primary" />
                          {company.name || "شركة النقل"}
                        </span>

                        <span className="flex items-center gap-2 text-[11px] font-bold text-muted">
                          <FaUsers size={14} className="text-primary" />
                          المقاعد: {seatNumbers || "—"}
                        </span>

                        <span className="flex items-center gap-2 text-[11px] font-bold text-muted">
                          <FaWallet size={14} className="text-primary" />
                          {formatPrice(
                            booking.total || booking.totalPrice || trip.price,
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 border-t border-border px-5 py-4 sm:flex-row sm:px-6">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/tracking?bookingId=${bookingId}`)
                        }
                        className="inline-flex min-h-[39px] items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 text-[11px] font-extrabold text-text transition hover:-translate-y-0.5 hover:border-primary hover:text-primary"
                      >
                        <FaLocationArrow size={14} />
                        تتبّع الرحلة
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          navigate("/success", {
                            state: {
                              booking,
                              trip,
                              selectedSeats: seats,
                            },
                          })
                        }
                        className="inline-flex min-h-[39px] items-center justify-center gap-2 rounded-xl bg-surface-alt px-4 text-[11px] font-extrabold text-text transition hover:-translate-y-0.5 hover:bg-soft-teal hover:text-primary"
                      >
                        <FaTicketAlt size={15} />
                        عرض التذكرة
                      </button>

                      {!isCancelled && !isCompleted && (
                        <button
                          type="button"
                          onClick={() => handleCancel(booking)}
                          disabled={isCancellingThis}
                          className="inline-flex min-h-[39px] items-center justify-center gap-2 rounded-xl px-4 text-[11px] font-extrabold text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 sm:mr-auto"
                        >
                          {isCancellingThis ? (
                            <>
                              <FaSpinner size={14} className="animate-spin" />
                              جاري الإلغاء...
                            </>
                          ) : (
                            <>
                              <FaTimesCircle size={14} />
                              إلغاء الحجز
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default TripsPage;

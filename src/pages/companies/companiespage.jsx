import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheck,
  FiMapPin,
  FiSearch,
  FiStar,
  FiWifi,
  FiZap,
  FiTruck,
} from "react-icons/fi";
import { FaBus } from "react-icons/fa";
import { BsSnow, BsStars } from "react-icons/bs";
import { useGetCompanies } from "../../hooks/use-companies";

const companyDetails = {
  1: {
    short: "ش",
    color: "#109d9c",
    background: "#e7f9f6",
    rating: "4.9",
    tag: "الأعلى تقييماً",
    about: "رحلات منتظمة بين المحافظات وتجربة سفر مريحة وواضحة.",
    features: [
      { label: "مكيّف", icon: BsSnow },
      { label: "Wi-Fi", icon: FiWifi },
      { label: "شحن USB", icon: FiZap },
    ],
    destinations: "+12",
    schedule: "يومياً",
  },

  2: {
    short: "ف",
    color: "#e69a46",
    background: "#fff3df",
    rating: "4.8",
    tag: "الأكثر حجزاً",
    about: "أسطول حديث ومواعيد متنوعة تناسب مختلف أوقات السفر.",
    features: [
      { label: "مكيّف", icon: BsSnow },
      { label: "مقاعد واسعة", icon: FaBus },
    ],
    destinations: "+10",
    schedule: "يومياً",
  },

  3: {
    short: "ن",
    color: "#5085e6",
    background: "#e9efff",
    rating: "4.7",
    tag: "سعر مميّز",
    about: "رحلات يومية وخيارات مناسبة للمسافرين بين المدن السورية.",
    features: [
      { label: "مكيّف", icon: BsSnow },
      { label: "Wi-Fi", icon: FiWifi },
    ],
    destinations: "+9",
    schedule: "يومياً",
  },

  4: {
    short: "ا",
    color: "#9969ce",
    background: "#f1eafe",
    rating: "4.6",
    tag: "مواعيد مرنة",
    about: "ربط المدن السورية بمواعيد مرنة وتجربة حجز سهلة.",
    features: [
      { label: "مكيّف", icon: BsSnow },
      { label: "شحن USB", icon: FiZap },
    ],
    destinations: "+8",
    schedule: "يومياً",
  },
};

const defaultDetails = {
  short: "س",
  color: "#109d9c",
  background: "#e7f9f6",
  rating: "4.8",
  tag: "شركة نقل",
  about: "رحلات بين المدن السورية وتجربة سفر سهلة ومريحة.",
  features: [
    { label: "مكيّف", icon: BsSnow },
    { label: "مقاعد واسعة", icon: FaBus },
  ],
  destinations: "+8",
  schedule: "يومياً",
};

function CompaniesPage() {
  const navigate = useNavigate();

  const heroRef = useRef(null);
  const companiesRef = useRef(null);
  const ctaRef = useRef(null);

  const [heroVisible, setHeroVisible] = useState(false);
  const [companiesVisible, setCompaniesVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);

  const {
    data: companies = [],
    isLoading,
    isError,
    refetch,
  } = useGetCompanies();

  useEffect(() => {
    const observers = [];

    const createObserver = (element, setter, threshold = 0.15) => {
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setter(true);
            observer.disconnect();
          }
        },
        {
          threshold,
          rootMargin: "0px 0px -70px 0px",
        },
      );

      observer.observe(element);
      observers.push(observer);
    };

    createObserver(heroRef.current, setHeroVisible, 0.1);
    createObserver(companiesRef.current, setCompaniesVisible, 0.12);
    createObserver(ctaRef.current, setCtaVisible, 0.15);

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return (
    <main dir="rtl" className="overflow-hidden bg-bg">
      {/* =========================================================
          Animated company card border
      ========================================================== */}
      <style>{`
        .company-card {
          position: relative;
          isolation: isolate;
        }

        .company-card::before {
          content: "";
          position: absolute;
          inset: -2px;
          border-radius: 26px;

          background: conic-gradient(
            from 0deg,
            transparent 0deg,
            transparent 285deg,
            rgba(10, 169, 155, 0.05) 305deg,
            rgba(10, 169, 155, 0.22) 325deg,
            rgba(10, 169, 155, 0.55) 342deg,
            rgba(10, 169, 155, 1) 355deg,
            rgba(10, 169, 155, 0.35) 360deg
          );

          animation: companyBorderSpin 3.2s linear infinite;

          z-index: -2;
          pointer-events: none;
        }

        .company-card::after {
          content: "";
          position: absolute;
          inset: 1px;
          border-radius: 23px;

          background: var(--surface, #ffffff);

          z-index: -1;
          pointer-events: none;
        }

        @keyframes companyBorderSpin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .company-card::before {
            animation: none;
          }
        }
      `}</style>

      {/* =========================================================
          Hero
      ========================================================== */}
      <section
        ref={heroRef}
        className="relative overflow-hidden border-b border-border bg-gradient-to-bl from-surface-alt via-bg to-bg px-5 pb-[65px] pt-[65px] sm:px-7 sm:pb-[80px] sm:pt-[80px] lg:pb-[95px] lg:pt-[90px]"
      >
        <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full border border-primary/10" />

        <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full border border-primary/10" />

        <div className="pointer-events-none absolute -right-28 bottom-[-100px] h-80 w-80 rounded-full bg-soft-teal opacity-70 blur-3xl" />

        <div className="relative mx-auto w-full max-w-[1216px]">
          <div
            className="mb-5 flex items-center gap-2 text-[10px] font-bold text-muted sm:text-[11px]"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(-20px)",
              transition:
                "opacity 800ms ease, transform 900ms cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <button
              type="button"
              onClick={() => navigate("/")}
              className="transition-colors duration-300 hover:text-primary"
            >
              الرئيسية
            </button>

            <FiArrowLeft className="text-[11px]" />

            <span className="text-text">شركات النقل</span>
          </div>

          <div className="max-w-[720px]">
            <div
              className="mb-4 inline-flex items-center gap-2 rounded-full bg-soft-teal px-4 py-2 text-[10px] font-extrabold text-primary sm:text-[11px]"
              style={{
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible
                  ? "translateY(0) scale(1)"
                  : "translateY(20px) scale(.9)",
                transition:
                  "opacity 800ms ease 150ms, transform 900ms cubic-bezier(0.16,1,0.3,1) 150ms",
              }}
            >
              <BsStars className="text-sm" />
              <span>شركاء الطريق</span>
            </div>

            <h1
              className="m-0 text-[36px] font-black leading-[1.35] tracking-[-1px] text-text sm:text-[48px] lg:text-[58px]"
              style={{
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible
                  ? "translateY(0) scale(1)"
                  : "translateY(45px) scale(.94)",
                transition:
                  "opacity 1000ms ease 300ms, transform 1100ms cubic-bezier(0.16,1,0.3,1) 300ms",
              }}
            >
              شركات بتوصلك
              <span className="bg-gradient-to-l from-primary-deep to-primary bg-clip-text text-transparent">
                {" "}
                لوين ما بدك.
              </span>
            </h1>

            <p
              className="mt-4 max-w-[650px] text-[12px] font-medium leading-8 text-muted sm:text-[14px] lg:text-[15px]"
              style={{
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? "translateY(0)" : "translateY(25px)",
                transition:
                  "opacity 900ms ease 500ms, transform 1000ms cubic-bezier(0.16,1,0.3,1) 500ms",
              }}
            >
              تعرّف على شركات النقل الموجودة على سيرنا واختار الخيار الأنسب إلك
              قبل ما تبدأ رحلتك.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          Companies
      ========================================================== */}
      <section
        ref={companiesRef}
        className="relative bg-bg px-5 py-[75px] sm:px-7 sm:py-[100px] lg:py-[115px]"
      >
        <div className="mx-auto w-full max-w-[1216px]">
          <div
            className="mb-10 flex items-end justify-between gap-5 sm:mb-12"
            style={{
              opacity: companiesVisible ? 1 : 0,
              transform: companiesVisible
                ? "translateY(0)"
                : "translateY(35px)",
              transition:
                "opacity 900ms ease, transform 1000ms cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <div>
              <div
                className="mb-3 inline-flex items-center gap-2 rounded-full bg-soft-teal px-3.5 py-1.5 text-[9px] font-extrabold text-primary"
                style={{
                  opacity: companiesVisible ? 1 : 0,
                  transform: companiesVisible
                    ? "translateY(0) scale(1)"
                    : "translateY(15px) scale(.9)",
                  transition:
                    "opacity 700ms ease 100ms, transform 800ms cubic-bezier(0.16,1,0.3,1) 100ms",
                }}
              >
                <FiMapPin />
                <span>خياراتك على الطريق</span>
              </div>

              <h2
                className="m-0 text-[28px] font-black leading-[1.3] tracking-[-1px] text-text sm:text-[38px]"
                style={{
                  opacity: companiesVisible ? 1 : 0,
                  transform: companiesVisible
                    ? "translateY(0)"
                    : "translateY(25px)",
                  transition:
                    "opacity 800ms ease 250ms, transform 900ms cubic-bezier(0.16,1,0.3,1) 250ms",
                }}
              >
                اختار الشركة
                <span className="text-primary"> اللي بتفضّلها</span>
              </h2>
            </div>

            {!isLoading && !isError && (
              <div
                className="hidden items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-[10px] font-bold text-muted sm:flex"
                style={{
                  opacity: companiesVisible ? 1 : 0,
                  transform: companiesVisible
                    ? "translateX(0)"
                    : "translateX(-20px)",
                  transition:
                    "opacity 800ms ease 400ms, transform 900ms ease 400ms",
                }}
              >
                <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_0_4px_rgba(10,169,155,0.1)]" />
                {companies.length} شركات متاحة
              </div>
            )}
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[405px] animate-pulse rounded-[24px] border border-border bg-surface p-5"
                >
                  <div className="h-[68px] w-[68px] rounded-[19px] bg-surface-alt" />

                  <div className="mt-6 h-5 w-2/3 rounded bg-surface-alt" />

                  <div className="mt-4 h-3 w-full rounded bg-surface-alt" />

                  <div className="mt-3 h-3 w-4/5 rounded bg-surface-alt" />

                  <div className="mt-8 h-10 rounded bg-surface-alt" />

                  <div className="mt-4 h-10 rounded bg-surface-alt" />

                  <div className="mt-4 h-11 rounded bg-surface-alt" />
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {isError && (
            <div
              className="flex flex-col items-center justify-center rounded-[24px] border border-border bg-surface px-5 py-14 text-center shadow-[0_15px_55px_rgba(19,54,72,0.05)]"
              style={{
                opacity: companiesVisible ? 1 : 0,
                transform: companiesVisible
                  ? "translateY(0)"
                  : "translateY(40px)",
                transition:
                  "opacity 900ms ease 300ms, transform 1000ms cubic-bezier(0.16,1,0.3,1) 300ms",
              }}
            >
              <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-soft-teal text-primary">
                <FiTruck className="text-2xl" />
              </div>

              <h3 className="text-base font-black text-text">
                ما قدرنا نحمل شركات النقل
              </h3>

              <p className="mt-2 text-xs leading-6 text-muted">
                صار خطأ أثناء الاتصال بالخادم، حاولي مرة ثانية.
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                className="mt-5 rounded-xl bg-primary px-6 py-3 text-xs font-extrabold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-primary-deep"
              >
                إعادة المحاولة
              </button>
            </div>
          )}

          {/* Empty */}
          {!isLoading && !isError && companies.length === 0 && (
            <div
              className="rounded-[24px] border border-border bg-surface px-5 py-14 text-center shadow-[0_15px_55px_rgba(19,54,72,0.05)]"
              style={{
                opacity: companiesVisible ? 1 : 0,
                transform: companiesVisible
                  ? "translateY(0)"
                  : "translateY(40px)",
                transition:
                  "opacity 900ms ease 300ms, transform 1000ms cubic-bezier(0.16,1,0.3,1) 300ms",
              }}
            >
              <FiTruck className="mx-auto text-3xl text-primary" />

              <h3 className="mt-4 text-base font-black text-text">
                لا توجد شركات نقل حالياً
              </h3>

              <p className="mt-2 text-xs text-muted">
                ستظهر الشركات هنا عند توفرها.
              </p>
            </div>
          )}

          {/* Companies Cards */}
          {!isLoading && !isError && companies.length > 0 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {companies.map((company, index) => {
                const details = companyDetails[company.id] || defaultDetails;

                const short =
                  company.name?.trim()?.charAt(0) || details.short || "س";

                return (
                  <article
                    key={company.id}
                    className="company-card group relative overflow-hidden rounded-[24px] border border-border bg-surface p-5 shadow-[0_15px_55px_rgba(19,54,72,0.055)] transition-all duration-500 hover:-translate-y-3 hover:border-primary/25 hover:shadow-[0_25px_65px_rgba(19,54,72,0.11)]"
                    style={{
                      opacity: companiesVisible ? 1 : 0,
                      transform: companiesVisible
                        ? "translateY(0) scale(1)"
                        : "translateY(70px) scale(.92)",
                      transition: `opacity 900ms ease ${
                        index * 180 + 450
                      }ms, transform 1100ms cubic-bezier(0.16,1,0.3,1) ${
                        index * 180 + 450
                      }ms`,
                    }}
                  >
                    {/* Company glow */}
                    <div
                      className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full opacity-0 blur-3xl transition-all duration-700 group-hover:scale-150 group-hover:opacity-100"
                      style={{
                        backgroundColor: details.background,
                      }}
                    />

                    <div className="relative">
                      {/* Logo + Rating */}
                      <div className="flex items-start justify-between gap-3">
                        <div
                          className="grid h-[68px] w-[68px] shrink-0 place-items-center overflow-hidden rounded-[19px] text-[30px] font-black shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                          style={{
                            color: details.color,
                            backgroundColor: details.background,
                          }}
                        >
                          {company.logoUrl ? (
                            <img
                              src={company.logoUrl}
                              alt={company.name}
                              className="h-full w-full object-contain p-2"
                            />
                          ) : (
                            short
                          )}
                        </div>

                        <span
                          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[8px] font-extrabold transition-transform duration-500 group-hover:-translate-y-1"
                          style={{
                            color: details.color,
                            backgroundColor: details.background,
                          }}
                        >
                          <FiStar className="fill-current text-[10px]" />
                          {details.rating}
                        </span>
                      </div>

                      {/* Company info */}
                      <div className="mt-6">
                        <div className="flex items-center gap-2">
                          <h3 className="m-0 text-[17px] font-black text-text transition-all duration-300 group-hover:translate-x-[-3px] group-hover:text-primary">
                            {company.name}
                          </h3>

                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary transition-transform duration-300 group-hover:scale-150" />
                        </div>

                        <div className="mt-1 text-[9px] font-extrabold text-primary">
                          {details.tag}
                        </div>

                        <p className="mt-3 min-h-[68px] text-[11px] font-medium leading-7 text-muted">
                          {details.about}
                        </p>
                      </div>

                      {/* Features */}
                      <div className="mt-4 flex min-h-[31px] flex-wrap gap-1.5">
                        {details.features.map((feature, featureIndex) => {
                          const Icon = feature.icon;

                          return (
                            <span
                              key={feature.label}
                              className="inline-flex items-center gap-1 rounded-lg bg-surface-alt px-2 py-1.5 text-[8px] font-bold text-muted transition-all duration-300 group-hover:bg-soft-teal group-hover:text-primary"
                              style={{
                                transitionDelay: `${featureIndex * 60}ms`,
                              }}
                            >
                              <Icon className="text-[10px]" />
                              {feature.label}
                            </span>
                          );
                        })}
                      </div>

                      {/* Stats */}
                      <div className="my-5 grid grid-cols-2 gap-3 border-y border-border py-4">
                        <div>
                          <strong className="block text-[17px] font-black text-text">
                            {details.destinations}
                          </strong>

                          <span className="text-[8px] font-bold text-muted">
                            وجهة تجريبية
                          </span>
                        </div>

                        <div className="border-r border-border pr-3">
                          <strong className="block text-[15px] font-black text-text">
                            {details.schedule}
                          </strong>

                          <span className="text-[8px] font-bold text-muted">
                            مواعيد تجريبية
                          </span>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="mb-4 flex items-center gap-2 text-[9px] font-bold">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            company.isActive ? "bg-primary" : "bg-gray-400"
                          }`}
                        />

                        <span
                          className={
                            company.isActive ? "text-primary" : "text-muted"
                          }
                        >
                          {company.isActive
                            ? "متاحة حالياً"
                            : "غير متاحة حالياً"}
                        </span>
                      </div>

                      {/* Button */}
                      <button
                        type="button"
                        disabled={!company.isActive}
                        onClick={() =>
                          navigate(`/results?companyId=${company.id}`)
                        }
                        className="group/button flex min-h-[42px] w-full items-center justify-center gap-2 rounded-[12px] border border-border bg-surface text-[9px] font-extrabold text-text transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:border-border disabled:hover:bg-surface disabled:hover:text-text"
                      >
                        عرض رحلات الشركة
                        <FiArrowLeft className="text-[12px] transition-transform duration-300 group-hover/button:-translate-x-1" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Info */}
          <div
            className="mt-7 flex items-start gap-3 rounded-[16px] border border-border bg-surface px-4 py-3.5"
            style={{
              opacity: companiesVisible ? 1 : 0,
              transform: companiesVisible
                ? "translateY(0)"
                : "translateY(30px)",
              transition:
                "opacity 900ms ease 1250ms, transform 1000ms cubic-bezier(0.16,1,0.3,1) 1250ms",
            }}
          >
            <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-soft-teal text-primary">
              <FiCheck className="text-[13px]" />
            </div>

            <p className="m-0 text-[9px] font-medium leading-6 text-muted sm:text-[10px]">
              أسماء الشركات ومعرّفاتها وشعاراتها وحالة توفرها مأخوذة من بيانات
              النظام الفعلية. أما التقييمات والخدمات والوجهات والمواعيد فهي
              بيانات توضيحية للتصميم وليست معلومات مؤكدة من الـ API.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          CTA
      ========================================================== */}
      <section
        ref={ctaRef}
        className="relative overflow-hidden bg-surface px-5 pb-[90px] pt-[25px] sm:px-7 sm:pb-[110px]"
      >
        <div className="mx-auto w-full max-w-[1216px]">
          <div
            className="relative overflow-hidden rounded-[28px] bg-dark px-6 py-9 text-center shadow-[0_25px_70px_rgba(16,58,78,0.13)] sm:rounded-[32px] sm:px-10 sm:py-11"
            style={{
              opacity: ctaVisible ? 1 : 0,
              transform: ctaVisible
                ? "translateY(0) scale(1)"
                : "translateY(60px) scale(.96)",
              transition:
                "opacity 1000ms ease, transform 1100ms cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <div className="pointer-events-none absolute -right-24 -top-24 h-60 w-60 rounded-full bg-primary/15 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-28 -left-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

            <div className="relative">
              <div
                className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[9px] font-extrabold text-primary"
                style={{
                  opacity: ctaVisible ? 1 : 0,
                  transform: ctaVisible
                    ? "translateY(0) scale(1)"
                    : "translateY(15px) scale(.9)",
                  transition:
                    "opacity 700ms ease 200ms, transform 800ms ease 200ms",
                }}
              >
                <BsStars />
                جاهز للرحلة؟
              </div>

              <h2
                className="m-0 text-[27px] font-black leading-[1.4] text-white sm:text-[36px]"
                style={{
                  opacity: ctaVisible ? 1 : 0,
                  transform: ctaVisible ? "translateY(0)" : "translateY(25px)",
                  transition:
                    "opacity 800ms ease 350ms, transform 900ms cubic-bezier(0.16,1,0.3,1) 350ms",
                }}
              >
                اختار رحلتك
                <span className="text-primary"> وابدأ الطريق</span>
              </h2>

              <p
                className="mx-auto mt-3 max-w-[500px] text-[10px] font-medium leading-7 text-white/55 sm:text-[12px]"
                style={{
                  opacity: ctaVisible ? 1 : 0,
                  transform: ctaVisible ? "translateY(0)" : "translateY(20px)",
                  transition:
                    "opacity 800ms ease 500ms, transform 900ms ease 500ms",
                }}
              >
                قارن بين الرحلات المتاحة واختار الشركة والوقت المناسبين إلك.
              </p>

              <button
                type="button"
                onClick={() => navigate("/results")}
                className="group mt-5 inline-flex items-center gap-3 rounded-[13px] bg-primary px-6 py-3.5 text-[10px] font-extrabold text-white shadow-[0_10px_25px_rgba(10,169,155,0.18)] transition-all duration-300 hover:-translate-y-1 hover:bg-primary-deep"
              >
                <FiSearch />
                ابحث عن رحلتك
                <FiArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default CompaniesPage;

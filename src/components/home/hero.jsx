
import { useEffect, useState } from "react";
import { BsStars } from "react-icons/bs";
import { CiCircleCheck, CiLocationOn } from "react-icons/ci";
import { FaRegCircleCheck } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import masged from "../../assets/image/image.jpg";

function Hero() {
  const navigate = useNavigate();

  const [isLoaded, setIsLoaded] = useState(false);
  const [floatingY, setFloatingY] = useState(0);

  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let animationFrame;
    let startTime;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;

      const elapsed = timestamp - startTime;
      setFloatingY(Math.sin(elapsed / 1000) * 8);

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  useEffect(() => {
    const handleMouseMove = (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;

      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section
      dir="rtl"
      className="relative min-h-screen w-full overflow-hidden bg-bg"
    >
      <div
        className={`
          absolute inset-0 z-0 overflow-hidden
          transition-all duration-[3000ms]
          ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isLoaded ? "scale-100 opacity-100" : "scale-[0.94] opacity-0"}
        `}
      >
        <img
          src={masged}
          alt="سيرنا"
          className="
            absolute inset-0
            h-full w-full
            object-cover
            transition-transform
            duration-[3500ms]
            ease-[cubic-bezier(0.16,1,0.3,1)]
          "
          style={{
            transform: `
              scale(${isLoaded ? 1.06 : 1.16})
              translate(
                ${mousePosition.x * -4}px,
                ${mousePosition.y * -4}px
              )
            `,
          }}
        />

        <div className="absolute inset-0 bg-black/30" />

        <div
          className="
            absolute inset-0
            bg-gradient-to-l
            from-black/75
            via-black/40
            to-black/10
          "
        />

        <div
          className="
            absolute inset-0
            bg-gradient-to-t
            from-black/55
            via-transparent
            to-black/10
          "
        />
      </div>

      <div
        className="
          relative z-10 mx-auto flex min-h-screen w-full
          max-w-[1216px] items-center
          px-5 py-24 sm:px-8 lg:px-10
        "
      >
        <div
          className="
            grid w-full grid-cols-1 items-center
            gap-14 lg:grid-cols-[1.05fr_.95fr] lg:gap-16
          "
        >
          <div className="order-1 text-right text-white lg:order-1">
            <div
              className={`
                mb-5 inline-flex items-center gap-2
                rounded-full border border-white/20
                bg-white/10 px-4 py-2
                text-[12px] font-extrabold
                text-white backdrop-blur-md
                transition-all duration-[1200ms] ease-out
                ${
                  isLoaded
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }
              `}
              style={{ transitionDelay: "500ms" }}
            >
              <BsStars className="text-primary" />
              <span>اهلا فيك بسيرنا</span>
            </div>

            <h1
              className={`
                max-w-[760px]
                text-[38px] font-black
                leading-[1.1] tracking-[-1.5px]
                transition-all
                duration-[1500ms]
                ease-[cubic-bezier(0.16,1,0.3,1)]
                sm:text-[46px]
                md:text-[54px]
                lg:text-[64px]
                ${
                  isLoaded
                    ? "translate-y-0 opacity-100"
                    : "translate-y-12 opacity-0"
                }
              `}
              style={{ transitionDelay: "750ms" }}
            >
              المحطة الجاية؟
              <span
                className="
                  mt-2 block
                  bg-gradient-to-l
                  from-[#15ba9d] to-[#078a91]
                  bg-clip-text text-transparent
                "
              >
                .على كيفك
              </span>
            </h1>

            <p
              className={`
                mt-7 max-w-[620px]
                text-[14px] font-medium
                leading-[2] text-white/80
                transition-all duration-[1400ms] ease-out
                sm:text-[16px]
                ${
                  isLoaded
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }
              `}
              style={{ transitionDelay: "1000ms" }}
            >
              من حلب لدمشق، ومن الساحل للجزيرة...
              <br />
              سيرنا بتخليك تلاقي رحلتك وتحجزها بسهولة، بسرعة، وبدون تعقيد.
            </p>

            <div
              className={`
                mt-7 grid max-w-[580px]
                grid-cols-1 gap-3
                transition-all duration-[1400ms]
                sm:grid-cols-3
                ${
                  isLoaded
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }
              `}
              style={{ transitionDelay: "1200ms" }}
            >
              <div className="flex items-center gap-2 text-[12px] font-extrabold text-white/90">
                <CiCircleCheck className="text-[20px] text-primary" />
                <span>حجز سهل</span>
              </div>

              <div className="flex items-center gap-2 text-[12px] font-extrabold text-white/90">
                <CiCircleCheck className="text-[20px] text-primary" />
                <span>خيارات متعددة</span>
              </div>

              <div className="flex items-center gap-2 text-[12px] font-extrabold text-white/90">
                <CiCircleCheck className="text-[20px] text-primary" />
                <span>تجربة واضحة</span>
              </div>
            </div>

            <div
              className={`
                mt-8 flex items-center gap-4
                transition-all duration-[1400ms]
                ${
                  isLoaded
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }
              `}
              style={{ transitionDelay: "1400ms" }}
            >
              <div className="flex -space-x-3 space-x-reverse">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#d9eee9] text-xs font-black text-dark">
                  س
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#dce8ef] text-xs font-black text-dark">
                  أ
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#f2e4d8] text-xs font-black text-dark">
                  م
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-primary text-xs font-black text-white">
                  +
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black">4.9/5</span>

                  <div className="flex gap-1 text-primary">
                    <FaRegCircleCheck />
                    <FaRegCircleCheck />
                    <FaRegCircleCheck />
                  </div>
                </div>

                <p className="mt-1 text-[11px] font-semibold text-white/60">
                  تجربة مستخدمين سيرنا
                </p>
              </div>
            </div>

            <div
              className={`
                mt-9 transition-all duration-[1500ms]
                ${
                  isLoaded
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }
              `}
              style={{ transitionDelay: "1600ms" }}
            >
              <button
                type="button"
                onClick={() => navigate("/results")}
                className="
                  inline-flex min-h-[52px]
                  items-center justify-center
                  rounded-xl bg-primary
                  px-7 text-[13px]
                  font-black text-white
                  shadow-lg shadow-black/10
                  transition-all duration-500
                  hover:-translate-y-1
                  hover:bg-primary-deep
                  hover:shadow-xl
                  active:translate-y-0
                  active:scale-[0.98]
                "
              >
                احجز رحلتك
              </button>
            </div>
          </div>

          <div className="order-2 flex justify-center lg:order-2">
            <div
              className={`
                relative w-full max-w-[500px]
                transition-all
                duration-[1800ms]
                ease-[cubic-bezier(0.16,1,0.3,1)]
                ${
                  isLoaded
                    ? "translate-y-0 scale-100 opacity-100"
                    : "translate-y-12 scale-[0.92] opacity-0"
                }
              `}
              style={{ transitionDelay: "750ms" }}
            >
              <div
                className="relative w-full overflow-visible"
                style={{
                  transform: `
                    translate(
                      ${mousePosition.x * 3}px,
                      ${mousePosition.y * 3}px
                    )
                  `,
                  transition: "transform 0.5s ease-out",
                }}
              >
                <div className="relative overflow-hidden rounded-[28px] shadow-[0_25px_70px_rgba(19,54,72,0.25)]">
                  <img
                    src={masged}
                    alt="رحلات سيرنا"
                    className="
                      block aspect-[1.55/1]
                      h-full w-full
                      object-cover
                      transition-transform
                      duration-[3200ms]
                      ease-[cubic-bezier(0.16,1,0.3,1)]
                    "
                    style={{
                      transform: `
                        scale(${isLoaded ? 1.03 : 1.13})
                        translate(
                          ${mousePosition.x * -2}px,
                          ${mousePosition.y * -2}px
                        )
                      `,
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  <div className="absolute bottom-4 right-4 rounded-xl bg-black/45 px-3 py-2 backdrop-blur-md">
                    <p className="text-[9px] font-bold text-white/70">
                      رحلتك تبدأ من هون
                    </p>

                    <p className="mt-0.5 text-[11px] font-black text-white">
                      من حلب إلى دمشق
                    </p>
                  </div>
                </div>

                <div
                  className="
                    absolute -left-5 top-8 z-10
                    flex items-center gap-2
                    rounded-xl border border-white
                    bg-white px-3 py-2.5
                    shadow-[0_12px_30px_rgba(19,54,72,0.14)]
                  "
                  style={{
                    transform: `translateY(${floatingY}px)`,
                  }}
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-soft-teal text-primary">
                    <CiLocationOn className="text-[17px]" />
                  </div>

                  <div>
                    <p className="text-[8px] font-bold text-muted">
                      14 محافظة
                    </p>

                    <p className="mt-0.5 text-[8px] font-extrabold text-text">
                      وجهتك علينا
                    </p>
                  </div>
                </div>

                <div
                  className="
                    absolute -right-5 bottom-14 z-10
                    flex items-center gap-2
                    rounded-xl border border-white
                    bg-white px-3 py-2.5
                    shadow-[0_12px_30px_rgba(19,54,72,0.14)]
                  "
                  style={{
                    transform: `translateY(${-floatingY}px)`,
                  }}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-soft-teal text-primary">
                    <CiCircleCheck className="text-xl" />
                  </div>

                  <div>
                    <p className="text-[8px] font-bold text-muted">
                      الوجهة
                    </p>

                    <p className="mt-1 text-[11px] font-black text-text">
                      دمشق
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`
          pointer-events-none
          absolute bottom-6 left-1/2 z-20
          -translate-x-1/2
          transition-all duration-[1800ms]
          ${
            isLoaded
              ? "translate-y-0 opacity-100"
              : "translate-y-5 opacity-0"
          }
        `}
        style={{ transitionDelay: "2000ms" }}
      >
        <div className="flex flex-col items-center gap-2 text-white/60">
          <span className="text-[9px] font-bold">اكتشف رحلتك</span>

          <div className="h-8 w-[1px] animate-pulse bg-white/40" />
        </div>
      </div>
    </section>
  );
}

export default Hero;

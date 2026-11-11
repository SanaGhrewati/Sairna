import { useEffect, useRef, useState } from "react"
import { FiArrowLeft, FiArrowRight, FiMapPin } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import { useGetCities } from "../../hooks/use-cities"
import aleppoImage from "../../assets/image/cities/aleppo.jpg"
import damascusImage from "../../assets/image/cities/damascus.jpg"
import homsImage from "../../assets/image/cities/homs.jpg"
import latakiaImage from "../../assets/image/cities/latakia.jpg"

function DestinationCards() {
  const { data: cities = [], isLoading, isError } = useGetCities()
  const [activeIndex, setActiveIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const sectionRef = useRef(null)
  const navigate = useNavigate()

  const cityImages = {
    1: damascusImage,
    2: aleppoImage,
    3: homsImage,
    4: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Norias_of_Hama%2C_Syria.jpg",
    5: latakiaImage,
    6: "https://humbo.s3.eu-north-1.amazonaws.com/place-photo/602c30f41d1403d8e9e5dcd3/NWt9OWP740.jpeg",
    7: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Idlib_Bab-Al-Hawa_Expressway_-_Idlib_Entrance.jpg",
    8: "https://upload.wikimedia.org/wikipedia/commons/2/27/Deir_Ez-Zor_suspension_bridge9903.jpg",
    9: "https://upload.wikimedia.org/wikipedia/commons/3/30/ArRaqqahEuphrates.jpg",
    10: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Hasakah%2Ccitadel.jpg",
    11: "https://upload.wikimedia.org/wikipedia/commons/b/b5/317-A5_23_Deraa_20000913.jpg",
    12: "https://d2udx5iz3h7s4h.cloudfront.net/uploads/image/1756159537312-9fqtv-b121ca3c2d1a04f159e8a469bf2071452df00828caa40f7832c395f6ab3353be.JPG",
    13: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Al_Quneitra_-_Flickr_-_edbrambley.jpg",
    14: "https://upload.wikimedia.org/wikipedia/commons/2/2c/St._Thecla_Monastery%2C_Ma%27loula%2C_Syria.jpg",
  }

  const destinationCities = cities.map((city) => ({
    ...city,
    image: cityImages[city.id],
  }))

  const safeActiveIndex = destinationCities.length > 0 ? Math.min(activeIndex, destinationCities.length - 1) : 0

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
      { threshold: 0.15, rootMargin: "0px 0px -80px 0px" }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  const nextSlide = () => {
    if (!destinationCities.length) return
    setActiveIndex((current) => (current + 1) % destinationCities.length)
    setMouse({ x: 0, y: 0 })
  }

  const prevSlide = () => {
    if (!destinationCities.length) return
    setActiveIndex((current) => (current - 1 + destinationCities.length) % destinationCities.length)
    setMouse({ x: 0, y: 0 })
  }

  const getPosition = (index) => {
    if (!destinationCities.length) return 0

    let position = index - safeActiveIndex
    const length = destinationCities.length

    if (position > length / 2) position -= length
    if (position < -length / 2) position += length

    return position
  }

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2

    setMouse({
      x: x * 7,
      y: y * -5,
    })
  }

  const handleMouseLeave = () => {
    setMouse({ x: 0, y: 0 })
  }

  if (isError) return null

  return (
    <section ref={sectionRef} dir="rtl" className="relative z-30 w-full overflow-visible bg-bg px-5 py-[90px] sm:px-7 sm:py-[110px] lg:py-[135px]">
      <div className="mx-auto w-full max-w-[1216px]">
        <div className="relative z-50 mb-10 flex items-end justify-between gap-6 sm:mb-14" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(25px)", transition: "opacity 900ms ease, transform 1000ms cubic-bezier(0.16,1,0.3,1)" }}>
          <div className="relative z-50">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-soft-teal px-4 py-2 text-[10px] font-extrabold text-primary sm:text-[11px]">
              <FiMapPin className="text-sm" />
              <span>وجهاتك بانتظارك</span>
            </div>

            <h2 className="m-0 text-[34px] font-black leading-[1.2] tracking-[-1px] text-text sm:text-[44px] lg:text-[52px]">
              وين بتحب{" "}
              <span className="bg-gradient-to-l from-primary-deep to-primary bg-clip-text text-transparent">
                تروح؟
              </span>
            </h2>

            <p className="mt-4 max-w-[620px] text-[13px] font-medium leading-8 text-muted sm:text-[15px]">
              اكتشف أهم المدن السورية واختر وجهتك القادمة بكل سهولة.
            </p>
          </div>

          <div className="relative z-50 hidden items-center gap-3 sm:flex">
            <button type="button" onClick={prevSlide} aria-label="السابق" className="grid h-12 w-12 place-items-center rounded-full border border-border bg-surface text-text shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-primary hover:text-white">
              <FiArrowRight className="text-lg" />
            </button>

            <button type="button" onClick={nextSlide} aria-label="التالي" className="grid h-12 w-12 place-items-center rounded-full border border-border bg-surface text-text shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-primary hover:text-white">
              <FiArrowLeft className="text-lg" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-[430px] items-center justify-center sm:h-[520px]">
            <div className="h-[390px] w-[285px] animate-pulse rounded-[30px] bg-surface-alt sm:h-[500px] sm:w-[350px]" />
          </div>
        ) : destinationCities.length ? (
          <>
            <div className="relative z-10 mx-auto h-[430px] w-full max-w-[1100px] sm:h-[520px]" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ perspective: "1400px" }}>
              {destinationCities.map((city, index) => {
                const position = getPosition(index)
                const isActive = position === 0

                if (Math.abs(position) > 2) return null

                const translateX = position === 0 ? 0 : position === -1 ? -300 : position === 1 ? 300 : position === -2 ? -500 : 500
                const rotateY = position === 0 ? 0 : position < 0 ? 22 : -22
                const scale = position === 0 ? 1 : Math.abs(position) === 1 ? 0.82 : 0.68
                const translateZ = position === 0 ? 80 : Math.abs(position) === 1 ? -80 : -180
                const opacity = position === 0 ? 1 : Math.abs(position) === 1 ? 0.78 : 0.38
                const rotateX = isActive ? mouse.y : 0
                const activeRotateY = isActive ? mouse.x : 0

                return (
                  <button
                    key={city.id}
                    type="button"
                    onClick={() => {
                      if (!isActive) {
                        setActiveIndex(index)
                        setMouse({ x: 0, y: 0 })
                      } else {
                        navigate(`/results?destinationId=${city.id}`)
                      }
                    }}
                    className="absolute left-1/2 top-1/2 h-[390px] w-[285px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[30px] text-right shadow-[0_35px_90px_rgba(19,54,72,0.22)] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:h-[500px] sm:w-[350px]"
                    style={{ transform: `translateX(calc(-50% + ${translateX}px)) translateY(-50%) translateZ(${translateZ}px) rotateY(${rotateY + activeRotateY}deg) rotateX(${rotateX}deg) scale(${scale})`, zIndex: 20 - Math.abs(position), opacity: isVisible ? opacity : 0, transitionDelay: `${Math.abs(position) * 70}ms`, pointerEvents: isVisible ? "auto" : "none" }}
                  >
                    <img
                      src={city.image}
                      alt={city.name}
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=85"
                      }}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700"
                      style={{ transform: isActive ? `scale(1.06) translate(${mouse.x * -0.7}px, ${mouse.y * -0.7}px)` : "scale(1.02)" }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                      <div className="mb-3 flex items-center gap-2 text-[10px] font-bold text-white/90 sm:text-[11px]">
                        <FiMapPin className="text-primary" />
                        <span>سوريا</span>
                      </div>

                      <h3 className="m-0 text-[28px] font-black text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.5)] sm:text-[34px]">
                        {city.name}
                      </h3>

                      <div className={`mt-4 h-[3px] rounded-full bg-primary transition-all duration-700 ${isActive ? "w-16" : "w-8"}`} />
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 sm:mt-8">
              {destinationCities.map((city, index) => (
                <button
                  key={city.id}
                  type="button"
                  aria-label={`الانتقال إلى ${city.name}`}
                  onClick={() => {
                    setActiveIndex(index)
                    setMouse({ x: 0, y: 0 })
                  }}
                  className={`h-2 rounded-full transition-all duration-500 ${index === safeActiveIndex ? "w-8 bg-primary" : "w-2 bg-border hover:bg-primary/50"}`}
                />
              ))}
            </div>

            <div className="mt-7 flex justify-center gap-3 sm:hidden">
              <button type="button" onClick={prevSlide} aria-label="السابق" className="grid h-11 w-11 place-items-center rounded-full border border-border bg-surface text-text shadow-sm transition-all duration-300 active:scale-95">
                <FiArrowRight />
              </button>

              <button type="button" onClick={nextSlide} aria-label="التالي" className="grid h-11 w-11 place-items-center rounded-full border border-border bg-surface text-text shadow-sm transition-all duration-300 active:scale-95">
                <FiArrowLeft />
              </button>
            </div>
          </>
        ) : null}
      </div>
    </section>
  )
}

export default DestinationCards
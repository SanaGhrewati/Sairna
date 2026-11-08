import { useState } from "react"
import {
  FiMapPin,
  FiRepeat,
  FiCalendar,
  FiUsers,
  FiSearch,
} from "react-icons/fi"
import { BsStars } from "react-icons/bs"
import { useNavigate } from "react-router-dom"

function SearchBox() {
  const [origin, setOrigin] = useState("2")
  const [destination, setDestination] = useState("1")
  const [date, setDate] = useState("")
  const [people, setPeople] = useState("1")

  const navigate = useNavigate()

  const cities = [
    { value: "2", label: "حلب" },
    { value: "1", label: "دمشق" },
    { value: "5", label: "اللاذقية" },
    { value: "3", label: "حمص" },
    { value: "4", label: "حماة" },
    { value: "6", label: "طرطوس" },
    { value: "7", label: "إدلب" },
  ]

  const swapCities = () => {
    setOrigin(destination)
    setDestination(origin)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (origin === destination) {
      alert("اختاري محافظتين مختلفتين")
      return
    }

    if (!date) {
      alert("اختاري تاريخ الرحلة")
      return
    }

    navigate(
      `/results?originId=${origin}&destinationId=${destination}&date=${date}&people=${people}`
    )
  }

  return (
    <div
      dir="rtl"
      className="
        relative z-10
        mx-auto
        -mt-[35px]
        max-w-[1100px]
        px-6
        max-[650px]:px-4
      "
    >
      <div
        className="
          overflow-hidden
          rounded-[22px]
          border border-border
          bg-surface
          shadow-custom-md
        "
      >
        {/* Header */}
        <div
          className="
            flex items-center justify-between
            gap-4
            border-b border-border
            px-6 py-5

            max-[900px]:flex-col
            max-[900px]:items-start
          "
        >
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-primary" />

            <div className="flex flex-col gap-1">
              <strong className="text-sm font-black text-text">
                وين رحلتك الجاية؟
              </strong>

              <span className="text-[11px] text-muted">
                اختار وجهتك وباقي التفاصيل علينا
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-extrabold text-primary">
            <BsStars />
            الحجز بـ 3 خطوات
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="
            grid
            grid-cols-[1fr_auto_1fr_1fr_0.8fr_auto]
            items-end
            gap-3
            p-5

            max-[900px]:grid-cols-2
            max-[900px]:gap-3

            max-[650px]:gap-3
            max-[650px]:p-4
          "
        >
          {/* Origin */}
          <label className="relative flex min-w-0 flex-col gap-2">
            <span className="text-[11px] font-extrabold text-muted">
              من وين؟
            </span>

            <div className="relative">
              <FiMapPin className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-primary" />

              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="
                  h-12
                  w-full
                  rounded-xl
                  border border-border
                  bg-surface
                  pr-10 pl-3
                  text-xs
                  font-bold
                  text-text
                  outline-none
                  focus:border-primary

                  max-[650px]:h-11
                  max-[650px]:pr-9
                "
              >
                {cities.map((city) => (
                  <option key={city.value} value={city.value}>
                    {city.label}
                  </option>
                ))}
              </select>
            </div>
          </label>

          {/* Swap Button */}
          <button
            type="button"
            onClick={swapCities}
            aria-label="تبديل المحافظات"
            className="
              mb-1
              grid
              h-10
              w-10
              shrink-0
              place-items-center
              rounded-full
              border
              border-border
              bg-soft-teal
              text-primary
              transition-all
              hover:bg-primary
              hover:text-white

              max-[900px]:hidden
            "
          >
            <FiRepeat />
          </button>

          {/* Destination */}
          <label className="relative flex min-w-0 flex-col gap-2">
            <span className="text-[11px] font-extrabold text-muted">
              لوين؟
            </span>

            <div className="relative">
              <FiMapPin className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-primary" />

              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="
                  h-12
                  w-full
                  rounded-xl
                  border border-border
                  bg-surface
                  pr-10 pl-3
                  text-xs
                  font-bold
                  text-text
                  outline-none
                  focus:border-primary

                  max-[650px]:h-11
                  max-[650px]:pr-9
                "
              >
                {cities.map((city) => (
                  <option key={city.value} value={city.value}>
                    {city.label}
                  </option>
                ))}
              </select>
            </div>
          </label>

          {/* Mobile Swap */}
          <button
            type="button"
            onClick={swapCities}
            aria-label="تبديل المحافظات"
            className="
              absolute
              left-1/2
              top-[116px]
              z-20
              hidden
              h-9
              w-9
              -translate-x-1/2
              items-center
              justify-center
              rounded-full
              border
              border-border
              bg-soft-teal
              text-primary
              shadow-sm
              transition-all
              hover:bg-primary
              hover:text-white

              max-[900px]:flex
            "
          >
            <FiRepeat />
          </button>

          {/* Date */}
          <label className="flex min-w-0 flex-col gap-2">
            <span className="text-[11px] font-extrabold text-muted">
              تاريخ الرحلة
            </span>

            <div className="relative">
              <FiCalendar className="absolute right-3 top-1/2 -translate-y-1/2 text-primary" />

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="
                  h-12
                  w-full
                  rounded-xl
                  border border-border
                  bg-surface
                  pr-10 pl-3
                  text-xs
                  font-bold
                  text-text
                  outline-none
                  focus:border-primary

                  max-[650px]:h-11
                  max-[650px]:pr-9
                "
              />
            </div>
          </label>

          {/* People */}
          <label className="flex min-w-0 flex-col gap-2">
            <span className="text-[11px] font-extrabold text-muted">
              المسافرين
            </span>

            <div className="relative">
              <FiUsers className="absolute right-3 top-1/2 -translate-y-1/2 text-primary" />

              <select
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                className="
                  h-12
                  w-full
                  rounded-xl
                  border border-border
                  bg-surface
                  pr-10 pl-3
                  text-xs
                  font-bold
                  text-text
                  outline-none
                  focus:border-primary

                  max-[650px]:h-11
                  max-[650px]:pr-9
                "
              >
                <option value="1">1 مسافر</option>
                <option value="2">2 مسافرين</option>
                <option value="3">3 مسافرين</option>
                <option value="4">4 مسافرين</option>
              </select>
            </div>
          </label>

          {/* Search Button */}
          <button
            type="submit"
            className="
              flex
              h-12
              items-center
              justify-center
              gap-2
              whitespace-nowrap
              rounded-xl
              bg-primary
              px-5
              text-xs
              font-extrabold
              text-white
              transition-all
              hover:-translate-y-[2px]
              hover:bg-primary-deep

              max-[900px]:col-span-2
              max-[900px]:w-full

              max-[650px]:h-11
            "
          >
            <FiSearch />
            ابحث عن رحلات
          </button>
        </form>
      </div>
    </div>
  )
}

export default SearchBox
import { useEffect, useState } from "react"
import { FaRegCircleDot } from "react-icons/fa6"
import { BsStars } from "react-icons/bs"
import { FiMenu, FiX, FiChevronDown } from "react-icons/fi"
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5"
import { NavLink, Link, useNavigate } from "react-router-dom"

import { useCurrentPassenger } from "../../hooks/use-auth"
import { useQueryClient } from "@tanstack/react-query"
import logo from "../../assets/image/تنزيل.svg"
import Button from "../button/button"

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark"
  })

  const navigate = useNavigate()

  const { data: currentUser, isLoading: isUserLoading } = useCurrentPassenger()
  const queryClient = useQueryClient()
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light")
    localStorage.setItem("theme", darkMode ? "dark" : "light")
  }, [darkMode])

  const handleLogout = () => {
  localStorage.removeItem("passengerToken")
  queryClient.removeQueries({ queryKey: ["current-passenger"] })
  setMenuOpen(false)
  navigate("/")
}

  const links = [
    { to: "/", label: "الرئيسية" },
    { to: "/results", label: "احجز رحلة" },
    { to: "/companies", label: "شركات النقل" },
    { to: "/trips", label: "حجوزاتي" },
    { to: "/tracking", label: "تتبّع الرحلة" },
  ]

  return (
    <>
      <div className="min-h-8 bg-dark-deep text-[#d4f2ec] text-[10px] max-[650px]:text-[9px] font-bold flex items-center justify-center gap-[9px] px-3 py-[5px] text-center tracking-[0.1px]">
        <FaRegCircleDot className="text-[#58d7bb]" />
        <span>رحلات بين المدن السورية، بخطوة بسيطة وواضحة</span>
        <BsStars className="text-[#ffce87]" />
      </div>

      <header
  dir="rtl"
  className="sticky top-0 z-[80] bg-transparent border-b border-white/20 backdrop-blur-md transition-all duration-300">
        <div className="max-w-[1200px] mx-auto h-[83px] max-[900px]:h-[71px] max-[650px]:h-[66px] px-6 max-[650px]:px-4 flex items-center justify-between gap-[22px]">

          <Link to="/" className="inline-flex items-center gap-2.5 shrink-0">
            <span className="w-12 h-12 max-[650px]:w-[39px] max-[650px]:h-[39px] grid place-items-center">
              <img src={logo} alt="سيرنا" className="w-full h-full" />
            </span>

            <span className="flex flex-col leading-[1.2]">
              <strong className="text-[30px] max-[650px]:text-[25px] tracking-[-1.5px] font-black text-dark-deep">
                سيرنا<span className="text-primary">.</span>
              </strong>
              <small className="text-[9px] max-[650px]:text-[8px] font-bold mt-[7px] max-[650px]:mt-[5px] text-muted whitespace-nowrap">
                رحلتك بتبلّش من هون
              </small>
            </span>
          </Link>

          <nav className="hidden min-[901px]:flex items-center gap-[27px] mx-auto">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className={({ isActive }) => `relative whitespace-nowrap text-xs font-extrabold py-8 transition-colors ${isActive ? "text-text" : "text-muted hover:text-text"} after:content-[''] after:absolute after:right-1/2 after:bottom-[17px] after:translate-x-1/2 after:h-[3px] after:rounded-[5px] after:bg-primary after:transition-all ${isActive ? "after:w-[23px]" : "after:w-0 hover:after:w-[23px]"}`}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3 max-[1150px]:gap-2">

            <button type="button" onClick={() => setDarkMode(!darkMode)} className="flex items-center justify-center w-10 h-10 rounded-xl border border-border bg-surface text-text transition-all duration-300 hover:bg-soft-teal hover:text-primary hover:border-primary" aria-label={darkMode ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي"}>
              {darkMode ? <IoSunnyOutline className="text-[20px]" /> : <IoMoonOutline className="text-[20px]" />}
            </button>

            {isUserLoading ? (
              <div className="hidden min-[651px]:block w-[100px] h-10 rounded-xl bg-surface-alt animate-pulse" />
            ) : currentUser ? (
              <>
                <Link to="/account" className="hidden min-[651px]:flex items-center gap-2 px-2 py-1 rounded-xl text-xs font-extrabold text-text transition-colors hover:text-primary">
                  <span className="grid w-8 h-8 place-items-center rounded-full bg-soft-teal text-primary">
                    {currentUser.name?.charAt(0)}
                  </span>
                  <span className="max-w-[120px] truncate">أهلاً، {currentUser.name}</span>
                </Link>

                <button type="button" onClick={handleLogout} className="hidden min-[651px]:block text-xs font-extrabold text-muted transition-colors hover:text-red-500">
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-xs font-extrabold text-text hover:text-primary whitespace-nowrap max-[650px]:hidden">
                  دخول
                </Link>

                <Link to="/register" className="max-[650px]:hidden">
                  <Button variant="dark" size="sm">
                    إنشاء حساب
                    <span>←</span>
                  </Button>
                </Link>
              </>
            )}

            <button type="button" onClick={() => setMenuOpen(!menuOpen)} className="hidden max-[900px]:grid place-items-center w-10 h-10 border border-border rounded-xl bg-surface text-text hover:bg-soft-teal hover:text-primary hover:border-primary transition" aria-label="فتح القائمة">
              {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="min-[901px]:hidden mx-3 mb-3 rounded-[22px] bg-white/5 dark:bg-black/5 backdrop-blur-2xl border border-white/10 px-3 py-3 shadow-xl transition-all duration-300">

            {links.map((link) => (
              <NavLink key={link.to} to={link.to} onClick={() => setMenuOpen(false)} className={({ isActive }) => `flex items-center justify-between px-3 py-3 rounded-xl font-bold transition-colors duration-200 ${isActive ? "text-primary" : "text-text hover:text-primary"}`}>
                <span>{link.label}</span>
                <FiChevronDown className="rotate-90 text-current" />
              </NavLink>
            ))}

            {isUserLoading ? (
              <div className="h-10 my-2 rounded-xl bg-white/10 animate-pulse" />
            ) : currentUser ? (
              <>
                <Link to="/account" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-3 rounded-xl font-bold text-text transition-colors duration-200 hover:text-primary">
                  <span className="grid w-8 h-8 place-items-center rounded-full bg-soft-teal text-primary">
                    {currentUser.name?.charAt(0)}
                  </span>
                  <span>أهلاً، {currentUser.name}</span>
                </Link>

                <button type="button" onClick={handleLogout} className="block w-full text-right px-3 py-3 rounded-xl font-bold text-red-500 transition-colors duration-200 hover:text-red-600">
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-3 py-3 rounded-xl font-bold text-text transition-colors duration-200 hover:text-primary">
                  تسجيل الدخول
                </Link>

                <Link to="/register" onClick={() => setMenuOpen(false)} className="block px-3 py-3 rounded-xl font-bold text-primary transition-colors duration-200 hover:text-primary-deep">
                  إنشاء حساب
                </Link>
              </>
            )}
          </div>
        )}
      </header>
    </>
  )
}

export default Header
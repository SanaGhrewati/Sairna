import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FiArrowLeft, FiEye, FiEyeOff, FiLock, FiMail, FiUser } from "react-icons/fi"
import { useRegisterPassenger } from "../../hooks/use-auth"
import registerImage from "../../assets/image/image.jpg"

function RegisterPage() {
  const navigate = useNavigate()
  const registerMutation = useRegisterPassenger()

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))

    setErrorMessage("")
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setErrorMessage("يرجى تعبئة جميع الحقول")
      return
    }

    if (form.password.length < 8) {
      setErrorMessage("كلمة المرور يجب أن تكون 8 أحرف على الأقل.")
      return
    }

    if (form.password !== form.confirmPassword) {
      setErrorMessage("كلمتا المرور غير متطابقتين.")
      return
    }

    if (!acceptedTerms) {
      setErrorMessage("يجب الموافقة على الشروط والأحكام وسياسة الخصوصية.")
      return
    }

    registerMutation.mutate(
      {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      },
      {
        onSuccess: () => {
          navigate("/login")
        },
        onError: (error) => {
          const message = error?.response?.data?.message

          if (message === "EMAIL_ALREADY_EXISTS" || message === "EMAIL_EXISTS") {
            setErrorMessage("هذا البريد الإلكتروني مستخدم مسبقاً.")
          } else {
            setErrorMessage("حدث خطأ أثناء إنشاء الحساب.")
          }
        },
      }
    )
  }

  return (
    <main dir="rtl" className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#eef5f6] p-3 sm:p-5 lg:p-8">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${registerImage})` }} />
      <div className="absolute inset-0 bg-[#0a2c3e]/45 backdrop-blur-[3px]" />

      <div className="relative z-10 flex w-full max-w-[760px] overflow-hidden rounded-[22px] border border-white/70 bg-white shadow-[0_24px_70px_rgba(10,44,62,0.20)] max-lg:max-w-[650px] max-md:max-w-[520px]">
        <div className="relative hidden min-h-[500px] w-[49%] shrink-0 overflow-hidden rounded-l-[22px] bg-cover bg-center bg-no-repeat lg:block" style={{ backgroundImage: `url(${registerImage})` }}>
          <div className="absolute inset-0 bg-gradient-to-t from-[#073c4a]/80 via-[#073c4a]/20 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-7 text-white xl:p-8">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[9px] font-extrabold backdrop-blur-md">
              انضمي لسيرنا
            </span>

            <h1 className="mt-4 text-3xl font-black leading-[1.2] xl:text-4xl">
              خلينا نبدأ
              <span className="block text-[#7ce5d5]">
                الرحلة.
              </span>
            </h1>

            <p className="mt-3 max-w-[290px] text-[10px] font-medium leading-6 text-white/80">
              أنشئي حسابك واحفظي حجوزاتك وخلي كل رحلاتك بمكان واحد.
            </p>
          </div>
        </div>

        <div className="flex min-h-[500px] w-full flex-col bg-white px-6 py-6 sm:px-8 sm:py-7 lg:w-[51%] lg:px-9">
          <Link to="/" className="flex w-fit items-center gap-1.5 text-[9px] font-extrabold text-muted hover:text-primary">
            <FiArrowLeft className="text-xs" />
            العودة للرئيسية
          </Link>

          <div className="mx-auto my-auto w-full max-w-[320px] py-5">
            <div className="mb-4">
              <div className="mb-3 inline-flex rounded-full bg-soft-teal px-2.5 py-1 text-[8px] font-black text-primary">
                انضمي لسيرنا
              </div>

              <h2 className="mb-1.5 text-2xl font-black leading-tight text-text sm:text-[27px]">
                إنشاء حساب
              </h2>

              <p className="text-[9px] font-medium leading-5 text-muted">
                أنشئي حسابك وابدئي رحلتك مع سيرنا.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-[9px] font-extrabold text-text">
                  الاسم الكامل
                </label>

                <div className="flex min-h-[38px] items-center gap-2 rounded-[9px] border border-border bg-white px-3 focus-within:border-primary">
                  <FiUser className="text-sm text-muted" />

                  <input id="name" name="name" type="text" value={form.name} onChange={handleChange} placeholder="مثال: أحمد علي" autoComplete="name" className="w-full border-0 bg-transparent text-[10px] font-semibold text-text outline-none placeholder:text-[#a5b2b8]" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-[9px] font-extrabold text-text">
                  البريد الإلكتروني
                </label>

                <div className="flex min-h-[38px] items-center gap-2 rounded-[9px] border border-border bg-white px-3 focus-within:border-primary">
                  <FiMail className="text-sm text-muted" />

                  <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="example@email.com" autoComplete="email" className="w-full border-0 bg-transparent text-[10px] font-semibold text-text outline-none placeholder:text-[#a5b2b8]" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-[9px] font-extrabold text-text">
                  كلمة المرور
                </label>

                <div className="flex min-h-[38px] items-center gap-2 rounded-[9px] border border-border bg-white px-3 focus-within:border-primary">
                  <FiLock className="text-sm text-muted" />

                  <input id="password" name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={handleChange} placeholder="8 أحرف على الأقل" autoComplete="new-password" className="w-full border-0 bg-transparent text-[10px] font-semibold text-text outline-none placeholder:text-[#a5b2b8]" />

                  <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="grid h-6 w-6 place-items-center border-0 bg-transparent text-muted hover:text-primary">
                    {showPassword ? <FiEyeOff className="text-xs" /> : <FiEye className="text-xs" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="confirmPassword" className="text-[9px] font-extrabold text-text">
                  تأكيد كلمة المرور
                </label>

                <div className="flex min-h-[38px] items-center gap-2 rounded-[9px] border border-border bg-white px-3 focus-within:border-primary">
                  <FiLock className="text-sm text-muted" />

                  <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={form.confirmPassword} onChange={handleChange} placeholder="أعيدي كتابة كلمة المرور" autoComplete="new-password" className="w-full border-0 bg-transparent text-[10px] font-semibold text-text outline-none placeholder:text-[#a5b2b8]" />

                  <button type="button" onClick={() => setShowConfirmPassword((prev) => !prev)} className="grid h-6 w-6 place-items-center border-0 bg-transparent text-muted hover:text-primary">
                    {showConfirmPassword ? <FiEyeOff className="text-xs" /> : <FiEye className="text-xs" />}
                  </button>
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-2 pt-1 text-[9px] font-bold leading-5 text-muted">
                <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-primary" />

                <span>
                  أوافق على{" "}
                  <Link to="/help" className="font-black text-primary hover:text-primary-deep">
                    الشروط والأحكام
                  </Link>{" "}
                  و
                  <Link to="/help" className="mr-1 font-black text-primary hover:text-primary-deep">
                    سياسة الخصوصية
                  </Link>
                </span>
              </label>

              {errorMessage && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-2 text-[9px] font-bold leading-5 text-red-600">
                  {errorMessage}
                </div>
              )}

              <button type="submit" disabled={registerMutation.isPending} className="mt-1 min-h-[40px] w-full rounded-[9px] border-0 bg-gradient-to-br from-primary to-primary-deep text-[10px] font-black text-white shadow-[0_8px_20px_rgba(10,169,155,0.18)] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60">
                {registerMutation.isPending ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
              </button>
            </form>

            <p className="mt-5 text-center text-[9px] font-semibold text-muted">
              عندك حساب مسبقاً؟
              <Link to="/login" className="mr-1 font-black text-primary hover:text-primary-deep">
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default RegisterPage
import { useNavigate } from "react-router-dom"
import { FiUser, FiMail, FiLogOut, FiCalendar, FiShield } from "react-icons/fi"
import { useCurrentPassenger } from "../../hooks/use-auth"

function AccountPage() {
  const navigate = useNavigate()

  const { data: currentUser, isLoading, isError } = useCurrentPassenger()

  const handleLogout = () => {
    localStorage.removeItem("passengerToken")
    navigate("/login", { replace: true })
  }

  if (isLoading) {
    return (
      <main dir="rtl" className="min-h-[calc(100vh-150px)] bg-bg px-4 py-8">
        <div className="mx-auto flex min-h-[400px] max-w-[760px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
            <p className="text-xs font-bold text-muted">جاري تحميل بيانات حسابك...</p>
          </div>
        </div>
      </main>
    )
  }

  if (isError || !currentUser) {
    return (
      <main dir="rtl" className="min-h-[calc(100vh-150px)] bg-bg px-4 py-8">
        <div className="mx-auto flex min-h-[400px] max-w-[760px] items-center justify-center">
          <div className="rounded-[20px] border border-border bg-surface px-7 py-8 text-center shadow-custom">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-red-50 text-red-500">
              <FiUser size={24} />
            </div>
            <h2 className="mb-2 text-lg font-black text-text">تعذر تحميل الحساب</h2>
            <p className="mb-5 text-xs font-bold text-muted">يبدو أن جلسة تسجيل الدخول انتهت.</p>
            <button type="button" onClick={() => navigate("/login")} className="rounded-xl bg-primary px-5 py-2.5 text-xs font-extrabold text-white transition hover:bg-primary-deep">
              تسجيل الدخول
            </button>
          </div>
        </div>
      </main>
    )
  }

  const firstLetter = currentUser.name?.charAt(0) || "س"

  return (
    <main dir="rtl" className="min-h-[calc(100vh-150px)] bg-bg px-4 py-7 sm:py-9">
      <div className="mx-auto max-w-[760px]">

        <div className="mb-5">
          <p className="mb-1 text-[11px] font-extrabold text-primary">حسابك الشخصي</p>
          <h1 className="text-2xl font-black tracking-tight text-text sm:text-3xl">أهلاً فيك، {currentUser.name}</h1>
          <p className="mt-1.5 text-xs font-bold leading-6 text-muted">من هون فيك تشوف معلومات حسابك وتوصل لحجوزاتك بسهولة.</p>
        </div>

        <section className="overflow-hidden rounded-[22px] border border-border bg-surface shadow-custom">

          <div className="bg-dark-deep px-5 py-6 sm:px-7">
            <div className="flex items-center gap-4">

              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-[18px] bg-primary text-2xl font-black text-white shadow-lg">
                {firstLetter}
              </div>

              <div className="min-w-0">
                <p className="mb-0.5 text-[10px] font-bold text-[#b7d8d7]">المستخدم</p>
                <h2 className="truncate text-lg font-black text-white">{currentUser.name}</h2>
                <p className="mt-0.5 truncate text-xs font-bold text-[#a9c3ca]">{currentUser.email}</p>
              </div>

            </div>
          </div>

          <div className="p-5 sm:p-7">

            <div className="mb-5">
              <h3 className="text-base font-black text-text">معلومات الحساب</h3>
              <p className="mt-1 text-[11px] font-bold text-muted">المعلومات المرتبطة بحسابك في سيرنا.</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">

              <div className="rounded-xl border border-border bg-surface-alt p-4">
                <div className="mb-3 grid h-9 w-9 place-items-center rounded-lg bg-soft-teal text-primary">
                  <FiUser size={17} />
                </div>
                <p className="mb-1 text-[10px] font-bold text-muted">الاسم</p>
                <p className="text-xs font-black text-text">{currentUser.name}</p>
              </div>

              <div className="rounded-xl border border-border bg-surface-alt p-4">
                <div className="mb-3 grid h-9 w-9 place-items-center rounded-lg bg-soft-teal text-primary">
                  <FiMail size={17} />
                </div>
                <p className="mb-1 text-[10px] font-bold text-muted">البريد الإلكتروني</p>
                <p className="break-all text-xs font-black text-text">{currentUser.email}</p>
              </div>

              <div className="rounded-xl border border-border bg-surface-alt p-4">
                <div className="mb-3 grid h-9 w-9 place-items-center rounded-lg bg-soft-teal text-primary">
                  <FiShield size={17} />
                </div>
                <p className="mb-1 text-[10px] font-bold text-muted">نوع الحساب</p>
                <p className="text-xs font-black text-text">{currentUser.role === "USER" ? "مسافر" : currentUser.role}</p>
              </div>

              <div className="rounded-xl border border-border bg-surface-alt p-4">
                <div className="mb-3 grid h-9 w-9 place-items-center rounded-lg bg-soft-teal text-primary">
                  <FiCalendar size={17} />
                </div>
                <p className="mb-1 text-[10px] font-bold text-muted">الحجوزات</p>
                <button type="button" onClick={() => navigate("/trips")} className="text-xs font-black text-primary transition hover:text-primary-deep">
                  عرض حجوزاتي ←
                </button>
              </div>

            </div>

            <div className="mt-6 flex flex-col gap-2.5 border-t border-border pt-5 sm:flex-row">

              <button type="button" onClick={() => navigate("/trips")} className="flex min-h-[43px] flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-xs font-extrabold text-white transition hover:bg-primary-deep">
                <FiCalendar size={16} />
                حجوزاتي
              </button>

              <button type="button" onClick={handleLogout} className="flex min-h-[43px] items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 text-xs font-extrabold text-red-500 transition hover:border-red-300 hover:bg-red-50">
                <FiLogOut size={16} />
                تسجيل الخروج
              </button>

            </div>

          </div>
        </section>
      </div>
    </main>
  )
}

export default AccountPage
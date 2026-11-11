import { Link } from "react-router-dom"
import { useState } from "react"
import { FiArrowLeft, FiHeadphones, FiPlus } from "react-icons/fi"

function HelpPage() {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: "كيف بحجز رحلة؟",
      answer:
        "حدد المحافظة اللي رح تطلع منها والمحافظة اللي بدك توصل إلها، بعدين اختار التاريخ والشركة والموعد والمقعد، وأكّد الحجز.",
    },
    {
      question: "في دفع إلكتروني حقيقي؟",
      answer:
        "لا. الموقع نموذج تدريبي، وخيارات الدفع معروضة لأغراض التصميم فقط.",
    },
    {
      question: "الخريطة بتعرض مكان الباص الحقيقي؟",
      answer:
        "لا. الخريطة بتعرض مسار تقديري ومحاكاة لحركة الباص. التتبع المباشر يحتاج GPS وAPI من شركة النقل.",
    },
    {
      question: "وين بلاقي حجوزاتي؟",
      answer:
        "من قائمة «حجوزاتي». الحجوزات محفوظة محلياً بنفس المتصفح لأغراض التدريب.",
    },
    {
      question: "هل في حسابات حقيقية؟",
      answer:
        "التسجيل والدخول محاكاة لتجربة الواجهة، وليسا نظام مصادقة حقيقياً.",
    },
  ]

  const toggleFaq = (index) => {
    setOpenIndex((current) => (current === index ? null : index))
  }

  return (
    <main dir="rtl" className="min-h-screen bg-bg">
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-[140deg] from-surface-alt to-bg px-4 py-7 sm:py-10">
        <div className="pointer-events-none absolute -left-16 -top-20 h-48 w-48 rounded-full bg-primary/5" />

        <div className="relative mx-auto max-w-[1216px]">
          <div className="mb-2 flex items-center gap-2 text-[10px] font-extrabold text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span>نحن معك</span>
          </div>

          <h1 className="text-[clamp(29px,3.2vw,42px)] font-black leading-[1.2] tracking-[-1px] text-text">
            شو حابب <span className="text-primary">تعرف؟</span>
          </h1>

          <p className="mt-2 text-[11px] font-bold leading-6 text-muted sm:text-xs">
            أسئلة بتساعدك تستخدم نموذج سيرنا بسهولة.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1216px] gap-5 px-4 py-10 pb-20 sm:px-6 lg:grid-cols-[1.5fr_0.75fr] lg:items-start lg:gap-7 lg:py-14">
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index

            return (
              <div
                key={faq.question}
                className={`overflow-hidden rounded-[19px] border bg-surface transition-all duration-300 ease-out ${
                  isOpen
                    ? "border-primary/40 shadow-[0_14px_35px_rgba(10,169,155,0.10)]"
                    : "border-border shadow-none"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className={`group flex w-full items-center justify-between gap-4 px-5 py-5 text-right transition-all duration-300 ease-out sm:px-6 ${
                    isOpen
                      ? "bg-soft-teal text-primary"
                      : "text-text hover:-translate-y-[2px] hover:bg-soft-teal/60 hover:text-primary hover:shadow-[0_8px_22px_rgba(10,169,155,0.08)]"
                  }`}
                  aria-expanded={isOpen}
                >
                  <span className="text-[11px] font-black leading-6 sm:text-xs">
                    {faq.question}
                  </span>

                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-all duration-300 ${
                      isOpen
                        ? "rotate-45 bg-primary text-white"
                        : "bg-surface-alt text-muted group-hover:bg-primary group-hover:text-white"
                    }`}
                  >
                    <FiPlus size={16} />
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="border-t border-primary/10 px-5 py-5 text-[10px] font-bold leading-6 text-muted sm:px-6 sm:text-[11px]">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <aside className="rounded-[22px] bg-dark-deep p-6 text-white shadow-custom sm:p-7 lg:sticky lg:top-[105px]">
          <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-primary/15 text-primary">
            <FiHeadphones size={30} />
          </div>

          <p className="mb-2 text-[10px] font-extrabold text-[#7ce5d5]">
            نحن هون لنساعدك
          </p>

          <h2 className="text-2xl font-black leading-[1.35]">
            بحاجة لمساعدة؟
          </h2>

          <p className="mt-3 text-[10px] font-bold leading-6 text-white/65 sm:text-[11px]">
            هاد الموقع نموذج واجهات تعليمية، وممكن تطوّرو لاحقاً لتضيفوا نظام
            دعم حقيقي.
          </p>

          <Link
            to="/"
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-[10px] font-extrabold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-primary-deep hover:shadow-[0_10px_25px_rgba(10,169,155,0.25)]"
          >
            رجوع للرئيسية
            <FiArrowLeft size={15} />
          </Link>
        </aside>
      </section>
    </main>
  )
}

export default HelpPage
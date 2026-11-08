import { BsStars } from "react-icons/bs"
import { CiCircleCheck, CiLocationOn } from "react-icons/ci"
import { FaRegCircleCheck } from "react-icons/fa6"

import masged from "../../assets/image/image.jpg"

function Hero() {
  return (
    <section
      dir="rtl"
      className="
        relative
        overflow-hidden
        bg-bg
      "
    >
      <div
        className="
          max-w-[1200px]
          mx-auto
          px-6
          pt-[58px]
          pb-[75px]
          grid
          grid-cols-2
          items-center
          gap-[65px]
          max-[1150px]:gap-[40px]
          max-[900px]:grid-cols-1
          max-[900px]:pt-[45px]
          max-[900px]:pb-[55px]
          max-[650px]:px-4
          max-[650px]:pt-[32px]
          max-[650px]:pb-[45px]
        "
      >
        <div className="min-w-0">

          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-soft-teal
              text-primary-deep
              px-[14px]
              py-[5px]
              text-[11px]
              font-black
              tracking-[0.12px]
            "
          >
            <BsStars className="text-[14px]" />

            <span>
              أهلا فيك بسيرنا
            </span>
          </div>

          <h1
            className="
              mt-[19px]
              mb-[11px]
              text-[clamp(48px,5.15vw,79px)]
              leading-[1.33]
              tracking-[-2.4px]
              font-black
              text-text
              max-[1150px]:text-[clamp(45px,5vw,66px)]
              max-[900px]:text-[49px]
              max-[650px]:text-[40px]
              max-[400px]:text-[36px]
            "
          >
            المحطة الجاية ؟

            <span
              className="
                block
                bg-[linear-gradient(93deg,#078a91,#15ba9d_75%)]
                bg-clip-text
                text-transparent
              "
            >
              .على كيفك
            </span>
          </h1>

          <p
            className="
              max-w-[485px]
              mb-[22px]
              text-[16px]
              leading-[2.15]
              text-muted
              max-[1150px]:text-[14px]
              max-[900px]:text-[13px]
              max-[650px]:text-[12px]
            "
          >
            من حلب لدمشق، ومن الساحل للجزيرة.
            لاقي الرحلة اللي بتناسبك، اختار مقعدك،
            وخلّي الطريق علينا.
          </p>

          <div
            className="
              flex
              items-center
              flex-wrap
              gap-[20px]
              max-[900px]:gap-[14px]
            "
          >
            <span
              className="
                flex
                items-center
                gap-[6px]
                text-[11px]
                font-extrabold
                text-text
              "
            >
              <CiCircleCheck
                className="
                  text-[18px]
                  text-primary
                "
              />

              حجز سهل
            </span>

            <span
              className="
                flex
                items-center
                gap-[6px]
                text-[11px]
                font-extrabold
                text-text
              "
            >
              <CiCircleCheck
                className="
                  text-[18px]
                  text-primary
                "
              />

              خيارات متنوعة
            </span>

            <span
              className="
                flex
                items-center
                gap-[6px]
                text-[11px]
                font-extrabold
                text-text
              "
            >
              <CiCircleCheck
                className="
                  text-[18px]
                  text-primary
                "
              />

              متابعة رحلتك
            </span>
          </div>

          <div
            className="
              flex
              items-center
              gap-[14px]
              mt-[40px]
              max-[900px]:mt-[28px]
            "
          >
            <div className="flex flex-row">
              <span
                className="
                  w-[35px]
                  h-[35px]
                  rounded-full
                  border-[3px]
                  border-surface
                  grid
                  place-items-center
                  bg-[#f3d2a6]
                  text-[#5e3a36]
                  text-[11px]
                  font-black
                  mr-[-7px]
                "
              >
                م
              </span>

              <span
                className="
                  w-[35px]
                  h-[35px]
                  rounded-full
                  border-[3px]
                  border-surface
                  grid
                  place-items-center
                  bg-[#c2dadb]
                  text-[#36565d]
                  text-[11px]
                  font-black
                  mr-[-7px]
                "
              >
                س
              </span>

              <span
                className="
                  w-[35px]
                  h-[35px]
                  rounded-full
                  border-[3px]
                  border-surface
                  grid
                  place-items-center
                  bg-[#e4bed1]
                  text-[#674052]
                  text-[11px]
                  font-black
                  mr-[-7px]
                "
              >
                ع
              </span>

              <span
                className="
                  w-[35px]
                  h-[35px]
                  rounded-full
                  border-[3px]
                  border-surface
                  grid
                  place-items-center
                  bg-[#b9d2ed]
                  text-[#36516e]
                  text-[11px]
                  font-black
                "
              >
                ر
              </span>
            </div>

            <div>
              <div
                className="
                  flex
                  items-center
                  gap-[3px]
                  text-[#f7b843]
                  text-[13px]
                  leading-[1.5]
                "
              >
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>

                <b
                  className="
                    mr-[4px]
                    text-[12px]
                    tracking-normal
                    text-text
                  "
                >
                  4.9/5
                </b>
              </div>

              <small
                className="
                  text-[10px]
                  font-bold
                  text-muted
                "
              >
                تجربة سفر بتستاهل تجرّبها
              </small>
            </div>
          </div>
        </div>

        <div
          className="
            relative
            min-w-0
            px-[20px]
            py-[18px]
            pr-0
            max-[900px]:px-5
            max-[900px]:py-[10px]
          "
        >
          <div
            className="
              absolute
              z-0
              w-[220px]
              h-[220px]
              left-[-62px]
              top-[-35px]
              rounded-full
              border-[1.5px]
              border-dashed
              border-primary
              opacity-40
              max-[650px]:w-[150px]
              max-[650px]:h-[150px]
              max-[650px]:left-[-30px]
              max-[650px]:top-[-20px]
            "
          />

          <div
            className="
              absolute
              z-0
              w-[150px]
              h-[150px]
              right-[-50px]
              bottom-0
              rounded-full
              border-[1.5px]
              border-dashed
              border-primary
              opacity-40
              max-[650px]:w-[100px]
              max-[650px]:h-[100px]
              max-[650px]:right-[-20px]
            "
          />

          <div
            className="
              relative
              z-[1]
              overflow-visible
              rounded-[30px]
              bg-soft-teal
              shadow-[0_30px_70px_rgba(10,62,70,0.15)]
              rotate-[-1.5deg]
              max-[650px]:rounded-[20px]
            "
          >
            <img
              src={masged}
              alt="صورة حقيقية للجامع الأموي في دمشق"
              className="
                block
                w-full
                aspect-[1.45]
                object-cover
                object-center
                rounded-[30px]
                saturate-[0.93]
                contrast-[1.035]
                max-[650px]:rounded-[20px]
              "
            />

            <div
              className="
                absolute
                inset-0
                pointer-events-none
                rounded-[30px]
                bg-[linear-gradient(180deg,transparent_56%,rgba(9,40,51,0.18))]
                max-[650px]:rounded-[20px]
              "
            />

            <span
              className="
                absolute
                bottom-[14px]
                left-[14px]
                z-[2]
                rounded-full
                bg-surface/90
                backdrop-blur-sm
                px-[13px]
                py-[6px]
                text-[10px]
                font-bold
                text-text
                shadow-[0_6px_15px_rgba(15,61,69,0.12)]
                max-[650px]:bottom-[11px]
                max-[650px]:left-[11px]
                max-[650px]:text-[9px]
              "
            >
              صورة حقيقية من دمشق
            </span>

            <div
              className="
                absolute
                z-[3]
                top-[26px]
                right-[-32px]
                flex
                items-center
                gap-[10px]
                rounded-[16px]
                bg-surface
                px-[15px]
                py-[12px]
                shadow-[0_15px_28px_rgba(15,61,69,0.17)]
                max-[900px]:right-[15px]
                max-[650px]:top-[15px]
                max-[650px]:right-[12px]
                max-[650px]:gap-[8px]
                max-[650px]:px-[11px]
                max-[650px]:py-[9px]
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-center
                  w-[38px]
                  h-[38px]
                  rounded-full
                  bg-soft-teal
                  text-primary
                  max-[650px]:w-[32px]
                  max-[650px]:h-[32px]
                "
              >
                <CiLocationOn className="text-[22px]" />
              </div>

              <div className="flex flex-col">
                <b
                  className="
                    text-[12px]
                    font-black
                    text-text
                    max-[650px]:text-[10px]
                  "
                >
                  14 محافظة
                </b>

                <small
                  className="
                    text-[10px]
                    text-muted
                    max-[650px]:text-[8px]
                  "
                >
                  وجهات بتجمعنا
                </small>
              </div>
            </div>

            <div
              className="
                absolute
                z-[3]
                bottom-[25px]
                left-[-32px]
                flex
                items-center
                gap-[10px]
                rounded-[16px]
                bg-surface
                px-[15px]
                py-[12px]
                shadow-[0_15px_28px_rgba(15,61,69,0.17)]
                max-[900px]:left-[15px]
                max-[650px]:bottom-[15px]
                max-[650px]:left-[12px]
                max-[650px]:gap-[8px]
                max-[650px]:px-[11px]
                max-[650px]:py-[9px]
              "
            >
              <span
                className="
                  flex
                  items-center
                  justify-center
                  w-[38px]
                  h-[38px]
                  rounded-full
                  bg-soft-teal
                  text-primary
                  max-[650px]:w-[32px]
                  max-[650px]:h-[32px]
                "
              >
                <FaRegCircleCheck className="text-[20px]" />
              </span>

              <div className="flex flex-col">
                <b
                  className="
                    text-[12px]
                    font-black
                    text-text
                    max-[650px]:text-[10px]
                  "
                >
                  سافر براحة
                </b>

                <small
                  className="
                    text-[10px]
                    text-muted
                    max-[650px]:text-[8px]
                  "
                >
                  من أول حجز لآخر محطة
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Pagination,
  EffectFade,
  EffectCube,
  EffectCoverflow,
  EffectFlip,
  Autoplay,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css/effect-cube";
import "swiper/css/effect-coverflow";
import "swiper/css/effect-flip";

import { DiaryResponseType } from "../../types/type";
import SelectInput from "../../components/form/SelectInput";
import { TwoDiv } from "../../components/form/TwoDiv";

type SwiperEffectType = "slide" | "fade" | "cube" | "coverflow" | "flip";
type SwiperDelayType = 1000 | 2000 | 3000;

const ImageSliderPage = ({ diary }: { diary: DiaryResponseType }) => {
  const [effect, setEffect] = useState<SwiperEffectType>("fade");
  const [delay, setDelay] = useState<SwiperDelayType>(1000);

  const effectOptions = [
    { label: "페이드", value: "fade" },
    { label: "슬라이드", value: "slide" },
    { label: "큐브", value: "cube" },
    { label: "커버플로우", value: "coverflow" },
    { label: "플립", value: "flip" },
  ];

  const delayOptions = [
    { label: "1000 ms", value: "1000" },
    { label: "2000 ms", value: "2000" },
    { label: "3000 ms", value: "3000" },
    { label: "4000 ms", value: "4000" },
    { label: "5000 ms", value: "5000" },
  ];

  return (
    <>
      <Swiper
        key={effect}
        modules={[
          Pagination,
          EffectFade,
          EffectCube,
          EffectCoverflow,
          EffectFlip,
          Autoplay,
        ]}
        pagination={{ clickable: true }}
        effect={effect}
        autoplay={{ delay: Number(delay), disableOnInteraction: false }}
        loop={true}
        observer={true}
        observeParents={true}
        fadeEffect={{ crossFade: true }}
        cubeEffect={{
          shadow: true,
          slideShadows: true,
          shadowOffset: 20,
          shadowScale: 0.94,
        }}
        coverflowEffect={{
          rotate: 30,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
          scale: 0.9,
        }}
        flipEffect={{
          slideShadows: true,
          limitRotation: true,
        }}
        style={{ width: "100%", height: "100%" }}
      >
        {diary?.imageResponses?.map((image, index) => (
          <SwiperSlide key={image.fileUrl ?? index}>
            <img
              src={image.fileUrl}
              alt={`diary-image-${index}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
              }}
            />
            <div>파일명: {image.fileName}</div>
          </SwiperSlide>
        ))}
      </Swiper>
      <TwoDiv>
        <SelectInput
          name="effects"
          title="효과"
          value={effect}
          setValue={(v: string) => setEffect(v as SwiperEffectType)}
          options={effectOptions}
        />
        <SelectInput
          name="delays"
          title="시간지연"
          value={String(delay)}
          setValue={(v: String) => setDelay(Number(v) as SwiperDelayType)}
          options={delayOptions}
        />
      </TwoDiv>
    </>
  );
};

export default ImageSliderPage;

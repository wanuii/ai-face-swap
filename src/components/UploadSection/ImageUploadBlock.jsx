import { useInView } from "react-intersection-observer";
export default function ImageUploadBlock({
  imageSrc,
  onViewClick,
  blockType,
}) {
  const { ref, inView } = useInView({
    threshold: 0.5, // 滑到一半就觸發
  });
  const labelMap = {
    Portrait: "人臉選擇",
    Swap: "模板選擇",
    Result: "細節&下載",
  };
  return (
    <div
      ref={ref}
      className={`card-container ${
        inView ? "card-in-view" : ""
      } group lg:w-64 md:w-60`}
      onClick={onViewClick}
    >
      <img
        src={imageSrc}
        alt="預覽圖"
        className="card-image w-full h-full object-cover"
      />
      {blockType !== "Result" && (
        <div className="arrow-container">
          <div className="relative flex justify-center items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 220"
              width="100"
              height="140"
              fill="#000000"
              fillOpacity="0.5"
            >
              <path d="M50 0 L100 50 H70 V220 H30 V50 H0 Z" />
            </svg>
            <div className="arrow-text">上傳</div>
          </div>
        </div>
      )}
      <button
        className={`select-action z-20 ${inView ? "button-slide-in" : ""}`}
      >
        {labelMap[blockType]}
      </button>
    </div>
  );
}

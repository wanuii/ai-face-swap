import { useEffect, useState } from "react";
import titleImage from "@/assets/title_page.webp";
import underlineCrayon from "@/assets/crayon-underline.webp";
import ShareButtons from "./ShareButtons";
function TitlePage() {
  const [bgLoaded, setBgLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = titleImage;
    img.onload = () => setBgLoaded(true);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* 手機版背景圖（小螢幕才顯示） */}
      <div
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat lg:hidden -z-10 ${
          bgLoaded ? "opacity-100" : "opacity-0"
        } transition-opacity duration-500`}
        style={{ backgroundImage: `url(${titleImage})` }}
      />
      {/* 桌機版模糊背景 + 清晰人像（大螢幕才顯示） */}
      <div className="hidden lg:block absolute inset-0 -z-20">
        <div
          className={`absolute inset-0 bg-cover bg-center blur-md scale-110 ${
            bgLoaded ? "opacity-100" : "opacity-0"
          } transition-opacity duration-500`}
          style={{ backgroundImage: `url(${titleImage})` }}
        />
        <div className="absolute inset-0 flex justify-center items-center">
          <img
            src={titleImage}
            alt="人像"
            className={`object-contain max-h-[90%] ${
              bgLoaded ? "opacity-100" : "opacity-0"
            } transition-opacity duration-500`}
          />
        </div>
      </div>
      <div className="flex flex-col justify-center items-center h-full w-full md:w-[70%]">
        <p className="text-base font-bold">AI FACE SWAP</p>
        <h1 className="font-biaukai text-6xl mt-6">
          <span className="font-playfair">AI</span> 換臉
        </h1>
        <h2 className="font-biaukai text-5xl mt-3">
          體驗不同
          <span
            className="underline-crayon"
            style={{ "--crayon-img": `url(${underlineCrayon})` }}
          >
            人生
          </span>
        </h2>
        <div className="mt-6 mb-6 font-bold flex items-center flex-col">
          <p>光臨本空間享有極致換臉體驗，</p>
          <p>一秒瀏覽全世界</p>
        </div>
        <button
          className="start-button fade-up"
          onClick={() => {
            const el = document.getElementById("upload-section");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          START
        </button>
        <div className="flex gap-5 mt-3">
          <ShareButtons color="text-black" message="體驗AI換臉！超有趣！" />
        </div>
      </div>
    </div>
  );
}

export default TitlePage;

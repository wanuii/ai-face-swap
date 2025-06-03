import titleImage from "@/assets/title_page.webp";
import { FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";
function TitlePage() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* 手機版背景圖（小螢幕才顯示） */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat lg:hidden -z-10"
        style={{ backgroundImage: `url(${titleImage})` }}
      />
      {/* 桌機版模糊背景 + 清晰人像（大螢幕才顯示） */}
      <div className="hidden lg:block absolute inset-0 -z-20">
        <div
          className="absolute inset-0 bg-cover bg-center blur-md scale-110"
          style={{ backgroundImage: `url(${titleImage})` }}
        />
        <div className="absolute inset-0 flex justify-center items-center">
          <img
            src={titleImage}
            alt="人像"
            className="object-contain max-h-[90%]"
          />
        </div>
      </div>
      <div className="flex flex-col justify-center items-center h-full w-full md:w-[70%]">
        <p className="text-base font-bold">FUBORE AI FACE SWAP</p>
        <h1 className="font-biaukai text-6xl mt-6">
          <span className="font-playfair">AI</span> 換臉
        </h1>
        <h2 className="font-biaukai text-5xl mt-3">
          體驗不同
          <span className="underline-crayon">人生</span>
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
        <div className="flex gap-5 mt-4">
          {/* IG */}
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram className="text-black text-xl" />
          </a>

          {/* Facebook */}
          <a
            href="https://www.facebook.com/sharer/sharer.php?u=https://你的網站.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebookF className="text-black text-xl" />
          </a>

          {/* Twitter */}
          <a
            href="https://twitter.com/intent/tweet?url=https://你的網站.com&text=體驗AI換臉！超有趣！"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter className="text-black text-xl" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default TitlePage;

import { FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";
const FIXED_URL = "https://ai-face-swap-ebon.vercel.app/";
const DEFAULT_MESSAGE = "快來試試這個 AI 換臉神器！";

const SocialShare = ({ color = "text-black" }) => {
  return (
    <div className="flex gap-4 mt-4">
      {/* IG */}
      <a
        href="https://www.instagram.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaInstagram className={`${color} text-xl`} />
      </a>

      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          FIXED_URL
        )}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaFacebookF className={`${color} text-xl`} />
      </a>

      {/* Twitter */}
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
          FIXED_URL
        )}&text=${encodeURIComponent(DEFAULT_MESSAGE)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaTwitter className={`${color} text-xl`} />
      </a>
    </div>
  );
};

export default SocialShare;

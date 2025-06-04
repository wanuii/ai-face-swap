import { FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";

const SocialShare = ({ color = "text-black", url, message }) => {
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
          url
        )}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaFacebookF className={`${color} text-xl`} />
      </a>

      {/* Twitter */}
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
          url
        )}&text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaTwitter className={`${color} text-xl`} />
      </a>
    </div>
  );
};

export default SocialShare;

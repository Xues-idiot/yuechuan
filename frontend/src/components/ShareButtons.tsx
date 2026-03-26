"use client";

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
}

export default function ShareButtons({ url, title, description }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDesc = encodeURIComponent(description || "");

  const shareLinks = [
    {
      name: "Twitter",
      icon: "𝕏",
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: "bg-black text-white",
    },
    {
      name: "Facebook",
      icon: "📘",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "bg-blue-600 text-white",
    },
    {
      name: "微信",
      icon: "💬",
      url: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodedUrl}`,
      color: "bg-green-500 text-white",
    },
    {
      name: "邮件",
      icon: "✉️",
      url: `mailto:?subject=${encodedTitle}&body=${encodedDesc}%0A%0A${encodedUrl}`,
      color: "bg-gray-500 text-white",
    },
  ];

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: description, url });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Share failed:", err);
        }
      }
    }
  };

  return (
    <div className="space-y-3">
      {"share" in navigator && (
        <button
          onClick={handleNativeShare}
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          📤 使用应用分享
        </button>
      )}

      <div className="grid grid-cols-4 gap-2">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex flex-col items-center gap-1 p-3 rounded-lg ${link.color} transition-opacity hover:opacity-80`}
          >
            <span className="text-xl">{link.icon}</span>
            <span className="text-xs">{link.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

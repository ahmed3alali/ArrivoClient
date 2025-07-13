import Image from "next/image";
import React from "react";

const backendHost = process.env.NEXT_PUBLIC_BACKEND_HOST || "https://backend.arrivotravel.com";

const OneContent = ({ cont }) => {
  const { icon, title, description } = cont;

  const imageSrc = icon
    ? `${backendHost}/media/${cont.icon}`
    : "/icons/default.png"; // fallback image in public/icons

  return (
    <div className="col-span-12 lg:col-span-6 flex items-center gap-x-2 text-[16px]">
      <Image
        src={imageSrc}
        height={48}
        width={48}
        alt={title || "content icon"}
      />
      <div className="flex flex-col gap-[4px]">
        <span className="text-[16px] font-bold">{title}</span>
        <span className="text-[12px] text-[#636973]">{description}</span>
      </div>
    </div>
  );
};

export default OneContent;

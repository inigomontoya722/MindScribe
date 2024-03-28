"use client";

import { cn } from "@bem-react/classname";
import { useEffect, useState } from "react";

import "./Presentation.scss";

const cnPresentation = cn("Presentation");

const Presentation = () => {
  const [link, setLink] = useState<string>(
    "https://docs.google.com/presentation/d/e/2PACX-1vTnC2QAsKX3gofM6a-2sgYOyMtpac4Gwp_FJ2TcGajltO-5xVCz6sYRYhf29nCXk9wkHaZh6TvSbNGg/embed?start=false&loop=false&delayms=60000"
  );
  useEffect(() => console.log(link), [link]);
  return (
    <div className={cnPresentation("Container")}>
      <input
        type="text"
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />
      <iframe
        className={cnPresentation("IFrame")}
        src={link}
        width="1280"
        height="749"
      ></iframe>
    </div>
  );
};

export default Presentation;

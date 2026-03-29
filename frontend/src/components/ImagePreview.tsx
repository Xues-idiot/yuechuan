"use client";

import { useState } from "react";
import Image from "next/image";
import Modal from "./Modal";

interface ImagePreviewProps {
  src: string;
  alt?: string;
  className?: string;
}

export default function ImagePreview({ src, alt = "", className = "" }: ImagePreviewProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Image
        src={src}
        alt={alt}
        width={800}
        height={600}
        onClick={() => setIsOpen(true)}
        className={`cursor-zoom-in ${className}`}
        unoptimized
      />

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="lg">
        <div className="flex items-center justify-center">
          <Image
            src={src}
            alt={alt}
            width={1200}
            height={900}
            className="max-w-full max-h-[80vh] object-contain"
            unoptimized
          />
        </div>
      </Modal>
    </>
  );
}

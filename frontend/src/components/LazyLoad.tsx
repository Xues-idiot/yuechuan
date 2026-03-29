"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
}

export default function LazyImage({
  src,
  alt,
  className = "",
  placeholder,
}: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {(!loaded || !inView) && (
        <div
          className="absolute inset-0 animate-pulse flex items-center justify-center"
          style={{ backgroundColor: 'var(--surface-secondary)' }}
        >
          {placeholder || (
            <span style={{ color: 'var(--text-tertiary)' }}>加载中...</span>
          )}
        </div>
      )}
      {inView && (
        <Image
          src={src}
          alt={alt}
          fill
          onLoad={() => setLoaded(true)}
          className={`${loaded ? "opacity-100" : "opacity-0"} transition-opacity`}
          unoptimized
        />
      )}
    </div>
  );
}

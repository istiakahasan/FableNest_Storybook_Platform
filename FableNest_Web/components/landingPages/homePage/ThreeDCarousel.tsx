"use client";

import { useRef, useEffect, useState, TouchEvent, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import Image from "next/image";
import { useTranslations } from "next-intl";

export interface BestsellerItem {
  id: number;
  title: string;
  description: string;
  image: string;
  age: string;
  discount: string;
}

interface PersonalizedBestsellerCarouselProps {
  items: BestsellerItem[];
  autoRotate?: boolean;
  rotateInterval?: number;
}

const PersonalizedBestsellerCarousel = ({
  items,
  autoRotate = true, // default always auto play
  rotateInterval = 3000, // 3 second
}: PersonalizedBestsellerCarouselProps) => {
  const t = useTranslations("ThreeDCarousel");
  const router = useRouter();
  const [active, setActive] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [mouseDown, setMouseDown] = useState<number | null>(null);
  const [mouseUp, setMouseUp] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [cardHeights, setCardHeights] = useState<number[]>([]);
  const isMobile = useIsMobile();
  const minSwipeDistance = 50;

  const gradientInitial =
    "linear-gradient(103deg, #443BC9 5%, rgba(242, 128, 151, 0.58) 94.56%)";
  const gradientHover =
    "linear-gradient(103deg, rgba(242, 128, 151, 0.58), #443BC9)";

  // Auto-rotate effect (every 3 second)
  useEffect(() => {
    if (autoRotate && isInView && !isHovering && !dragging) {
      const interval = setInterval(() => {
        setActive((prev) => (prev + 1) % items.length);
      }, rotateInterval);
      return () => clearInterval(interval);
    }
  }, [isInView, isHovering, autoRotate, rotateInterval, items.length, dragging]);

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    const currentRef = carouselRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
      observer.disconnect();
    };
  }, []);

  // Calculate max card height
  useEffect(() => {
    const calculateHeights = () => {
      const heights = items.map((item) => {
        const titleLines = Math.ceil(item.title.length / 30);
        const descLines = Math.ceil(item.description.length / 60);
        const baseHeight = 400;
        const contentHeight = (titleLines + descLines) * 24;
        const buttonHeight = 48;
        const padding = 80;

        const calculatedHeight = Math.min(
          baseHeight + contentHeight + buttonHeight + padding,
          600
        );

        return Math.max(calculatedHeight, 450);
      });
      setCardHeights(heights);
    };

    calculateHeights();
  }, [items]);

  const getContainerHeight = () => {
    const maxHeight = Math.max(...cardHeights, 500);
    return maxHeight + 100;
  };

  // Touch swipe handlers
  const onTouchStart = (e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
    setDragging(true);
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    setDragging(false);
    if (touchStart === null || touchEnd === null) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) handleNext();
    else if (distance < -minSwipeDistance) handlePrev();
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Mouse drag handlers for desktop
  const onMouseDown = (e: MouseEvent) => {
    setMouseDown(e.clientX);
    setMouseUp(null);
    setDragging(true);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (dragging && mouseDown !== null) {
      setMouseUp(e.clientX);
    }
  };

  const onMouseUp = () => {
    setDragging(false);
    if (mouseDown === null || mouseUp === null) {
      setMouseDown(null);
      setMouseUp(null);
      return;
    }
    const distance = mouseDown - mouseUp;
    if (distance > minSwipeDistance) handleNext();
    else if (distance < -minSwipeDistance) handlePrev();
    setMouseDown(null);
    setMouseUp(null);
  };

  // Card width helpers with full responsiveness
  const getCardWidth = () => "w-[300px] sm:w-[410px]";

  // Card transform classes for responsive carousel
  const getCardClasses = (index: number) => {
    if (isMobile) {
      if (index === active) return "scale-100 z-20 translate-x-0";
      if (index === (active + 1) % items.length)
        return "translate-x-[85%] scale-95 z-10";
      if (index === (active - 1 + items.length) % items.length)
        return "translate-x-[-85%] scale-95 z-10";
      return "scale-90 z-0";
    } else if (typeof window !== "undefined" && window.innerWidth < 1024) {
      // Tablet adjustments
      if (index === active) return "scale-100 z-20 translate-x-0";
      if (index === (active + 1) % items.length)
        return "translate-x-[80%] scale-90 z-10";
      if (index === (active - 1 + items.length) % items.length)
        return "translate-x-[-80%] scale-95 z-10";
      return "scale-90 z-0";
    } else {
      // Large screen
      if (index === active) return "scale-100 z-20 translate-x-0";
      if (index === (active + 1) % items.length)
        return "translate-x-[85%] scale-95 z-10";
      if (index === (active + 2) % items.length)
        return "translate-x-[165%] scale-90 z-5";
      if (index === (active - 1 + items.length) % items.length)
        return "translate-x-[-85%] scale-95 z-10";
      if (index === (active - 2 + items.length) % items.length)
        return "translate-x-[-165%] scale-90 z-5";
      return "scale-90 z-0";
    }
  };

  const handleNext = () => setActive((prev) => (prev + 1) % items.length);
  const handlePrev = () =>
    setActive((prev) => (prev - 1 + items.length) % items.length);

  // Handle card click to set active
  const handleCardClick = (index: number) => {
    setActive(index);
  };

  // Handle personalize button click
  const handlePersonalize = (bookId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    router.push(`/books/${bookId}`);
  };

  return (
    <section>
      {/* Carousel Container */}
      <div
        className="relative w-full transition-all duration-500 select-none"
        style={{ height: getContainerHeight() }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        ref={carouselRef}
        tabIndex={0}
        role="region"
        aria-label="Bestseller carousel"
      >
        {/* Cards */}
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`absolute box-shadow-xl ${getCardWidth()} transform transition-all duration-500 ${getCardClasses(
                index
              )}`}
              style={{ margin: 0, cursor: "pointer", userSelect: "none" }}
              onClick={() => handleCardClick(index)}
              tabIndex={0}
              aria-label={`${item.title} card`}
            >
              {/* Card */}
              <div
                className="relative flex flex-col items-start p-5 gap-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.03] bg-white rounded-2xl"
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  userSelect: "none",
                  WebkitUserSelect: "none",
                }}
              >
                {/* Badge */}
                <div
                  className="absolute top-0 right-0 z-10"
                  style={{ width: "70px", height: "70px" }}>
                  <div className="relative w-full h-full">
                    <Image
                      src={"/collection/badge.svg"}
                      alt="badge"
                      width={70}
                      height={70}
                      className="w-full h-full"
                    />
                    <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-lg">
                      {item.discount || "20%"}
                    </span>
                  </div>
                </div>

                {/* Book Image Container */}
                <div
                  className="w-full mb-4"
                  style={{
                    height: "370px",
                    maxHeight: "370px",
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: "12px",
                    flexShrink: 0,
                  }}>
                  <div className="relative w-full h-full">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover object-center"
                      priority={index === active}
                    />
                  </div>
                </div>

                {/* Card Content */}
                <div className="flex flex-col space-y-[10px] w-full text-left">
                  <h3 className="text-xl font-bold text-text-primary font-jost">
                    {item.title}
                  </h3>
                  <p className="text-text-sec font-comme leading-[150%]">
                    {item.description}
                  </p>
                  <span className="text-text-primary font-comme leading-[140%]">
                    Age {item.age}
                  </span>
                </div>

                {/* Personalise Button */}
                <div className="flex justify-center items-center w-full">
                  <button
                    onClick={(e) => handlePersonalize(item.id, e)}
                    className="group relative w-fit px-6 py-3 text-base font-semibold rounded-lg transition-all duration-300 overflow-hidden border border-white font-dynapuff"
                    style={{ height: "48px" }}>
                    <div className="inline-flex items-center justify-center gap-3 relative z-10 pointer-events-none w-full">
                      <span className="text-white">{t("personalize")}</span>
                    </div>
                    <span
                      className="absolute inset-0 rounded-lg transition-all duration-300"
                      style={{ background: gradientInitial }}
                    />
                    <span
                      className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: gradientHover }}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute -bottom-16 md:left-40 left-5">
          <Image
            src={"/collection/witch-hat.svg"}
            alt="witch-hat"
            width={100}
            className="hvr-float-shadow"
            height={100}
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-center items-center space-x-4">
        <button
          className="relative group hover:shadow-xl hover:scale-105 transform transition duration-200"
          onClick={handlePrev}
          style={{
            display: "flex",
            width: "60px",
            height: "60px",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            aspectRatio: "1 / 1",
            borderRadius: "40px",
            background: "#FFFFFF", // Default white background
          }}
          aria-label="Previous item">
          {/* Gradient background on hover */}
          <span
            className="absolute inset-0 rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
            style={{
              background: "linear-gradient(100deg, #9955FF -25.29%, #FF8D79 72.25%)",
            }}
          />
          {/* Icon - black normally, white on hover */}
          <ChevronLeft className="h-[32px] w-[32px] z-10 transition-colors duration-200 text-black group-hover:text-white" />
        </button>

        <button
          className="relative group hover:shadow-xl hover:scale-105 transform transition duration-200"
          onClick={handleNext}
          style={{
            display: "flex",
            width: "60px",
            height: "60px",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            aspectRatio: "1 / 1",
            borderRadius: "40px",
            background: "#FFFFFF", // Default white background
          }}
          aria-label="Next item"
        >
          {/* Gradient background on hover */}
          <span
            className="absolute inset-0 rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
            style={{
              background: "linear-gradient(100deg, #9955FF -25.29%, #FF8D79 72.25%)",
            }}
          />
          {/* Icon - black normally, white on hover */}
          <ChevronRight className="h-[32px] w-[32px] z-10 transition-colors duration-200 text-black group-hover:text-white" />
        </button>
      </div>
    </section>
  );
};

export default PersonalizedBestsellerCarousel;

/** biome-ignore-all lint/suspicious/noArrayIndexKey: <> */
/** biome-ignore-all lint/a11y/noStaticElementInteractions: <> */
import { useEffect, useRef, useState } from "react";

import "./styles.scss";

import type { CarouselProps } from "./types";

export function Carousel({
	children,
	autoPlay = false,
	autoPlayInterval = 3000,
	slidesToShow = 1,
	slidesToScroll = 1,
	dots = false,
	arrows = false,
	gap = 16,
}: CarouselProps) {
	const [currentSlide, setCurrentSlide] = useState(0);
	const slideCount = children.length;
	const containerRef = useRef<HTMLDivElement>(null);
	const wrapperRef = useRef<HTMLDivElement>(null);
	const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
	const startPos = useRef(0);
	const isDragging = useRef(false);

	const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
		isDragging.current = true;
		if ("touches" in e) {
			startPos.current = e.touches[0].clientX;
		} else {
			startPos.current = e.clientX;
		}
	};

	const handleDragEnd = (e: React.TouchEvent | React.MouseEvent) => {
		if (!isDragging.current) return;
		let endPos = 0;
		if ("changedTouches" in e) {
			endPos = e.changedTouches[0].clientX;
		} else {
			endPos = e.clientX;
		}
		const distance = endPos - startPos.current;
		if (Math.abs(distance) > 50) {
			if (distance < 0) {
				goToSlide(currentSlide + slidesToScroll);
			} else {
				goToSlide(currentSlide - slidesToScroll);
			}
		}
		isDragging.current = false;
	};

	const goToSlide = (index: number) => {
		let currentIndex = 0;
		if (index < 0) {
			currentIndex = slideCount - 1;
		} else if (index >= slideCount) {
			currentIndex = 0;
		}

		setCurrentSlide(currentIndex);
	};

	useEffect(() => {
		if (autoPlay) {
			autoPlayRef.current = setInterval(() => {
				setCurrentSlide((prev) => (prev + slidesToScroll) % slideCount);
			}, autoPlayInterval);

			return () => {
				if (autoPlayRef.current) clearInterval(autoPlayRef.current);
			};
		}
	}, [autoPlay, autoPlayInterval, slideCount, slidesToScroll]);

	useEffect(() => {
		if (containerRef.current) {
			const slideWidth = containerRef.current.offsetWidth / slideCount;
			const totalGap = gap * currentSlide;
			const translateX = currentSlide * slideWidth + totalGap;
			containerRef.current.style.transform = `translateX(-${translateX}px)`;
		}
	}, [currentSlide, slideCount, gap]);

	useEffect(() => {
		if (wrapperRef.current && containerRef.current) {
			const activeSlide = containerRef.current.children[
				currentSlide
			] as HTMLElement;
			if (activeSlide) {
				wrapperRef.current.style.height = `${activeSlide.offsetHeight}px`;
			}
		}
	}, [currentSlide]);

	return (
		<>
			{arrows && (
				<div className="carousel__controls">
					<button
						type="button"
						onClick={() => goToSlide(currentSlide - slidesToScroll)}
						className="carousel__button"
					>
						<svg
							width="48"
							height="48"
							viewBox="0 0 48 48"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<title>Icone</title>
							<circle cx="24" cy="24" r="24" fill="#EEF9FF" />
							<g opacity="0.8">
								<g clipPath="url(#clip0_2355_5155)">
									<path
										d="M30.9339 36.9609C31.304 36.5167 31.23 35.7765 30.7858 35.4063L17.2391 24.0063L30.7858 12.6062C31.304 12.2361 31.304 11.5699 30.9339 11.0517C30.5638 10.6075 29.8235 10.5335 29.3794 10.9036L14.7962 23.118C14.5741 23.3401 14.426 23.6362 14.426 24.0063C14.426 24.3024 14.5741 24.6725 14.7962 24.8946L29.3794 37.0349C29.8235 37.4791 30.5638 37.405 30.9339 36.9609Z"
										fill="#0046C0"
									/>
								</g>
							</g>
							<defs>
								<clipPath id="clip0_2355_5155">
									<rect
										width="26.6667"
										height="26.6667"
										fill="white"
										transform="translate(35.957 37.3333) rotate(180)"
									/>
								</clipPath>
							</defs>
						</svg>
					</button>
					<button
						type="button"
						onClick={() => goToSlide(currentSlide + slidesToScroll)}
						className="carousel__button"
					>
						<svg
							width="48"
							height="48"
							viewBox="0 0 48 48"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<title>Icone</title>
							<circle cx="24" cy="24" r="24" fill="#F2FAFF" />
							<g opacity="0.8">
								<g clipPath="url(#clip0_2355_5154)">
									<path
										d="M17.3132 11.039C16.943 11.4832 17.0171 12.2235 17.4612 12.5936L31.008 23.9937L17.4612 35.3937C16.943 35.7639 16.943 36.4301 17.3132 36.9483C17.6833 37.3924 18.4236 37.4665 18.8677 37.0963L33.4509 24.882C33.673 24.6599 33.8211 24.3638 33.8211 23.9937C33.8211 23.6975 33.673 23.3274 33.4509 23.1053L18.8677 10.965C18.4236 10.5209 17.6833 10.5949 17.3132 11.039Z"
										fill="#0046C0"
									/>
								</g>
							</g>
							<defs>
								<clipPath id="clip0_2355_5154">
									<rect
										width="26.6667"
										height="26.6667"
										fill="white"
										transform="translate(12.29 10.6667)"
									/>
								</clipPath>
							</defs>
						</svg>
					</button>
				</div>
			)}
			<div className="carousel" ref={wrapperRef} data-testid="carousel-wrapper">
				<div
					ref={containerRef}
					className="carousel__track"
					data-testid="carousel-track"
					style={{
						width: `${(slideCount * 100) / slidesToShow}%`,
						gap: `${gap}px`,
					}}
					onMouseDown={handleDragStart}
					onMouseUp={handleDragEnd}
					onMouseLeave={handleDragEnd}
					onTouchStart={handleDragStart}
					onTouchEnd={handleDragEnd}
				>
					{children.map((child, index) => (
						<div
							key={index}
							className="carousel__slide"
							style={{
								width: `${100 / slideCount}%`,
								padding: `0 ${gap / 2}px`,
								boxSizing: "border-box",
							}}
						>
							{child}
						</div>
					))}
				</div>

				{dots && (
					<div className="carousel__dots">
						{Array.from({ length: Math.ceil(slideCount / slidesToScroll) }).map(
							(_, index) => (
								<button
									type="button"
									key={index}
									onClick={() => goToSlide(index * slidesToScroll)}
									className={`carousel__dot ${index * slidesToScroll === currentSlide ? "active" : ""}`}
								/>
							),
						)}
					</div>
				)}
			</div>
		</>
	);
}

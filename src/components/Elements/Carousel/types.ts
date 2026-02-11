export type CarouselProps = {
	children: React.ReactNode[];
	autoPlay?: boolean;
	autoPlayInterval?: number;
	slidesToShow?: number;
	slidesToScroll?: number;
	dots?: boolean;
	arrows?: boolean;
	gap?: number;
};

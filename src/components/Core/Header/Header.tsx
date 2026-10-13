/** biome-ignore-all lint/complexity/useLiteralKeys: <> */
"use client";
import { clsx } from "@/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ArrowLeftSVG from "./icons/ic-arrow-left.svg";
import LogoPortoSVG from "./icons/ic-logo-porto.svg";
import CartSVG from "./icons/ic-shopping-cart.svg";
import s from "./Header.module.scss";

export type HeaderProps = {
	handleGoBack?: () => void;
	goBackLink?: string;
	hasShoppingCart?: boolean;
};

export const Header = ({
	handleGoBack,
	goBackLink,
	hasShoppingCart = false,
}: HeaderProps) => {
	const router = useRouter();
	return (
		<header className={s["header-acquisition-flow"]}>
			<Image
				src={ArrowLeftSVG}
				height={24}
				width={24}
				className={clsx(s["button"], s["item-left"])}
				alt="icone-voltar-para-pagina-anterior"
				onClick={
					handleGoBack ??
					(() => (goBackLink ? router.push(goBackLink) : router.back()))
				}
			/>

			<Image
				className={clsx(s["button"], s["item-center"])}
				src={LogoPortoSVG}
				height={28}
				width={120}
				alt="icon-logo-porto"
				onClick={() => router.push("/")}
			/>

			{hasShoppingCart && (
				<Image
					src={CartSVG}
					height={24}
					width={24}
					className={clsx(s["button"], s["item-right"])}
					alt="icone-carinho"
				/>
			)}
		</header>
	);
};

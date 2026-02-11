"use client";
import { useRouter, useSearchParams } from "next/navigation";

import "./styles.scss";

import { clsx } from "@/utils";

import type { ModalProps } from "./types";

export const Modal = ({ title, subtitle, name, children }: ModalProps & { name: string }) => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const isOpen = searchParams.get("modal") === name;

	const handleCloseModal = () => {
		const params = new URLSearchParams(window.location.search);
		params.delete("modal");
		router.push(`?${params.toString()}`, { scroll: false });
	};

	return (
		<>
			{isOpen && (
				<div className={"modal__overlay"} onClick={handleCloseModal} onKeyDown={handleCloseModal} />
			)}
			<div
				className={clsx("modal__root", { "modal--hidden": !isOpen })}
				aria-modal="true"
				aria-labelledby="modal-title"
				aria-describedby="modal-subtitle"
				onClick={(e) => e.stopPropagation()}
				onKeyDown={(e) => e.stopPropagation()}
				tabIndex={-1}
			>
				<div className="modal__content">
					<header className="modal__header">
						<button
							type="button"
							className="modal__header-icon-close"
							onClick={handleCloseModal}
							aria-label="Fechar Modal"
						>
							<svg width="24" height="24" viewBox="0 0 40 40" fill="none">
								<title>Ícone de fechar</title>
								<g id="ic-porto-icon">
									<path
										id="Vector"
										d="M21.1666 20.0324L34.7666 6.43242C35.0999 6.09909 35.0999 5.56576 34.7666 5.26576C34.4333 4.93242 33.8999 4.93242 33.5999 5.26576L20.0333 18.8658L6.43327 5.23242C6.09993 4.89909 5.5666 4.89909 5.2666 5.23242C4.93327 5.56576 4.93327 6.09909 5.2666 6.39909L18.8333 19.9991L5.29993 33.5658C4.9666 33.8991 4.9666 34.4324 5.29993 34.7324C5.4666 34.8991 5.6666 34.9658 5.89993 34.9658C6.13327 34.9658 6.33327 34.8991 6.49993 34.7324L19.9999 21.1991L33.4999 34.7324C33.4999 34.7324 33.8666 34.9658 34.0999 34.9658C34.3333 34.9658 34.5333 34.8991 34.6999 34.7324C35.0333 34.3991 35.0333 33.8658 34.6999 33.5658L21.1999 20.0324H21.1666Z"
										fill="black"
									/>
								</g>
							</svg>
						</button>

						<div>
							<p id="modal-title" className="modal__header-title">
								{title}
							</p>
							<p id="modal-subtitle" className="modal__header-subtitle">
								{subtitle}
							</p>
						</div>
					</header>

					<div className="modal__body">{children}</div>
				</div>
			</div>
		</>
	);
};

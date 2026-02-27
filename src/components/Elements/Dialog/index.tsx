import { clsx } from "@/utils";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import "./styles.scss";

import type { DialogProps } from "./types";

/**
 * `Dialog` — Componente de modal interativo para exibição de conteúdo sobreposto à interface.
 *
 * Ideal para mensagens de confirmação, alertas, formulários ou qualquer conteúdo que demande atenção imediata do usuário.
 * Suporta título, subtítulo, descrição, ícone, rodapé com botões, diferentes tamanhos e temas visuais.
 *
 * @component
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 *
 * <Dialog
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Confirmar ação"
 *   description="Tem certeza que deseja continuar?"
 *   footer={
 *     <>
 *       <Button onClick={() => setIsOpen(false)}>Cancelar</Button>
 *       <Button onClick={() => confirmar()}>Confirmar</Button>
 *     </>
 *   }
 * />
 * ```
 *
 * @param {Object} props - Propriedades do componente
 * @param {boolean} props.isOpen - Define se o diálogo está visível
 * @param {() => void} [props.onClose] - Função chamada ao clicar fora da caixa de diálogo (overlay)
 * @param {'small' | 'medium' | 'large'} [props.variant='small'] - Tamanho da caixa de diálogo
 * @param {'light' | 'dark'} [props.theme='light'] - Tema visual do modal
 * @param {React.ReactNode} [props.title] - Título principal exibido no cabeçalho
 * @param {React.ReactNode} [props.subtitle] - Subtítulo ou informação complementar
 * @param {React.ReactNode} [props.description] - Texto explicativo abaixo do cabeçalho
 * @param {IconProps} [props.icon] - Ícone decorativo exibido ao lado do título
 * @param {React.ReactNode} [props.children] - Conteúdo principal do modal (corpo)
 * @param {React.ReactNode} [props.footer] - Rodapé do modal, geralmente com botões de ação
 * @param {'row' | 'column'} [props.footerVariant='row'] - Layout dos itens do rodapé: horizontal ou vertical
 * @param {string} [props.className=''] - Classe CSS adicional para personalização externa
 * @param {React.HTMLAttributes<HTMLDivElement>} props.restProps - Outras props HTML aplicáveis à div raiz
 *
 * @returns {JSX.Element | null} O componente renderizado ou `null` se não estiver montado
 */

export const Dialog = ({
	isOpen,
	onClose,
	variant = "small",
	title,
	subtitle,
	description,
	icon,
	children,
	footer,
	footerVariant = "row",
	...restProps
}: DialogProps) => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	const handleOverlayClick = () => {
		if (onClose) {
			onClose();
		}
	};

	if (!mounted) {
		return null;
	}

	const overlayClasses = clsx("dialog", "dialog__overlay", {
		"dialog__overlay--open": isOpen,
	});

	const boxClasses = clsx("dialog__box", `--${variant}`);

	return createPortal(
		<div className={overlayClasses} onClick={handleOverlayClick} {...restProps}>
			<div
				className={boxClasses}
				onClick={(e) => e.stopPropagation()}
				onKeyDown={(e) => e.stopPropagation()}
			>
				{(title || subtitle || icon) && (
					<div className="dialog__header">
						{icon && <X className="dialog__icon" />}

						{(title || subtitle) && (
							<div className="dialog__title-container">
								{title && <h2 className="dialog__title">{title}</h2>}
								{subtitle && <h3 className="dialog__subtitle">{subtitle}</h3>}
							</div>
						)}
					</div>
				)}

				{description && (
					<div className="dialog__description">{description}</div>
				)}

				{children && <div className="dialog__body">{children}</div>}

				{footer && (
					<div className={clsx("dialog__footer", `--${footerVariant}`)}>
						{footer}
					</div>
				)}
			</div>
		</div>,
		document.body,
	);
};

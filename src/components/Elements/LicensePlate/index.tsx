/** biome-ignore-all lint/a11y/noStaticElementInteractions: <> */

import "./styles.scss";

import { maskLicensePlate } from "@/utils";
import { Input } from "../Input";

/**
 * Componente LicensePlate que permite a entrada de texto com vários estados e feedbacks visuais.
 *
 * @component
 * @param {Object} props - As propriedades do componente LicensePlate
 * @param {string} [props.className=""] - Classes CSS adicionais para o LicensePlate
 * @param {string} [props.name=""] - Nome do campo de entrada, usado para identificação em formulários
 * @param {"default" | string} [props.variant="default"] - Variante visual do LicensePlate
 * @param {"contain" | "fluid"} [props.width="contain"] - Largura do LicensePlate (contain: ajustado ao conteúdo, fluid: ocupa todo o espaço disponível)
 * @param {boolean} [props.disabled=false] - Indica se o LicensePlate está desabilitado
 * @param {string | number} [props.value=""] - Valor atual do LicensePlate
 * @param {boolean} [props.isLoading=false] - Indica se o LicensePlate está em estado de carregamento
 * @param {string} [props.helperText=""] - Texto de ajuda exibido abaixo do LicensePlate
 * @param {string} [props.errorMessage=""] - Mensagem de erro exibida quando há um erro de validação
 * @param {string} [props.label=""] - Rótulo do LicensePlate
 * @param {React.ReactNode} [props.children] - Conteúdo adicional do LicensePlate
 * @param {Function} [props.onChange] - Função chamada quando o valor do LicensePlate muda
 *
 * @example
 * // LicensePlate básico com label
 * <LicensePlate label="Placa" name="placa" />
 *
 * @example
 * // LicensePlate com texto de ajuda
 * <LicensePlate
 *   label="Email"
 *   name="email"
 *   helperText="Digite seu email principal"
 * />
 *
 * @example
 * // LicensePlate com mensagem de erro
 * <LicensePlate
 *   label="Placa"
 *   name="placa"
 *   errorMessage="Campo obrigatório"
 * />
 *
 * @example
 * // LicensePlate em estado de carregamento
 * <LicensePlate
 *   label="placa"
 *   name="placa"
 *   isLoading={true}
 * />
 *
 * @returns {JSX.Element} Componente LicensePlate renderizado
 */

export const LicensePlate = ({
	value = "",
	onChange,
	label,
	isLoading,
	errorMessage,
	...props
}: any) => {
	return (
		<Input
			value={value}
			onChange={(value) => onChange(maskLicensePlate(value))}
			label={label}
			isLoading={isLoading}
			errorMessage={errorMessage}
			style={{ marginBottom: "32px" }}
			{...props}
		/>
	);
};

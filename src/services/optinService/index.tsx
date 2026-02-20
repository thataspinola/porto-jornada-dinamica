'use server';
import { env } from 'next-runtime-env';

import { authorizedApi } from '@/lib';

const basePath = env('NEXT_PUBLIC_SENSEDIA_CLOUD_URL');
const client = env('NEXT_PUBLIC_OLD_CLIENT_SERVICE_PATH');

import axios from 'axios';
import type { OptinServiceResponse } from './type';

export const optinService = async (payload: {
	taxvat: string;
}): Promise<OptinServiceResponse> => {
	const endpoint = `${basePath}/${client}/cadastros/consentimento/status-optin-marketing`;
	const optinStatus = ['ACCEPTED', 'TAXVAT_NOT_FOUND'];

	try {
		const response = await authorizedApi.post(endpoint, payload);

		if (optinStatus.includes(response.data?.status)) {
			return {
				taxvat: payload.taxvat,
				optinMarketing: false,
				status: response.data?.status,
			};
		}

		if (response.data?.status === 'DENIED') {
			return {
				taxvat: payload.taxvat,
				optinMarketing: true,
				status: response.data?.status,
			};
		}

		return {
			taxvat: payload.taxvat,
			optinMarketing: true,
			status: response.data?.status,
		};
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			console.error(
				'Erro na resposta da API:',
				error.response.status,
				error.response.data
			);
			throw new Error(`Falha na consulta: ${error.response.status}`);
		} else {
			console.error('Erro ao fazer requisição:', error);
			throw new Error('Erro de rede ou configuração.');
		}
	}
};

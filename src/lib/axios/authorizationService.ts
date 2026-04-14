'use server';

import { env } from 'next-runtime-env';

import { api } from '.';

export type AuthorizationServiceResponse = {
  access_token: string;
};

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
const dynamoDbClient = new DynamoDBClient({
  region: 'ca-central-1',
})
const dynamoDbDocumentClient = DynamoDBDocumentClient.from(dynamoDbClient)

const authorizationServiceLocal = async () => {
  const endpoint = `${env('NEXT_PUBLIC_CARBON_BASE_URL')}/oauth/v2/access-token`;

  const configHeaders = {
    headers: {
      Authorization: `Basic ${process.env.TOKEN}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  const body = { grant_type: 'client_credentials' };

  const httpResponse = await api.post<AuthorizationServiceResponse>(
    endpoint,
    body,
    configHeaders,
  );

  if (httpResponse.status !== 200 || !httpResponse.data?.access_token) {
    return { access_token: '' };
  }

  return httpResponse.data;
}

export async function AuthorizationService() {
  try {
    if (env('NEXT_PUBLIC_LOCAL_ENV')) {
      return await authorizationServiceLocal()
    }
    const getCommand = new GetCommand({
      TableName: 'hubv-bff-apiintsrv-token',//TODO: Add environment var with the tablename value
      Key: {
        HPK: `apiGateway#${'SENSEDIA_CLOUD'}#clientId#${'MIDDLEWARE'}`,
        RSK: `apiGateway#${'SENSEDIA_CLOUD'}`,
      },//TODO: Add environment var with api integration server identifier value 'SENSEDIA_CLOUD'; Add environment var with client id identifier value 'MIDDLEWARE'
    })

    const getCommandResponse = await dynamoDbDocumentClient.send(getCommand)
    const returnUnparsedMessage = getCommandResponse?.Item?.message ? getCommandResponse.Item.message : null
    if (returnUnparsedMessage === null) {
      throw new Error('Credenciais ausentes')
    }
    const parsedMessage = JSON.parse(returnUnparsedMessage)
    if (!parsedMessage.token) {
      throw new Error('Credenciais vazias')
    }
    return { access_token: parsedMessage.token }
  } catch (authorizationServiceError: any) {
    //TODO: How to log error?
    throw new Error(
      `Erro ao obter credenciais para comunicação com o middleware: ${authorizationServiceError.message}`,
      {
        cause: authorizationServiceError,
      }
    )
  }
}

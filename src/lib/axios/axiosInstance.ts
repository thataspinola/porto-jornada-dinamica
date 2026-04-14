import axios from 'axios';
import { AuthorizationService } from './authorizationService';
import { RecaptchaServiceSiteVerify } from './recaptchaServiceSiteVerify';

const createAxiosInstance = () => {
  return axios.create({
    validateStatus: (status) => status >= 200 && status <= 404,
  })
}

const api = createAxiosInstance()
api.defaults.headers['X-Content-Type-Options'] = 'nosniff'
api.defaults.headers['Strict-Transport-Security'] = 'max-age=15724800'

const authorizedApi = createAxiosInstance()
const addAuthToken = async (config: any) => {
  const { access_token } = await AuthorizationService()
  if (access_token) {
    config.headers.Authorization = `Bearer ${access_token}`
  }
}

authorizedApi.interceptors.request.use(
  async (config) => {
    const token = config.headers['X-Recaptcha-Token']
    const action = config.headers['X-Recaptcha-Action'] ?? 'submit'

    if (!token) {
      throw new Error('Token do reCAPTCHA ausente')
    }

    const recaptchaSiteVerifyResult = await RecaptchaServiceSiteVerify({
      recaptchaToken: token,
      recaptchaAction: action,
    })

    config.headers['X-Recaptcha-Token'] = undefined
    config.headers['X-Recaptcha-Action'] = undefined

    if (!recaptchaSiteVerifyResult.isValid) {
      throw new Error(recaptchaSiteVerifyResult.message)
    }
    await addAuthToken(config)

    return config
  },
  (error) => Promise.reject(error),
)

authorizedApi.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => Promise.reject(error),
)

export { api, authorizedApi };


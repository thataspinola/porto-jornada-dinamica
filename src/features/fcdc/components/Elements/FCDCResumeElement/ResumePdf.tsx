import {
  Document,
  Link,
  Page,
  Path,
  StyleSheet,
  Svg,
  Text,
  View
} from '@react-pdf/renderer'
import { Fragment } from 'react'

import type { FCDCResumeOption } from './FCDCResumeElement.types'

export type ResumePdfProps = {
  pageTitle: string
  pageDescription: string
  preTitle?: string
  title?: string
  options: FCDCResumeOption[]
}

const _PORTO_LOGO_PATH =
  'M109.922 23.8c-3.22 0-5.364-2.49-5.364-6.086 0-3.594 2.146-6.088 5.364-6.088 3.179 0 5.326 2.489 5.326 6.086 0 3.597-2.147 6.086-5.326 6.086v.003Zm0-16.374c-5.9 0-10.12 4.347-10.12 10.277 0 5.93 4.213 10.274 10.12 10.274 5.862 0 10.078-4.347 10.078-10.274 0-5.928-4.216-10.265-10.078-10.265M88.35 1.75v18.97c0 4.426 2.76 6.956 6.975 6.956h3.14v-4.388H95.86c-1.761 0-2.797-1.027-2.797-3.042v-8.419h5.401V7.756h-5.4V1.75H88.35ZM79.425 27.674V15.186c0-2.017 1.035-3.045 2.797-3.045h3.752V7.754h-4.288c-4.216 0-6.974 2.53-6.974 6.957v12.963h4.713ZM62.555 23.803c-3.22 0-5.364-2.492-5.364-6.087 0-3.595 2.146-6.088 5.364-6.088 3.18 0 5.325 2.489 5.325 6.086 0 3.597-2.146 6.086-5.325 6.086v.003Zm0-16.375c-5.9 0-10.12 4.347-10.12 10.276 0 5.93 4.232 10.296 10.12 10.296 5.861 0 10.075-4.347 10.075-10.274 0-5.927-4.214-10.277-10.075-10.277M43.166 12.775h-5.44V4.397h5.44c2.99 0 4.217 1.974 4.217 4.188 0 2.214-1.227 4.19-4.217 4.19ZM43.396.01H32.631v27.665h5.095V17.163h5.67c5.594 0 8.928-3.56 8.928-8.578C52.324 3.566 48.99 0 43.395 0M24.588 15.048c-2.472-3.02-10.627-1.44-16.98.582a.115.115 0 0 1-.108-.01.115.115 0 0 1-.053-.094c0-.32.014-.643.014-.96.006-1.61-.129-3.217-.405-4.804a.105.105 0 0 1 .085-.117c5.258-1.922 15.85-2.503 17.662 5.32.029.114-.143.182-.217.086l.002-.003Zm-5.323 8.776c-.174.127-.4-.082-.241-.24 2.559-2.609 4.66-6.744-13.884 1.68-.113.051-.226-.067-.151-.16 1.021-1.441 1.927-3.8 2.344-7.123a.115.115 0 0 1 .073-.094c11.62-4.652 24.747-4.479 11.868 5.941l-.01-.004ZM3.76 3.026a.106.106 0 0 1 .06-.2c3.215 0 12.9-.24 17.893 6.108.068.11-.089.22-.188.134C20.02 7.762 15.942 5.55 6.543 7.486a.123.123 0 0 1-.15-.08c-.747-2.382-1.686-3.672-2.633-4.38ZM24.405 0H3.287A3.317 3.317 0 0 0 .954.983 3.294 3.294 0 0 0 0 3.32v21.355a3.29 3.29 0 0 0 .953 2.34A3.313 3.313 0 0 0 3.287 28h21.118a3.32 3.32 0 0 0 2.334-.983 3.299 3.299 0 0 0 .953-2.34V3.33a3.291 3.291 0 0 0-.95-2.345A3.311 3.311 0 0 0 24.405 0Z'

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontFamily: 'Helvetica',
    color: '#1A1A1A',
    backgroundColor: '#FFFFFF'
  },
  logoContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24
  },
  container: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    paddingHorizontal: 12,
    paddingVertical: 16
  },
  header: {
    flexDirection: 'column',
    gap: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#D9D9D9',
    marginBottom: 16
  },
  logo: {
    width: 164
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'medium',
    color: 'black',
    letterSpacing: '2px'
  },
  pageDescription: {
    fontSize: 12,
    marginBottom: 24,
    paddingHorizontal: 12
  },
  preTitle: {
    fontSize: 12,
    color: '#4D4D4D'
  },
  title: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: '#1A1A1A'
  },
  optionsContainer: {
    flexDirection: 'column',
    gap: 12
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8
  },
  optionLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1
  },
  optionLabel: {
    fontSize: 12,
    color: '#404040'
  },
  optionValue: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#1A1A1A'
  },
  tag: {
    paddingHorizontal: 8,
    borderRadius: 6,
    height: 28,
    backgroundColor: '#c0f0d3',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  tagText: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#29684e'
  },
  divider: {
    height: 1,
    backgroundColor: '#D9D9D9'
  },
  specialConditions: {
    marginTop: 16,
    fontSize: 10,
    color: '#4D4D4D',
    lineHeight: 1.5,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    padding: 12,
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  },
  specialConditionsText: {
    fontSize: 8,
    color: '#4D4D4D',
    lineHeight: 1.5
  },
  specialConditionsLink: {
    fontSize: 8,
    color: '#0046C0',
    textDecoration: 'underline'
  }
})

export function ResumePdf({
  preTitle,
  title,
  options,
  pageTitle,
  pageDescription
}: ResumePdfProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <View style={styles.logoContainer}>
            <Svg fill="none" viewBox="0 0 477 95" style={styles.logo}>
              <Path
                fill="#2C3DA8"
                d="M82.1262 50.543C73.8657 40.3963 46.6303 45.7039 25.4095 52.5013C25.1429 52.5928 24.8654 52.4134 24.8727 52.1535C24.9055 51.081 24.9201 49.9939 24.9201 48.8994C24.9201 42.9403 24.4344 37.8157 23.5653 32.7717C23.5324 32.5923 23.653 32.4239 23.8465 32.3727C41.4119 25.9523 76.7909 23.9647 82.8456 50.2538L82.8493 50.2575C82.9479 50.6418 82.3782 50.8687 82.1262 50.543ZM64.3454 80.0386C63.7648 80.4705 63.0052 79.7604 63.5018 79.2516C72.0508 70.4922 79.0769 56.5936 17.1308 84.863C16.751 85.035 16.3712 84.6397 16.6232 84.3286C20.0376 79.4383 23.0833 71.5574 24.46 60.3858C24.4746 60.2504 24.5659 60.1296 24.701 60.0747C63.5201 44.4411 107.36 45.0157 64.3454 80.0386ZM12.5221 10.1247C12.1679 9.94533 12.3176 9.45484 12.7193 9.45484C23.4594 9.48778 55.8111 8.68249 72.4854 29.9824C72.7118 30.3485 72.1932 30.7218 71.8609 30.429C66.8287 26.0402 53.2073 18.6059 21.8161 25.1141C21.597 25.169 21.3706 25.0482 21.3158 24.8469C18.8216 16.8379 15.6445 12.5076 12.5221 10.1247ZM81.5127 0H10.9774C4.91537 0 0 5.00012 0 11.1679V82.9376C0 89.1054 4.91537 94.1055 10.9774 94.1055H81.5164C87.5784 94.1055 92.4938 89.1054 92.4938 82.9376V11.1679C92.4901 5.00012 87.5747 0 81.5127 0Z"
              />

              <Path
                fill="#2C3DA8"
                d="M108.189 18.0173H130.878C142.666 18.0173 149.689 25.3015 149.689 35.58C149.689 45.8584 142.663 53.1426 130.878 53.1426H118.929V74.6695H108.189V18.0173ZM130.392 44.16C136.692 44.16 139.274 40.1152 139.274 35.58C139.274 31.0484 136.692 27 130.392 27H118.926V44.1563H130.392V44.16ZM171.165 33.2337C183.519 33.2337 192.401 42.1358 192.401 54.2737C192.401 66.4116 183.519 75.3138 171.165 75.3138C158.731 75.3138 149.849 66.4116 149.849 54.2737C149.849 42.1358 158.734 33.2337 171.165 33.2337ZM171.165 66.7374C177.866 66.7374 182.387 61.6385 182.387 54.2737C182.387 46.909 177.866 41.81 171.165 41.81C164.384 41.81 159.863 46.909 159.863 54.2737C159.863 61.6385 164.384 66.7374 171.165 66.7374ZM196.922 48.4463C196.922 39.1379 202.169 33.8779 211.456 33.8779H220.578V42.2126H212.99C209.035 42.2126 206.855 44.4785 206.855 48.4427V74.6622H196.925V48.4463H196.922ZM225.585 21.5789H235.514V33.8816H246.817V42.2163H235.514V60.0206C235.514 64.1495 237.694 66.2506 241.408 66.2506H246.817V74.6659H240.276C231.395 74.6659 225.581 69.4864 225.581 60.4232V21.5789H225.585ZM271.123 33.2337C283.478 33.2337 292.359 42.1358 292.359 54.2737C292.359 66.4116 283.478 75.3138 271.123 75.3138C258.689 75.3138 249.808 66.4116 249.808 54.2737C249.808 42.1358 258.689 33.2337 271.123 33.2337ZM271.123 66.7374C277.824 66.7374 282.345 61.6385 282.345 54.2737C282.345 46.909 277.824 41.81 271.123 41.81C264.342 41.81 259.821 46.909 259.821 54.2737C259.817 61.6385 264.342 66.7374 271.123 66.7374Z"
              />

              <Path
                fill="black"
                d="M301.883 18.0173H323.765C334.1 18.0173 341.447 23.1968 341.447 32.5858C341.447 37.9263 338.055 41.9747 334.585 43.7537C339.913 45.7779 344.274 50.3095 344.274 57.9158C344.274 68.4359 336.44 74.6695 324.572 74.6695H301.883V18.0173ZM323.038 40.1921C328.691 40.1921 331.518 37.7652 331.518 33.3947C331.518 29.0242 328.691 26.5973 322.877 26.5973H312.382V40.1921H323.038ZM323.44 65.3611C330.627 65.3611 334.016 62.6085 334.016 57.3485C334.016 52.169 330.623 49.2553 323.44 49.2553H312.378V65.3611H323.44Z"
              />

              <Path
                fill="black"
                d="M366.393 40.6787C361.145 40.6787 357.997 43.995 357.833 47.6371H348.951C349.437 39.544 356.299 33.2334 366.875 33.2334C377.209 33.2334 384.477 39.2218 384.477 48.4497V74.6693H374.708V68.6003C373.013 72.6451 368.328 75.3172 362.514 75.3172C354.44 75.3172 348.951 70.1377 348.951 63.0987C348.951 55.1666 355.087 50.2324 364.212 50.2324H374.708V48.5339C374.708 43.5118 371.64 40.6787 366.393 40.6787ZM364.859 67.9524C371.074 67.9524 374.708 63.5819 374.708 57.4324V56.9455H366.068C361.386 56.9455 358.559 59.1308 358.559 62.6924C358.559 65.8477 361.145 67.9524 364.859 67.9524Z"
              />

              <Path
                fill="black"
                d="M391.503 33.8808H401.432V40.195C403.693 35.744 408.294 33.2366 414.108 33.2366C423.31 33.2366 429.288 39.8729 429.288 49.4229V74.6724H419.359V51.5277C419.359 45.9419 415.966 42.0582 410.883 42.0582C405.31 42.0582 401.436 46.4287 401.436 52.4171V74.6724H391.506V33.8808H391.503Z"
              />

              <Path
                fill="black"
                d="M437.52 74.6693V16.3992H447.449V48.7719L463.032 33.8813H475.627L459.077 49.9066L477 74.6693H464.971L452.295 56.4587L447.449 61.1514V74.6656H437.52V74.6693Z"
              />
            </Svg>

            <Text style={styles.pageTitle}>{pageTitle}</Text>
          </View>

          <Text style={styles.pageDescription}>{pageDescription}</Text>
        </View>

        <View style={styles.container}>
          {(preTitle || title) && (
            <View style={styles.header}>
              {preTitle && <Text style={styles.preTitle}>{preTitle}</Text>}
              {title && <Text style={styles.title}>{title}</Text>}
            </View>
          )}

          <View style={styles.optionsContainer}>
            {options.map((option, index) => (
              <Fragment key={`${option.label}-${index}`}>
                <View style={styles.option} wrap={false}>
                  <View style={styles.optionLabelGroup}>
                    <Text style={styles.optionLabel}>{option.label}</Text>
                  </View>

                  {option.tag && (
                    <View style={styles.tag}>
                      <Text style={styles.tagText}>{option.tag.label}</Text>
                    </View>
                  )}

                  {option.value && (
                    <Text style={styles.optionValue}>{option.value}</Text>
                  )}
                </View>

                {option.hasDivider && <View style={styles.divider} />}
              </Fragment>
            ))}
          </View>
        </View>

        <View style={styles.specialConditions}>
          <Text style={styles.specialConditionsText}>
            Condição válida para propostas de Pessoa Física e contratação do
            Financiamento de Veículo.
          </Text>
          <Link
            href="https://www.portoseguro.com.br/politica-de-privacidade"
            style={styles.specialConditionsLink}>
            Política de Privacidade
          </Link>
          <Text style={styles.specialConditionsText}>
            Consulte demais prazos, taxas e tarifas no momento da contratação. A
            liberação do crédito está sujeita à análise de crédito, à revisão
            das condições cadastrais no momento da solicitação e às demais
            condições do produto. Condições sujeitas a alteração, sem prévio
            aviso. Condições válidas para veículos de passeio com até 10 anos de
            fabricação, exclusivamente PF. Se o veículo estiver em nome do
            cônjuge, ascendentes ou descendentes, serão considerados como
            Empréstimo com Garantia de Veículo, sofrendo agravo na taxa.
          </Text>
        </View>
      </Page>
    </Document>
  )
}

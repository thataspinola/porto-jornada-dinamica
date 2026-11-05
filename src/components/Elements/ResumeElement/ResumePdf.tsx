import {
  Document,
  Page,
  Path,
  StyleSheet,
  Svg,
  Text,
  View
} from '@react-pdf/renderer'
import { Fragment } from 'react'

import type { ResolvedResumeOption } from './types'

export type ResumePdfProps = {
  preTitle?: string
  title?: string
  options: ResolvedResumeOption[]
}

const PORTO_LOGO_PATH =
  'M109.922 23.8c-3.22 0-5.364-2.49-5.364-6.086 0-3.594 2.146-6.088 5.364-6.088 3.179 0 5.326 2.489 5.326 6.086 0 3.597-2.147 6.086-5.326 6.086v.003Zm0-16.374c-5.9 0-10.12 4.347-10.12 10.277 0 5.93 4.213 10.274 10.12 10.274 5.862 0 10.078-4.347 10.078-10.274 0-5.928-4.216-10.265-10.078-10.265M88.35 1.75v18.97c0 4.426 2.76 6.956 6.975 6.956h3.14v-4.388H95.86c-1.761 0-2.797-1.027-2.797-3.042v-8.419h5.401V7.756h-5.4V1.75H88.35ZM79.425 27.674V15.186c0-2.017 1.035-3.045 2.797-3.045h3.752V7.754h-4.288c-4.216 0-6.974 2.53-6.974 6.957v12.963h4.713ZM62.555 23.803c-3.22 0-5.364-2.492-5.364-6.087 0-3.595 2.146-6.088 5.364-6.088 3.18 0 5.325 2.489 5.325 6.086 0 3.597-2.146 6.086-5.325 6.086v.003Zm0-16.375c-5.9 0-10.12 4.347-10.12 10.276 0 5.93 4.232 10.296 10.12 10.296 5.861 0 10.075-4.347 10.075-10.274 0-5.927-4.214-10.277-10.075-10.277M43.166 12.775h-5.44V4.397h5.44c2.99 0 4.217 1.974 4.217 4.188 0 2.214-1.227 4.19-4.217 4.19ZM43.396.01H32.631v27.665h5.095V17.163h5.67c5.594 0 8.928-3.56 8.928-8.578C52.324 3.566 48.99 0 43.395 0M24.588 15.048c-2.472-3.02-10.627-1.44-16.98.582a.115.115 0 0 1-.108-.01.115.115 0 0 1-.053-.094c0-.32.014-.643.014-.96.006-1.61-.129-3.217-.405-4.804a.105.105 0 0 1 .085-.117c5.258-1.922 15.85-2.503 17.662 5.32.029.114-.143.182-.217.086l.002-.003Zm-5.323 8.776c-.174.127-.4-.082-.241-.24 2.559-2.609 4.66-6.744-13.884 1.68-.113.051-.226-.067-.151-.16 1.021-1.441 1.927-3.8 2.344-7.123a.115.115 0 0 1 .073-.094c11.62-4.652 24.747-4.479 11.868 5.941l-.01-.004ZM3.76 3.026a.106.106 0 0 1 .06-.2c3.215 0 12.9-.24 17.893 6.108.068.11-.089.22-.188.134C20.02 7.762 15.942 5.55 6.543 7.486a.123.123 0 0 1-.15-.08c-.747-2.382-1.686-3.672-2.633-4.38ZM24.405 0H3.287A3.317 3.317 0 0 0 .954.983 3.294 3.294 0 0 0 0 3.32v21.355a3.29 3.29 0 0 0 .953 2.34A3.313 3.313 0 0 0 3.287 28h21.118a3.32 3.32 0 0 0 2.334-.983 3.299 3.299 0 0 0 .953-2.34V3.33a3.291 3.291 0 0 0-.95-2.345A3.311 3.311 0 0 0 24.405 0Z'

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontFamily: 'Helvetica',
    color: '#1A1A1A',
    backgroundColor: '#FFFFFF'
  },
  logoContainer: {
    marginBottom: 24
  },
  container: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    padding: 24
  },
  header: {
    flexDirection: 'column',
    gap: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#D9D9D9',
    marginBottom: 16
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
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: '#E6F4EA'
  },
  tagText: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#1F7A3D'
  },
  divider: {
    height: 1,
    backgroundColor: '#D9D9D9'
  }
})

export function ResumePdf({ preTitle, title, options }: ResumePdfProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.logoContainer}>
          <Svg width={120} height={28} viewBox="0 0 120 28">
            <Path fill="#00A1FC" d={PORTO_LOGO_PATH} />
          </Svg>
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
                    {option.tag && (
                      <View style={styles.tag}>
                        <Text style={styles.tagText}>{option.tag.label}</Text>
                      </View>
                    )}
                  </View>

                  {option.value && (
                    <Text style={styles.optionValue}>{option.value}</Text>
                  )}
                </View>

                {option.hasDivider && <View style={styles.divider} />}
              </Fragment>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  )
}

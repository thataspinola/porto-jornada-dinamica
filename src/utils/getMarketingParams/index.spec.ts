import { getMarketingParams } from '.'

describe('getMarketingParams', () => {
  it('should return an empty object when search is empty', () => {
    expect(getMarketingParams('')).toEqual({})
  })

  it('should collect the standard UTM set and convert keys to camelCase', () => {
    const search =
      '?utm_source=google&utm_medium=cpc&utm_campaign=fim_de_ano&utm_term=carro&utm_content=banner_a&utm_id=abc123'

    expect(getMarketingParams(search)).toEqual({
      utmSource: 'google',
      utmMedium: 'cpc',
      utmCampaign: 'fim_de_ano',
      utmTerm: 'carro',
      utmContent: 'banner_a',
      utmId: 'abc123'
    })
  })

  it('should collect any dynamic utm_* param', () => {
    const search = '?utm_marketing_tactic=retargeting&utm_creative_format=video'

    expect(getMarketingParams(search)).toEqual({
      utmMarketingTactic: 'retargeting',
      utmCreativeFormat: 'video'
    })
  })

  it('should collect the fixed set of non-utm marketing params in camelCase', () => {
    const search =
      '?link_uuid=abc-123&susep=456&social_media=instagram&id_google=g1&id_link=l1&gclid=g123&fbclid=f123&msclkid=m123'

    expect(getMarketingParams(search)).toEqual({
      linkUuid: 'abc-123',
      susep: '456',
      socialMedia: 'instagram',
      idGoogle: 'g1',
      idLink: 'l1',
      gclid: 'g123',
      fbclid: 'f123',
      msclkid: 'm123'
    })
  })

  it('should ignore params outside the allowed list', () => {
    const search = '?utm_source=google&foo=bar&ref=home&gad_source=1'

    expect(getMarketingParams(search)).toEqual({
      utmSource: 'google'
    })
  })

  it('should omit params with empty values', () => {
    const search = '?utm_source=&utm_campaign=promo&link_uuid='

    expect(getMarketingParams(search)).toEqual({
      utmCampaign: 'promo'
    })
  })

  it('should accept a search string without the leading question mark', () => {
    expect(getMarketingParams('utm_source=google&link_uuid=abc')).toEqual({
      utmSource: 'google',
      linkUuid: 'abc'
    })
  })
})

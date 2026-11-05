/** @type {import("stylelint").Config} */
export default {
  extends: ['stylelint-config-standard-scss', 'stylelint-config-recess-order'],
  rules: {
    'custom-property-pattern': null,
    'selector-class-pattern': [
      '^[a-z][a-zA-Z0-9]+$',
      { message: 'Use camelCase nos nomes de classe' }
    ],
    'selector-pseudo-class-no-unknown': [
      true,
      { ignorePseudoClasses: ['global', 'local'] }
    ],
    'scss/dollar-variable-pattern': '^[a-z][a-zA-Z0-9]+$',
    'scss/at-mixin-pattern': '^[a-z][a-zA-Z0-9]+$',
    'keyframes-name-pattern': [
      '^[a-z][a-zA-Z0-9]+$',
      { message: 'Use camelCase nos nomes de keyframes' }
    ],
    'declaration-block-no-duplicate-properties': [true, { ignore: [] }]
  }
}

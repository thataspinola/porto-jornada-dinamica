/** @type {import("stylelint").Config} */
export default {
  "extends": [
    "stylelint-config-standard-scss",
    "stylelint-config-recess-order"
  ],
  "rules": {
    "custom-property-pattern": null,
    "selector-class-pattern": [
      "^(?:[a-zA-Z][a-zA-Z0-9_-]*|--[a-zA-Z0-9_-]+)$",
      {
        "message": "Use camelCase ou as classes BEM existentes"
      }
    ],
    "selector-pseudo-class-no-unknown": [
      true,
      {
        "ignorePseudoClasses": [
          "global",
          "local"
        ]
      }
    ],
    "scss/dollar-variable-pattern": "^(?:[a-zA-Z][a-zA-Z0-9_-]*|--[a-zA-Z0-9_-]+)$",
    "scss/at-mixin-pattern": "^(?:[a-zA-Z][a-zA-Z0-9_-]*|--[a-zA-Z0-9_-]+)$",
    "keyframes-name-pattern": [
      "^(?:[a-zA-Z][a-zA-Z0-9_-]*|--[a-zA-Z0-9_-]+)$",
      {
        "message": "Use camelCase ou kebab-case nos nomes de keyframes"
      }
    ],
    "declaration-block-no-duplicate-properties": [
      true,
      {
        "ignore": []
      }
    ]
  }
};

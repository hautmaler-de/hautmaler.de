export default {
  extends: ['html-validate:recommended'],
  rules: {
    'attribute-boolean-style': ['error', { style: 'omit' }],
    'doctype-style': ['error', { style: 'lowercase' }],
    'no-inline-style': 'error',
    'no-trailing-whitespace': 'error',
    'prefer-native-element': 'error',
    'wcag/h37': 'error'
  }
};

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
  },
  env: {
    browser: true,
  },
  extends: [
    'airbnb-base',
    'plugin:vue/recommended'
  ],
  plugins: [
    'vue',
  ],
  globals: {
    cordova: true,
    ContactFindOptions: true,
    jest: true,
    sms: true,
    QRScanner: true,
  },
  rules: {
    'vue/require-default-prop': 0,
    'no-param-reassign': 0,
    'import/first': 0,
    'import/named': 2,
    'import/namespace': 2,
    'import/default': 2,
    'import/export': 2,
    'import/prefer-default-export': 0,
    'import/extensions': 0,
    'import/no-unresolved': 0,
    'import/no-extraneous-dependencies': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'arrow-body-style': ['error', 'always'],
    'vue/component-name-in-template-casing': ["error", "kebab-case", {
      "registeredComponentsOnly": true,
      "ignores": []
    }]
  },
};

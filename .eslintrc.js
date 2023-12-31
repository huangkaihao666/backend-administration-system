
/* eslint-env node */
module.exports = {
    root: true,
    'extends': [
      'plugin:vue/vue3-essential',
      'eslint:recommended'
    ],
    parser: "vue-eslint-parser",
    parserOptions: {
      ecmaVersion: 'latest'
    },
    rules: {
      'vue/multi-word-component-names': 0,//不强制要求组件命名
    }
  }
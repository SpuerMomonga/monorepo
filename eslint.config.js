import antfu from '@antfu/eslint-config'

export default antfu(
  {
    formatters: true,
    solid: true,
    regexp: false,
    typescript: true,
  },
  {
    rules: {
      'n/prefer-global/process': 'off',
      'no-control-regex': 'off',
      'toml/padding-line-between-pairs': 'off',
      'brace-style': ['error', '1tbs', { allowSingleLine: true }],
      '@stylistic/brace-style': 'off',
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': 'off',
      'ts/no-unsafe-function-type': 'off',
      'pnpm/json-enforce-catalog': 'off',
      'pnpm/yaml-enforce-settings': 'off',
      'pnpm/json-prefer-workspace-settings': 'off',
      'ts/no-namespace': 'off',
      'unicorn/error-message': 'off',
    },
    ignores: [
      // ...globs
    ],
  },
)

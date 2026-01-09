import antfu from '@antfu/eslint-config';

export default antfu(
  {
    type: 'app',
    react: true,
    typescript: true,
    formatters: true,
    stylistic: {
      indent: 2,
      semi: true,
      quotes: 'single',
    },
  },
  {
    rules: {
      'react/no-array-index-key': 'off',
      'react-hooks-extra/no-direct-set-state-in-use-effect': 'off',
      'react/no-unstable-context-value': 'off',
      'react-refresh/only-export-components': 'off',
      'ts/no-unused-vars': 'off',
      'ts/no-redeclare': 'off',
      'ts/consistent-type-definitions': ['error', 'type'],
      'no-console': ['warn'],
      'antfu/no-top-level-await': ['off'],
      'node/prefer-global/process': ['off'],
      'node/no-process-env': ['error'],
      'perfectionist/sort-imports': [
        'error',
        {
          tsconfigRootDir: '.',
        },
      ],
      'unicorn/filename-case': [
        'error',
        {
          case: 'kebabCase',
          ignore: ['README.md'],
        },
      ],
    },
  },
);

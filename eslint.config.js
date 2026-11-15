import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import hooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default tseslint.config(
  { ignores: ['dist', 'dev-dist', 'reference', 'node_modules'] },
  { files: ['scripts/**/*.mjs'], languageOptions: { globals: globals.node } },
  js.configs.recommended,
  ...tseslint.configs.strict,
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
    plugins: { 'react-hooks': hooks },
    rules: { ...hooks.configs.recommended.rules },
  },
  {
    // noUncheckedIndexedAccess makes guarded non-null assertions the clearest idiom.
    rules: { '@typescript-eslint/no-non-null-assertion': 'off' },
  },
);

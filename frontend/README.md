# React + TypeScript + Vite

This project uses Vite with React and TypeScript, providing HMR and ESLint support.

## Plugins
Two official plugins are available — this project uses whichever fits your preference:
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) — uses Babel for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) — uses SWC for Fast Refresh

## ESLint Configuration
For production, upgrade to type-aware lint rules by replacing `tseslint.configs.recommended` with:
- `tseslint.configs.recommendedTypeChecked` — recommended
- `tseslint.configs.strictTypeChecked` — stricter
- `tseslint.configs.stylisticTypeChecked` — optional stylistic rules

Also set `parserOptions` to point at your tsconfig files:
```js
parserOptions: {
  project: ['./tsconfig.node.json', './tsconfig.app.json'],
  tsconfigRootDir: import.meta.dirname,
}
```

For React-specific rules, add:
- `eslint-plugin-react-x` — general React rules via `reactX.configs['recommended-typescript']`
- `eslint-plugin-react-dom` — DOM-specific rules via `reactDom.configs.recommended`

## React Compiler
Not enabled by default due to build performance impact. See [React Compiler docs](https://react.dev/learn/react-compiler/installation) to enable.

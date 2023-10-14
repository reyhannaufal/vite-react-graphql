# Phonebook Web Application

Welcome to the Phonebook web application project. This application is built using Typescript and React.js, and it allows users to manage their contact list. Please follow the instructions below to set up and run the project.

## Technical Requirements

- **Typescript**: This project is built using Typescript for type safety.
- **React.js**: The web app is built using React.js and follows the mobile-first and single page application (SPA) design principles.
- **GraphQL**: GraphQL is used to fetch and submit contact information. Apollo Client is used as the GraphQL client.
- **CSS in Js**: The project uses Emotion for styling.
- **Web Storage API**: Contact data should persist across page reloads using the Web Storage API.

## Getting Started

1. Clone this repository to your local machine.

   ```bash
   git clone <repository_url>
   ```

2. Install the dependencies.

   ```bash
   pnpm install
   ```

3. Create a `.env` file in the root directory of the project and add the following environment variables:

   ```bash
   GRAPHQL_ENDPOINT=<graphql_endpoint>
   ```

4. Start the development server.

   ```bash
   pnpm dev
   ```

5. This project have tests written using Jest and React Testing Library. To run the tests, run the following command:

   ```bash
   pnpm test
   ```

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
   parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
   },
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

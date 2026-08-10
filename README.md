# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
npx sv@0.15.1 create --template minimal --types ts --add prettier eslint tailwindcss="plugins:typography" sveltekit-adapter="adapter:static" mcp="ide:cursor+setup:local" --install npm ./
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.



## TODO:

- [] Remove theme and keep dark only
- [] Check the position of the years and font weight
- [] Add link on about for CV and contact email
- [] Redesign the about page
- [] Populate webp images and organize folders
- [] On the md renderer, remove the duplicated name and date/location
- [] Check more elegant fonts
- [] Check favicon
- [] Check Calvin title font and size
- [] Remove extra description from main page titles
  
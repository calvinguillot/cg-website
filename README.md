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

## TODO

- [x] Check the position of the years and font weight. I want that the year is aligned with the text., seams like it goes aobve the top of the frist proejct in each year
- [x] Add link on about page for CV, the extended one and contact email. The about page should have the picture in the middle, a bit bigger,  then the description, and after the description the link to cv, link to instagram and thats it
- [x] Change all to the basic times new roman
- [x] Check favicon, seams that its not working and it sould be the calvin_surf.ico
- [x] The Calvin Guillot on the navbar seems too small, same with the about fonts, they should be more porminent, same size of the titles font,  And year years same fotn but grey color

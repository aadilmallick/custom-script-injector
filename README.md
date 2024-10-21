# React Chrome Extension Boilerplate

Boilerplate for building Chrome Extensions in React and TypeScript using a simple Webpack build process.

## Getting Started

```bash
git clone https://github.com/aadilmallick/webpack-chrome-extension-boilerplate.git my-extension
cd my-extension
rm -rf .git
git init
git add .
git commit -m "First commit"
npm i
npm start
```

1. `npm i` to install dependancies
2. `npm start` to start running the fast development mode Webpack build process that bundle files into the `dist` folder
3. `npm i --save-dev <package_name>` to install new packages

### Loading The Chrome Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Toggle on `Developer mode` in the top right corner
3. Click `Load unpacked`
4. Select the entire `dist` folder

### Production Build

1. `npm run build` to generate a minimized production build in the `dist` folder
2. ZIP the entire `dist` folder (e.g. `dist.zip`)
3. Publish the ZIP file on the Chrome Web Store Developer Dashboard!

### Initial Steps

1. `git init` to start a new git repo for tracking your changes, do an initial base commit with all the default files
2. Update `package.json`, important fields include `author`, `version`, `name` and `description`
3. Update `manifest.json`, important fields include `version`, `name` and `description`

### Default Boilerplate Notes

- Folders get flattened, static references to images from HTML do not need to be relative (i.e. `icon.png` instead of `../static/icon.png`)
- Importing local ts/tsx/css files should be relative, since Webpack will build a dependancy graph using these paths
- Update the manifest file as per usual for chrome related permissions, references to files in here should also be flattened and not be relative

```tsx
const App: React.FC<{}> = () => {
  return (
    <div>
      <p className="text-white text-2xl underline font-black">Hello world</p>
      {/* this is how you refer to assets: they live in the static folder, and you refer to them
      absolutely. */}
      <img src="icon.png" />
    </div>
  );
};
```

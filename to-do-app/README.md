Navigate to your project directory:

```bash
cd to-do-app
```

Install Tailwind via npm:

```bash
npm install -D tailwindcss
```

Initialize the Tailwind configuration file:

```bash
npx tailwindcss init
```

This creates a `tailwind.config.js` file in your project root.

Update `tailwind.config.js` to include your HTML and JavaScript files:

```javascript
module.exports = {
    content: ["./index.html", "./script.js"],
    theme: {
        extend: {},
    },
    plugins: [],
};
```

Generate the `styles.css` file with Tailwind directives: Replace the content of `styles.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Run Tailwind CLI to process your `styles.css` file:

```bash
npx tailwindcss -i ./styles.css -o ./output.css --watch
```

If `npx tailwindcss` does not work, use these steps:

### Using the Tailwind Standalone CLI

Download the standalone Tailwind CLI:

```bash
curl -LO https://github.com/tailwindlabs/tailwindcss/releases/latest/download/tailwindcss-linux-x64
mv tailwindcss-linux-x64 tailwindcss
chmod +x tailwindcss
sudo mv tailwindcss /usr/local/bin/
```

Compile your styles.css into an output file:

```bash
npx tailwindcss -i ./styles.css -o ./output.css
```

Watch for changes during development:

```bash
npx tailwindcss -i ./styles.css -o ./output.css --watch
```

Link the Output CSS in index.html

```bash
<link href="output.css" rel="stylesheet">
```

Created by Isaac Talb (https://isaac.duckcloud.info/)

GitHub profile: [IsaacTalb](https://github.com/IsaacTalb)


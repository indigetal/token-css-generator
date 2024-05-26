# token-css-generator

**token-css-generator** is a [PostCSS](https://github.com/postcss/postcss) plugin that generates CSS Custom Properties and classes from design tokens defined in JSON files. This plugin helps in converting design tokens from tools like Figma into CSS variables that can be used throughout your web project.

### Features

---

- Converts design tokens from JSON files into CSS Custom Properties (variables).
- Generates CSS classes for easy usage in your stylesheets.
- Supports multiple sets of token files and allows specifying different output files for each set.
- Adds an optional prefix to custom properties and class names for namespace management.

### Installation

1. Clone the repository or include this plugin in your project.
2. Ensure you have Node.js and npm (or yarn) installed.

### Setup

---

#### Directory Structure

Ensure your project directory structure resembles the following:

```
token-css-generator/
├── index.js
├── generate-css.js
design-tokens/
├── colors.json
├── typography.json
dist/
postcss.config.js
package.json
```

#### Plugin File: token-css-generator/index.js

The core plugin logic is implemented here. Ensure this file is present in the **token-css-generator** folder.

#### Node.js Script: token-css-generator/generate-css.js

This script runs the plugin to process design tokens and generate CSS. Ensure this file is present in the **token-css-generator** folder.

#### PostCSS Configuration: postcss.config.js

Configure PostCSS to use the **token-css-generator** plugin.

```js
module.exports = {
  plugins: [
    require("./token-css-generator")({
      sets: [
        {
          filepaths: ["design-tokens/colors.json"],
          outputFile: "dist/colors.css",
        },
        {
          filepaths: ["design-tokens/typography.json"],
          outputFile: "dist/typography.css",
        },
      ],
      prefix: "my-prefix-",
    }),
  ],
};
```

### Usage

---

#### Design Tokens JSON Files

Place your design token JSON files in the design-tokens directory. Example files:

**colors.json**

```json
{
  "global": {
    "color": {
      "white": {
        "value": "#ffffff",
        "type": "color"
      }
    }
  }
}
```

**typography.json**

```json
{
  "global": {
    "fontFamilies": {
      "roboto": {
        "value": "Roboto",
        "type": "fontFamilies"
      }
    },
    "lineHeights": {
      "0": {
        "value": "64",
        "type": "lineHeights"
      }
    }
  }
}
```

#### Generating CSS

Add the following script to your **package.json** to run the CSS generation process:

```json
{
  "scripts": {
    "generate-css-from-tokens": "node token-css-generator/generate-css.js"
  }
}
```

Run the script using npm or yarn:

```sh
npm run generate-css-from-tokens
# or
yarn generate-css-from-tokens
```

This script processes the design token JSON files and outputs the generated CSS to the specified files in the dist directory.

### Example Output

---

Generated CSS files will be placed in the **dist** directory. An example output file (**colors.css**) might look like:

```css
:root {
  --my-prefix-global-color-white: #ffffff;
}

.my-prefix-global-color-white {
  color: var(--my-prefix-global-color-white);
}
```

### Contributing

---

Feel free to submit issues and pull requests. Contributions are welcome!

### License

---

const fs = require("fs");
const path = require("path");

module.exports = (opts = {}) => {
  const { sets, prefix = "" } = opts;

  if (!sets || !Array.isArray(sets) || sets.length === 0) {
    throw new Error('The "sets" option is required and must be an array of objects with filepaths and outputFile.');
  }

  return {
    postcssPlugin: "token-css-generator",
    Once(root, { result }) {
      const generateCssFromTokens = (tokens, prefix) => {
        const cssVars = [];
        const cssClasses = [];

        const toCustomPropertyName = (key) => `--${prefix}${key.replace(/\./g, "-")}`;

        const processTokens = (obj, parentKey = "") => {
          for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
              const token = obj[key];
              const newKey = parentKey ? `${parentKey}-${key}` : key;

              if (token.type && token.value) {
                const varName = toCustomPropertyName(newKey);
                cssVars.push(`${varName}: ${token.value};`);

                if (token.type === "color") {
                  cssClasses.push(`.${prefix}${newKey} { color: var(${varName}); }`);
                } else if (token.type === "fontFamilies") {
                  cssClasses.push(`.${prefix}${newKey} { font-family: var(${varName}); }`);
                } else if (token.type === "lineHeights") {
                  cssClasses.push(`.${prefix}${newKey} { line-height: var(${varName}); }`);
                } else if (token.type === "fontWeights") {
                  cssClasses.push(`.${prefix}${newKey} { font-weight: var(${varName}); }`);
                } else if (token.type === "fontSizes") {
                  cssClasses.push(`.${prefix}${newKey} { font-size: var(${varName}); }`);
                } else if (token.type === "letterSpacing") {
                  cssClasses.push(`.${prefix}${newKey} { letter-spacing: var(${varName}); }`);
                } else if (token.type === "paragraphSpacing") {
                  cssClasses.push(`.${prefix}${newNewKey} { margin-bottom: var(${varName}); }`);
                } else if (token.type === "textCase") {
                  cssClasses.push(`.${prefix}${newKey} { text-transform: var(${varName}); }`);
                } else if (token.type === "textDecoration") {
                  cssClasses.push(`.${prefix}${newKey} { text-decoration: var(${varName}); }`);
                }
              } else if (typeof token === "object") {
                processTokens(token, newKey);
              }
            }
          }
        };

        processTokens(tokens);
        return { cssVars, cssClasses };
      };

      sets.forEach((set) => {
        const { filepaths, outputFile } = set;
        if (!filepaths || !Array.isArray(filepaths) || filepaths.length === 0 || !outputFile) {
          throw new Error('Each set must have "filepaths" (array) and "outputFile" (string) properties.');
        }

        let allTokens = {};
        filepaths.forEach((filepath) => {
          const tokens = JSON.parse(fs.readFileSync(filepath, "utf-8"));
          allTokens = { ...allTokens, ...tokens };
        });

        const { cssVars, cssClasses } = generateCssFromTokens(allTokens, prefix);
        const cssContent = `:root {\n  ${cssVars.join("\n  ")}\n}\n\n${cssClasses.join("\n")}`;

        const outputPath = path.resolve(result.opts.to ? path.dirname(result.opts.to) : ".", outputFile);
        fs.writeFileSync(outputPath, cssContent, "utf-8");
      });
    },
  };
};

module.exports.postcss = true;

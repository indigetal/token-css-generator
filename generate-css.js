const postcss = require("postcss");
const tokenCssGenerator = require("./index");

const processTokens = async () => {
  const processor = postcss([
    tokenCssGenerator({
      sets: [
        {
          filepaths: ["../design-tokens/colors.json"],
          outputFile: "../dist/colors.css",
        },
        {
          filepaths: ["../design-tokens/typography.json"],
          outputFile: "../dist/typography.css",
        },
      ],
      prefix: "my-prefix-",
    }),
  ]);

  // Since there is no actual CSS input file, use an empty root
  await processor.process("", { from: undefined });
  console.log("Design tokens CSS generated successfully.");
};

processTokens().catch((err) => {
  console.error("Error generating design tokens CSS:", err);
});

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Fix for Framer Motion ES modules
      webpackConfig.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false
        }
      });
      return webpackConfig;
    }
  },
  jest: {
    configure: {
      moduleNameMapper: {
        "^konva": "konva/konva",
        "^react-konva": "react-konva/umd/react-konva.min.js"
      }
    }
  }
};

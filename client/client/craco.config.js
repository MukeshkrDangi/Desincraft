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
  devServer: {
    allowedHosts: "all"  // Fixes the "should be a non-empty string" error
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
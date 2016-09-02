module.exports = {
    entry: './src/js/main.js',
    output: {
        path: './web/js',
        filename: 'main.js'
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules|bower_components/,
          loader: 'babel'
        }
      ]
    }
};

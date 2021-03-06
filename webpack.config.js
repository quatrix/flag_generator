module.exports = {
  context: __dirname + "/app",

  entry: {
    javascript: "./app.js",
    html: "./index.html",
  },

  output: {
    filename: "app.js",
    path: __dirname + "/dist",
  },

  module: {
    loaders: [
	  {
	    test: /\.js$/,
	    exclude: /node_modules/,
	    loader: "babel",
        query: {
          presets: ['react', 'es2015']
        }
	  },
	  {
	    test: /\.html$/,
	    loader: "file?name=[name].[ext]",
	  },
      { test: /\.css$/, loader: "style-loader!css-loader" }
	]
  }
}

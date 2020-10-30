const HtmlWebpackPlugin = require('html-webpack-plugin');
const svgToMiniDataURI = require('mini-svg-data-uri');

const reactVersion = require('react').version;
const reactDOMVersion = require('react-dom').version;

module.exports = (env) => {
  const isDevelopment = env && env.dev;
  process.env.BROWSERSLIST_ENV = isDevelopment ? 'development' : 'production';

  return {
    ...(isDevelopment ? { devtool: 'eval-source-map' } : {}),
    // entry: './src/index.js',
    target: isDevelopment ? 'web' : 'browserslist',
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: ['babel-loader'],
        },
        {
          test: /\.module\.s[ac]ss$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: '[name]__[local]___[hash:base64:5]',
                  exportLocalsConvention: 'camelCase',
                },
                sourceMap: isDevelopment,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: isDevelopment,
              },
            },
          ],
        },
        {
          test: /\.s[ac]ss$/,
          exclude: /\.module\.s[ac]ss$/,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                sourceMap: isDevelopment,
              },
            },
          ],
        },
        {
          test: /\.module\.css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: '[name]__[local]___[hash:base64:5]',
                  exportLocalsConvention: 'camelCase',
                },
                sourceMap: isDevelopment,
              },
            },
          ],
        },
        {
          test: /\.css$/,
          exclude: /\.module\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|jpg|gif)$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192,
              },
            },
          ],
        },
        {
          test: /\.svg$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                generator: (content) => svgToMiniDataURI(content.toString()),
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['*', '.js', '.jsx', '.css', '.scss', '.sass'],
    },
    output: {
      // path: path.resolve(__dirname, 'dist'),
      filename: '[name].[hash].bundle.js',
    },
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
    plugins: [
      new HtmlWebpackPlugin({
        hash: true,
        template: './src/index.ejs',
        cdn: {
          use: 'unpkg',
          unpkg: {
            react: `https://unpkg.com/react@${reactVersion}/umd/react.development.js`,
            reactDOM: `https://unpkg.com/react-dom@${reactDOMVersion}/umd/react-dom.development.js`,
            domain: '//unpkg.com/',
          },
          cdnjs: {
            react: `https://cdnjs.cloudflare.com/ajax/libs/react/${reactVersion}/umd/react.development.js`,
            reactDOM: `https://cdnjs.cloudflare.com/ajax/libs/react-dom/${reactDOMVersion}/umd/react-dom.development.min.js`,
            domain: '//cdnjs.cloudflare.com/',
          },
          jsdelivr: {
            react: `https://cdn.jsdelivr.net/npm/react@${reactVersion}/umd/react.development.js`,
            reactDOM: `https://cdn.jsdelivr.net/npm/react-dom@${reactDOMVersion}/umd/react-dom.development.js`,
            domain: '//cdn.jsdelivr.net/',
          },
        },
      }),
    ],
    devServer: {
      contentBase: './dist',
      hot: true,
    },
  };
};

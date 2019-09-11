import path from 'path';

export default {
  frame: 'react',
  dll: [
    'react',
    'react-dom',
    'prop-types'
  ],
  entry: {
    index: [path.join(__dirname, 'example/index.js')]
  },
  js: {
    ecmascript: true,
    exclude: /node_modules/
  },
  rules: [
    {
      test: /^.*\.mp4$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name]_[hash:5].[ext]'
          }
        }
      ]
    }
  ],
  html: [
    { template: path.join(__dirname, 'example/index.pug') }
  ]
};
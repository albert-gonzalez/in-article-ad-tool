import uglify from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';
import license from 'rollup-plugin-license';

let optimize = process.env.optimize || false;

export default {
  input: 'src/inArticleAdTool/inArticleAdTool.js',
  output: {
    format: 'umd',
    name: 'inArticleAdTool',
    file: `dist/inArticleAdTool${optimize ? '.min' : ''}.js`
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    optimize ? uglify() : {},
    license({
      banner: `
        <%= pkg.name %>
        Generated: <%= moment().format('YYYY-MM-DD') %>
        Version: <%= pkg.version %>
        `
    })
  ]
};

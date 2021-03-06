import path from 'path';
import vue from 'rollup-plugin-vue';
import babel from 'rollup-plugin-babel';
import alias from 'rollup-plugin-alias';
import filesize from 'rollup-plugin-filesize';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import cleanup from 'rollup-plugin-cleanup';
import sourcemaps from 'rollup-plugin-sourcemaps';
import postcss from 'rollup-plugin-postcss';

export default [
  commonjs({
    include: ['node_modules/**']
  }),
  nodeResolve({
    browser: true,
    jsnext: true,
    main: true
  }),
  postcss({
    extract: 'bundle.css'
  }),
  vue({
    // cssModules: {
    //   generateScopedName: '[name]__[local]-[hash:base64:4]'
    // },
    // postcss: {
    //   plugins: [require('postcss-nested')]
    // },
    // css: styles => {
    //   console.log(styles);
    // },
    css: false,
    template: { optimizeSSR: true }
  }),
  babel({
    exclude: 'node_modules/**'
  }),
  alias({
    'vue-library': path.resolve(__dirname, '../')
  }),
  cleanup({
    comments: ['eslint', /^\*-/],
    extensions: ['.js', '.vue']
  }),
  sourcemaps(),
  filesize()
];

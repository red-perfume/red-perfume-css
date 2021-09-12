# red-perfume-css

Library for atomizing strings of CSS. It is completely synchronous.


## What is CSS Atomization?

**Example:**

```css
/* Before */
.cow,
.cat {
    font-size: 12px;
    padding: 8px;
}
.dog {
    font-size: 12px;
    background: #F00;
    padding: 8px;
}
```

```css
/* After */
.rp__font-size__--COLON12px {
  font-size: 12px;
}
.rp__padding__--COLON8px {
  padding: 8px;
}
.rp__background__--COLON__--OCTOTHORPF00 {
  background: #F00;
}
```

This output isn't as pretty to read, but it's a build step, *not* your source code, so it doesn't really matter. **Note:** The class names can be uglified as well (`.rp__0`, `.rp__1`, etc.).

The alpha version of `red-perfume` already works for simple CSS, like the above example. However, more work is being done to allow *any* CSS file to be passed in, no matter how weird or complex. Look at the **issues** page to see what work is left to be done and how you can help!

**Uglified Example:**

```css
/* Uglified */
.rp__0 {
  font-size: 12px;
}
.rp__1 {
  padding: 8px;
}
.rp__2 {
  background: #F00;
}
```


## Usage

1. `npm install --save-dev red-perfume-css`

```js
const redPerfumeCss = require('red-perfume-css');

const results = redPerfumeCss({
  uglify: false,
  input: '.dog { padding: 8px }'
});

console.log(results);
// Results would looks somewhat like this. (subject to change before v1.0.0)
{
  atomizedCss: `
  .rp__padding__--COLON8px {
    padding: 8px;
  }
  `,
  classMap: {
    '.dog': ['rp__padding__--COLON8px']
  },
  styleErrors: []
}
```

**API:**

Key       | Type    | Default     | Description
:--       | :--     | :--         | :--
`uglify`  | Boolean | `false`     | If `false` the atomized classes, and all references to them, are long (`.rp__padding__--COLOR12px`). If `true` they are short (`.rp__b5p`).
`input`   | String  | `''`        | A string of any valid CSS to be atomized


**Returns:**

Argument             | Type   | Description
:--                  | :--    | :--
`atomizedCss`        | string | The `input` string after it is atomized.
`classMap`           | object | An object where the keys are the original class names and the values are the atomized class names made from the original CSS rule. This is the same map we output in the `scripts.out`. **IMPORTANT:** How the keys are written (with or without a `.`) and how the values are stored (as an array or string) are subject to change before v1.0.0.
`styleErrors`        | array  | An array of errors from attempting to read/write/parse/stringify style files.

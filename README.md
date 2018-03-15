# postcss-rpxtorem [![NPM version](https://badge.fury.io/js/postcss-rpxtorem.svg)](http://badge.fury.io/js/postcss-rpxtorem)

A plugin for [PostCSS](https://github.com/ai/postcss) that generates rem units from pixel units.

## Fork [postcss-pxtorem](https://github.com/cuth/postcss-pxtorem)
背景：小程序转换其他项目（vue等）时，需要把rpx转换成rem

## Install

```shell
$ npm install postcss-rpxtorem --save-dev
```

## Usage

Pixels are the easiest unit to use (*opinion*). The only issue with them is that they don't let browsers change the default font size of 16. This script converts every px value to a rem from the properties you choose to allow the browser to set the font size.

## rpx

关于rpx的[描述](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/view/wxss.html):
> rpx（responsive pixel）: 可以根据屏幕宽度进行自适应。规定屏幕宽为750rpx。如在 iPhone6 上，屏幕宽度为375px，共有750个物理像素，则750rpx = 375px = 750物理像素，1rpx = 0.5px = 1物理像素。
>
> | 设备 | rpx换算px (屏幕宽度/750) | px换算rpx (750/屏幕宽度)
> | ------------- |:-------------:| -----:|
> | iPhone5 | 1rpx = 0.42px | 1px = 2.34rpx
> | iPhone6 | 1rpx = 0.5px | 1px = 2rpx

### Input/Output

*With the default settings, only font related properties are targeted.*

```css
// input
h1 {
    margin: 0 0 20rpx;
    font-size: 32px;
    line-height: 1.2;
    letter-spacing: 1px;
}

// output
h1 {
    margin: 0 0 1.25rem;
    font-size: 2rem;
    line-height: 1.2;
    letter-spacing: 0.0625rem;
}
```

### Example

```js
var fs = require('fs');
var postcss = require('postcss');
var rpxtorem = require('postcss-rpxtorem');
var css = fs.readFileSync('main.css', 'utf8');
var options = {
    replace: false
};
var processedCss = postcss(rpxtorem(options)).process(css).css;

fs.writeFile('main-rem.css', processedCss, function (err) {
  if (err) {
    throw err;
  }
  console.log('Rem file written.');
});
```

### options

Type: `Object | Null`  
Default:
```js
{
    rootValue: 16,
    unitPrecision: 5,
    propList: ['*'],
    selectorBlackList: [],
    replace: true,
    mediaQuery: false,
    minPixelValue: 0
}
```

- `rootValue` (Number) The root element font size.
- `unitPrecision` (Number) The decimal numbers to allow the REM units to grow to.
- `propList` (Array) The properties that can change from px to rem.
    - Values need to be exact matches.
    - Use wildcard `*` to enable all properties. Example: `['*']`
    - Use `*` at the start or end of a word. (`['*position*']` will match `background-position-y`)
    - Use `!` to not match a property. Example: `['*', '!letter-spacing']`
    - Combine the "not" prefix with the other prefixes. Example: `['*', '!font*']` 
- `selectorBlackList` (Array) The selectors to ignore and leave as px.
    - If value is string, it checks to see if selector contains the string.
        - `['body']` will match `.body-class`
    - If value is regexp, it checks to see if the selector matches the regexp.
        - `[/^body$/]` will match `body` but not `.body`
- `replace` (Boolean) replaces rules containing rems instead of adding fallbacks.
- `mediaQuery` (Boolean) Allow px to be converted in media queries.
- `minPixelValue` (Number) Set the minimum pixel value to replace.


### Use with gulp-postcss and autoprefixer

```js
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var rpxtorem = require('postcss-rpxtorem');

gulp.task('css', function () {

    var processors = [
        autoprefixer({
            browsers: 'last 1 version'
        }),
        rpxtorem({
            replace: false
        })
    ];

    return gulp.src(['build/css/**/*.css'])
        .pipe(postcss(processors))
        .pipe(gulp.dest('build/css'));
});
```

### A message about ignoring properties
Currently, the easiest way to have a single property ignored is to use a capital in the pixel unit declaration.

```css
// `rpx` is converted to `rem`
.convert {
    font-size: 16rpx; // converted to 1rem
}

// `Px` or `PX` is ignored by `postcss-pxtorem` but still accepted by browsers
.ignore {
    border: 1rPx solid; // ignored
    border-width: 2RPX; // ignored
}
```

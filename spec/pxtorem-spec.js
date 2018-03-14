// Jasmine unit tests
// To run tests, run these commands from the project root:
// 1. `npm install -g jasmine-node`
// 2. `jasmine-node spec`

/* global describe, it, expect */

'use strict'
var postcss = require('postcss')
var pxtorem = require('..')
var basicCSS = '.rule { font-size: 15rpx }'
var filterPropList = require('../lib/filter-prop-list')

describe('rpxtorem', function() {
    it('should work on the readme example', function() {
        var input =
            'h1 { margin: 0 0 20rpx; font-size: 32rpx; line-height: 1.2; letter-spacing: 1rpx; }'
        var output =
            'h1 { margin: 0 0 0.625rem; font-size: 1rem; line-height: 1.2; letter-spacing: 0.03125rem; }'
        var processed = postcss(pxtorem()).process(input).css

        expect(processed).toBe(output)
    })

    it('should replace the px unit with rem', function() {
        var processed = postcss(pxtorem()).process(basicCSS).css
        var expected = '.rule { font-size: 0.46875rem }'

        expect(processed).toBe(expected)
    })

    it('should ignore non px properties', function() {
        var expected = '.rule { font-size: 2em }'
        var processed = postcss(pxtorem()).process(expected).css

        expect(processed).toBe(expected)
    })

    it('should handle < 1 values and values without a leading 0 - legacy', function() {
        var rules = '.rule { margin: 0.5rem .5rpx -0.2rpx -.2em }'
        var expected = '.rule { margin: 0.5rem 0.01563rem -0.00625rem -.2em }'
        var options = {
            propWhiteList: ['margin']
        }
        var processed = postcss(pxtorem(options)).process(rules).css

        expect(processed).toBe(expected)
    })

    it('should handle < 1 values and values without a leading 0', function() {
        var rules = '.rule { margin: 0.5rem .5rpx -0.2rpx -.2em }'
        var expected = '.rule { margin: 0.5rem 0.01563rem -0.00625rem -.2em }'
        var options = {
            propList: ['margin']
        }
        var processed = postcss(pxtorem(options)).process(rules).css

        expect(processed).toBe(expected)
    })

    it('should not add properties that already exist', function() {
        var expected = '.rule { font-size: 0.5rem; font-size: 1rem; }'
        var processed = postcss(pxtorem()).process(expected).css

        expect(processed).toBe(expected)
    })

    it('should remain unitless if 0', function() {
        var expected = '.rule { font-size: 0rpx; font-size: 0; }'
        var processed = postcss(pxtorem()).process(expected).css

        expect(processed).toBe(expected)
    })
})

describe('value parsing', function() {
    it('should not replace values in double quotes or single quotes - legacy', function() {
        var options = {
            propWhiteList: []
        }
        var rules =
            '.rule { content: \'16rpx\'; font-family: "16rpx"; font-size: 16rpx; }'
        var expected =
            '.rule { content: \'16rpx\'; font-family: "16rpx"; font-size: 0.5rem; }'
        var processed = postcss(pxtorem(options)).process(rules).css

        expect(processed).toBe(expected)
    })

    it('should not replace values in double quotes or single quotes', function() {
        var options = {
            propList: ['*']
        }
        var rules =
            '.rule { content: \'16rpx\'; font-family: "16rpx"; font-size: 16rpx; }'
        var expected =
            '.rule { content: \'16rpx\'; font-family: "16rpx"; font-size: 0.5rem; }'
        var processed = postcss(pxtorem(options)).process(rules).css

        expect(processed).toBe(expected)
    })

    it('should not replace values in `url()` - legacy', function() {
        var options = {
            propWhiteList: []
        }
        var rules = '.rule { background: url(16rpx.jpg); font-size: 16rpx; }'
        var expected =
            '.rule { background: url(16rpx.jpg); font-size: 0.5rem; }'
        var processed = postcss(pxtorem(options)).process(rules).css

        expect(processed).toBe(expected)
    })

    it('should not replace values in `url()`', function() {
        var options = {
            propList: ['*']
        }
        var rules = '.rule { background: url(16rpx.jpg); font-size: 16rpx; }'
        var expected =
            '.rule { background: url(16rpx.jpg); font-size: 0.5rem; }'
        var processed = postcss(pxtorem(options)).process(rules).css

        expect(processed).toBe(expected)
    })

    it('should not replace values with an uppercase P or X', function() {
        var options = {
            propList: ['*']
        }
        var rules =
            '.rule { margin: 12rpx calc(100% - 14rPX); height: calc(100% - 20rpx); font-size: 12rPx; line-height: 16rpx; }'
        var expected =
            '.rule { margin: 0.375rem calc(100% - 14rPX); height: calc(100% - 0.625rem); font-size: 12rPx; line-height: 0.5rem; }'
        var processed = postcss(pxtorem(options)).process(rules).css
        expect(processed).toBe(expected)
    })
})

describe('rootValue', function() {
    // Deprecate
    it('should replace using a root value of 10 - legacy', function() {
        var expected = '.rule { font-size: 0.75rem }'
        var options = {
            root_value: 10
        }
        var processed = postcss(pxtorem(options)).process(basicCSS).css

        expect(processed).toBe(expected)
    })

    it('should replace using a root value of 20', function() {
        var expected = '.rule { height: 1rem }'
        var rule = '.rule { height: 40rpx }'
        var options = {
            root_value: 20
        }
        var processed = postcss(pxtorem(options)).process(rule).css

        expect(processed).toBe(expected)
    })

    it('should replace using a root value of 10', function() {
        var expected = '.rule { font-size: 0.75rem }'
        var options = {
            rootValue: 10
        }
        var processed = postcss(pxtorem(options)).process(basicCSS).css

        expect(processed).toBe(expected)
    })
})

describe('unitPrecision', function() {
    // Deprecate
    it('should replace using a decimal of 2 places - legacy', function() {
        var expected = '.rule { font-size: 0.47rem }'
        var options = {
            unit_precision: 2
        }
        var processed = postcss(pxtorem(options)).process(basicCSS).css

        expect(processed).toBe(expected)
    })

    it('should replace using a decimal of 2 places', function() {
        var expected = '.rule { font-size: 0.47rem }'
        var options = {
            unitPrecision: 2
        }
        var processed = postcss(pxtorem(options)).process(basicCSS).css

        expect(processed).toBe(expected)
    })
})

describe('propWhiteList', function() {
    // Deprecate
    it('should only replace properties in the white list - legacy', function() {
        var expected = '.rule { font-size: 15rpx }'
        var options = {
            prop_white_list: ['font']
        }
        var processed = postcss(pxtorem(options)).process(basicCSS).css

        expect(processed).toBe(expected)
    })

    it('should only replace properties in the white list - legacy', function() {
        var expected = '.rule { font-size: 15rpx }'
        var options = {
            propWhiteList: ['font']
        }
        var processed = postcss(pxtorem(options)).process(basicCSS).css
        expect(processed).toBe(expected)
    })

    it('should only replace properties in the white list - legacy', function() {
        var css = '.rule { margin: 16rpx; margin-left: 10rpx; }'
        var expected = '.rule { margin: 0.5rem; margin-left: 10rpx; }'
        var options = {
            propWhiteList: ['margin']
        }
        var processed = postcss(pxtorem(options)).process(css).css

        expect(processed).toBe(expected)
    })

    it('should only replace properties in the prop list', function() {
        var css =
            '.rule { font-size: 16rpx; margin: 16rpx; margin-left: 5rpx; padding: 5rpx; padding-right: 16rpx }'
        var expected =
            '.rule { font-size: 0.5rem; margin: 0.5rem; margin-left: 5rpx; padding: 5rpx; padding-right: 0.5rem }'
        var options = {
            propWhiteList: [
                '*font*',
                'margin*',
                '!margin-left',
                '*-right',
                'pad'
            ]
        }
        var processed = postcss(pxtorem(options)).process(css).css

        expect(processed).toBe(expected)
    })

    it('should only replace properties in the prop list with wildcard', function() {
        var css =
            '.rule { font-size: 16rpx; margin: 16rpx; margin-left: 5rpx; padding: 5rpx; padding-right: 16rpx; }'
        var expected =
            '.rule { font-size: 16rpx; margin: 0.5rem; margin-left: 5rpx; padding: 5rpx; padding-right: 16rpx; }'
        var options = {
            propWhiteList: ['*', '!margin-left', '!*padding*', '!font*']
        }
        var processed = postcss(pxtorem(options)).process(css).css

        expect(processed).toBe(expected)
    })

    it('should replace all properties when white list is empty', function() {
        var rules = '.rule { margin: 16rpx; font-size: 15rpx }'
        var expected = '.rule { margin: 0.5rem; font-size: 0.46875rem }'
        var options = {
            propWhiteList: []
        }
        var processed = postcss(pxtorem(options)).process(rules).css

        expect(processed).toBe(expected)
    })
})

describe('selectorBlackList', function() {
    // Deprecate
    it('should ignore selectors in the selector black list - legacy', function() {
        var rules = '.rule { font-size: 15rpx } .rule2 { font-size: 15rpx; }'
        var expected =
            '.rule { font-size: 0.46875rem } .rule2 { font-size: 15rpx; }'
        var options = {
            selector_black_list: ['.rule2']
        }
        var processed = postcss(pxtorem(options)).process(rules).css

        expect(processed).toBe(expected)
    })

    it('should ignore selectors in the selector black list', function() {
        var rules = '.rule { font-size: 15rpx } .rule2 { font-size: 15rpx; }'
        var expected =
            '.rule { font-size: 0.46875rem } .rule2 { font-size: 15rpx; }'
        var options = {
            selectorBlackList: ['.rule2']
        }
        var processed = postcss(pxtorem(options)).process(rules).css

        expect(processed).toBe(expected)
    })

    it('should ignore every selector with `body$`', function() {
        var rules =
            'body { font-size: 16rpx; } .class-body$ { font-size: 16rpx; } .simple-class { font-size: 16rpx; }'
        var expected =
            'body { font-size: 0.5rem; } .class-body$ { font-size: 16rpx; } .simple-class { font-size: 0.5rem; }'
        var options = {
            selectorBlackList: ['body$']
        }
        var processed = postcss(pxtorem(options)).process(rules).css

        expect(processed).toBe(expected)
    })

    it('should only ignore exactly `body`', function() {
        var rules =
            'body { font-size: 16rpx; } .class-body { font-size: 16rpx; } .simple-class { font-size: 16rpx; }'
        var expected =
            'body { font-size: 16rpx; } .class-body { font-size: 0.5rem; } .simple-class { font-size: 0.5rem; }'
        var options = {
            selectorBlackList: [/^body$/]
        }
        var processed = postcss(pxtorem(options)).process(rules).css

        expect(processed).toBe(expected)
    })
})

describe('replace', function() {
    it('should leave fallback pixel unit with root em value', function() {
        var options = {
            replace: false
        }
        var processed = postcss(pxtorem(options)).process(basicCSS).css
        var expected = '.rule { font-size: 15rpx; font-size: 0.46875rem }'

        expect(processed).toBe(expected)
    })
})

describe('mediaQuery', function() {
    // Deprecate
    it('should replace px in media queries', function() {
        var options = {
            media_query: true
        }
        var processed = postcss(pxtorem(options)).process(
            '@media (min-width: 500rpx) { .rule { font-size: 16rpx } }'
        ).css
        var expected =
            '@media (min-width: 15.625rem) { .rule { font-size: 0.5rem } }'
        expect(processed).toBe(expected)
    })

    it('should replace px in media queries', function() {
        var options = {
            mediaQuery: true
        }
        var processed = postcss(pxtorem(options)).process(
            '@media (min-width: 500rpx) { .rule { font-size: 16rpx } }'
        ).css
        var expected =
            '@media (min-width: 15.625rem) { .rule { font-size: 0.5rem } }'

        expect(processed).toBe(expected)
    })
})

describe('minPixelValue', function() {
    it('should not replace values below minPixelValue', function() {
        var options = {
            propWhiteList: [],
            minPixelValue: 2
        }
        var rules =
            '.rule { border: 1rpx solid #000; font-size: 16rpx; margin: 1rpx 10rpx; }'
        var expected =
            '.rule { border: 1rpx solid #000; font-size: 0.5rem; margin: 1rpx 0.3125rem; }'
        var processed = postcss(pxtorem(options)).process(rules).css

        expect(processed).toBe(expected)
    })
})

describe('filter-prop-list', function() {
    it('should find "exact" matches from propList', function() {
        var propList = [
            'font-size',
            'margin',
            '!padding',
            '*border*',
            '*',
            '*y',
            '!*font*'
        ]
        var expected = 'font-size,margin'
        expect(filterPropList.exact(propList).join()).toBe(expected)
    })

    it('should find "contain" matches from propList and reduce to string', function() {
        var propList = [
            'font-size',
            '*margin*',
            '!padding',
            '*border*',
            '*',
            '*y',
            '!*font*'
        ]
        var expected = 'margin,border'
        expect(filterPropList.contain(propList).join()).toBe(expected)
    })

    it('should find "start" matches from propList and reduce to string', function() {
        var propList = [
            'font-size',
            '*margin*',
            '!padding',
            'border*',
            '*',
            '*y',
            '!*font*'
        ]
        var expected = 'border'
        expect(filterPropList.startWith(propList).join()).toBe(expected)
    })

    it('should find "end" matches from propList and reduce to string', function() {
        var propList = [
            'font-size',
            '*margin*',
            '!padding',
            'border*',
            '*',
            '*y',
            '!*font*'
        ]
        var expected = 'y'
        expect(filterPropList.endWith(propList).join()).toBe(expected)
    })

    it('should find "not" matches from propList and reduce to string', function() {
        var propList = [
            'font-size',
            '*margin*',
            '!padding',
            'border*',
            '*',
            '*y',
            '!*font*'
        ]
        var expected = 'padding'
        expect(filterPropList.notExact(propList).join()).toBe(expected)
    })

    it('should find "not contain" matches from propList and reduce to string', function() {
        var propList = [
            'font-size',
            '*margin*',
            '!padding',
            '!border*',
            '*',
            '*y',
            '!*font*'
        ]
        var expected = 'font'
        expect(filterPropList.notContain(propList).join()).toBe(expected)
    })

    it('should find "not start" matches from propList and reduce to string', function() {
        var propList = [
            'font-size',
            '*margin*',
            '!padding',
            '!border*',
            '*',
            '*y',
            '!*font*'
        ]
        var expected = 'border'
        expect(filterPropList.notStartWith(propList).join()).toBe(expected)
    })

    it('should find "not end" matches from propList and reduce to string', function() {
        var propList = [
            'font-size',
            '*margin*',
            '!padding',
            '!border*',
            '*',
            '!*y',
            '!*font*'
        ]
        var expected = 'y'
        expect(filterPropList.notEndWith(propList).join()).toBe(expected)
    })
})

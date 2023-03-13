const fs = require('fs');
const NOT_FOUND_PATH = 'docs/404.html';
const slugify = require('@sindresorhus/slugify')


module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy({'source/assets': 'assets'});
    eleventyConfig.addPassthroughCopy({'source/css': 'css'});
    eleventyConfig.addPassthroughCopy({'source/data': 'data'});
    eleventyConfig.addPassthroughCopy({'source/CNAME': 'CNAME'});

    eleventyConfig.addFilter('dateformat', function (dateIn) {
        return dateIn.toISOString().split('T')[0];
    });
    eleventyConfig.addFilter('extractYear', function (dateIn) {
        return dateIn.getFullYear();
    });
    eleventyConfig.addFilter('slicejs', function (dataIn, count) {
        return dataIn.slice(0, count);
    });
    eleventyConfig.addFilter('toIsoDate', function (dateIn) {
        return dateIn.toISOString();
    });
    eleventyConfig.addFilter('now', function () {
        return new Date();
    });

    // @see https://www.11ty.dev/docs/languages/markdown/
    eleventyConfig.amendLibrary('md', mdLib => mdLib.set({
        // @see https://github.com/markdown-it/markdown-it#init-with-presets-and-options
        xhtmlOut: true,
        langPrefix: ''
    }));
    // @see https://github.com/valeriangalliat/markdown-it-anchor
    eleventyConfig.amendLibrary('md', mdLib => mdLib.use(require('markdown-it-anchor'), {
        tabIndex: false,
        // @see https://github.com/sindresorhus/slugify/tree/v1.1.0
        slugify: s => slugify(s, {decamelize: false})
    }));

    // @see https://www.11ty.dev/docs/quicktips/not-found/
    eleventyConfig.setBrowserSyncConfig({
        callbacks: {
            ready: function (err, bs) {

                bs.addMiddleware('*', (req, res) => {
                    if (!fs.existsSync(NOT_FOUND_PATH)) {
                        throw new Error(`Expected a \`${NOT_FOUND_PATH}\` file but could not find one. Did you create a 404.html template?`);
                    }

                    const content_404 = fs.readFileSync(NOT_FOUND_PATH);
                    // Add 404 http status code in request header.
                    res.writeHead(404, {'Content-Type': 'text/html; charset=UTF-8'});
                    // Provides the 404 content without redirect.
                    res.write(content_404);
                    res.end();
                });
            }
        }
    });

    return {
        dir: {
            input: 'source',
            output: 'docs',
            includes: '_includes'
        }
    };
};

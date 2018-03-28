#!/bin/sh

rm -rf output_prod
rm -rf docs
php ../sculpin/bin/sculpin generate --env=prod
mkdir docs
cp -R /c/dev/htdocs/blog.martinhujer.cz/output_prod/* /c/dev/htdocs/blog.martinhujer.cz/docs
git add docs/

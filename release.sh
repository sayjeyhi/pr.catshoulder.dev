#! /bin/bash
tag=$(cat package.json | jq -r '.version')
git add .
git commit -m "Update action"
git tag -a -m "Release $tag" "v$tag"
git push --follow-tags

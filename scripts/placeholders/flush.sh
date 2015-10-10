TMP=$(mktemp /tmp/flush-script.XXXXXX)

node scripts/placeholders/clear.js $1
bash scripts/placeholders/cropAll.sh $TMP
node scripts/placeholders/upload.js $1 $TMP/female female
node scripts/placeholders/upload.js $1 $TMP/male male

rm -r $TMP
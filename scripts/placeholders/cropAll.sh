mkdir -p $1

node scripts/placeholders/crop.js ../Placeholders/Hot/female $1/female
node scripts/placeholders/crop.js ../Placeholders/Hot/male $1/male
node scripts/placeholders/crop.js ../Placeholders/Ugly/female $1/female
node scripts/placeholders/crop.js ../Placeholders/Ugly/male $1/male
node scripts/placeholders/crop.js ../Placeholders/Russians/female $1/female
node scripts/placeholders/crop.js ../Placeholders/Russians/male $1/male
node scripts/placeholders/crop.js ../Placeholders/Greek/male $1/male
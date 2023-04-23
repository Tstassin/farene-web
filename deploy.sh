# /bin/sh

# Exit immediately on error
set -e

# update from production branch
git checkout production
git pull

# Ask confirmation
DEPLOY_TARGET=$(git log --pretty=oneline -n 1)
echo "will deploy : $DEPLOY_TARGET"
read -p "Continue (y/n)?" choice
case "$choice" in 
  y|Y ) echo "Deploying...";;
  n|N ) exit 0;;
  * ) exit 0;;
esac

# Install
npm i 
cd backend
npm i 
cd ..
cd frontend
npm i
cd ..

# Backup
cd backend
sqlite3 backend/backend.sqlite ".backup '/home/thomas/backups/farene-web-backups/$(date +%Y-%m-%d_%H-%M-%S).sqlite'"
cd ..

# Tests
cd backend
npm run test
cd ..

# Deploy backend
cd backend
npm run compile
npm run migrate
pm2 restart api.farene.be --update-env
cd ..

# Deploy frontend
cd frontend
rm -rf .parcel-cache
npm run build

# Done
cd ..
echo "Deployment done"
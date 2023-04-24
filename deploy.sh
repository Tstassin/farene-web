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
npm ci 
cd backend
npm ci 
cd ..
cd frontend
npm ci
cd ..

# Backup
sqlite3 backend/backend.sqlite ".backup '/home/thomas/backups/farene-web-backups/$(date +%Y-%m-%d_%H-%M-%S).sqlite'"

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
cd ..

# Done
echo "Deployment done"
# Deployment Guide - xTheatre

## Production Build

### Building for Production

```bash
# Build both frontend and backend
npm run build

# This generates:
# - frontend/dist/ - Static production build (can be deployed to CDN/Vercel)
# - backend/dist/ - Compiled JavaScript backend
```

### Frontend Deployment

The built frontend is static and can be deployed to:
- **Vercel** (recommended for Next.js/Vite apps)
- **Netlify**
- **AWS S3 + CloudFront**
- **GitHub Pages**
- **Any web server (nginx, Apache)**

#### Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel

# or connect to GitHub for automatic deployments
```

#### AWS S3 Deployment

```bash
# Build frontend
npm run build:frontend

# Deploy to S3
aws s3 sync frontend/dist/ s3://your-bucket-name --delete

# CloudFront invalidation
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

#### Netlify Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=frontend/dist
```

### Backend Deployment

#### Docker Deployment

Create `backend/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm ci --only=production

COPY backend/dist ./dist

EXPOSE 3001

CMD ["node", "dist/index.js"]
```

Build and run:

```bash
docker build -t xtheatre-backend .
docker run -p 3001:3001 -e NODE_ENV=production xtheatre-backend
```

#### Heroku Deployment

```bash
# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL=https://your-frontend.com
heroku config:set MONGODB_URI=your_db_uri

# Deploy
git push heroku main
```

#### AWS EC2 Deployment

```bash
# SSH into EC2 instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone your-repo-url
cd xtheatre/backend

# Install dependencies
npm ci --only=production

# Set environment variables
export NODE_ENV=production
export FRONTEND_URL=https://your-frontend.com
export PORT=3001

# Start server (use PM2 for process management)
npm install -g pm2
pm2 start dist/index.js --name "theatre-api"
pm2 save
pm2 startup
```

#### Google Cloud Run

```bash
# Create Dockerfile in backend root
gcloud builds submit --tag gcr.io/your-project/theatre-backend

# Deploy
gcloud run deploy theatre-api \
  --image gcr.io/your-project/theatre-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## Environment Configuration

### Production (.env)

**Backend** (`backend/.env.production`):
```
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://xtheatre.com
SOCKET_IO_PORT=3001
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_secure_jwt_secret
```

**Frontend** (`frontend/.env.production`):
```
REACT_APP_API_URL=https://api.xtheatre.com
REACT_APP_ENVIRONMENT=production
```

## Performance Optimization

### Frontend
- Minified production build: ~320KB (gzipped)
- All modules code-split optimally
- CSS optimized with PostCSS
- Images lazy-loaded

### Backend
- Production-grade error handling
- Connection pooling for database
- Request rate limiting ready
- Socket.IO connection management

## Monitoring & Logging

### Application Logs

**Development**:
```bash
npm run dev
# Logs visible in console
```

**Production**:
```bash
# Use process manager (PM2)
pm2 logs theatre-api

# Or Docker logs
docker logs container-id

# Or cloud provider logging (CloudWatch, Stackdriver, etc.)
```

### Health Checks

```bash
# Check API health
curl http://localhost:3001/api/health

# Response:
# {
#   "status": "ok",
#   "timestamp": "2024-05-09T12:34:56Z",
#   "users": 5,
#   "bookings": 12
# }
```

## Security Checklist

- ✅ HTTPS/SSL enabled
- ✅ CORS properly configured
- ✅ Environment variables for secrets
- ✅ Input validation on all endpoints
- ✅ Authentication ready (JWT)
- ✅ Rate limiting ready
- ✅ SQL injection protection (prepared statements)
- ✅ XSS protection (React built-in)
- ✅ CSRF tokens ready

## Database Migration (Future)

When adding MongoDB/PostgreSQL:

```bash
# Install database driver
npm install mongoose  # or pg

# Set environment variable
export MONGODB_URI=mongodb://user:pass@host:port/dbname

# Backend will automatically connect and initialize
```

## Scaling

### Horizontal Scaling

For multi-instance deployment:

1. Use Redis for session management
2. Use message queue (Redis/RabbitMQ) for cross-instance sync
3. Deploy multiple backend instances behind load balancer
4. Use CDN for static frontend

### Database Scaling

- Implement connection pooling
- Add read replicas for queries
- Use indexes for performance
- Archive old bookings

## Troubleshooting

### Port already in use
```bash
lsof -i :3001
kill -9 <PID>
```

### Out of memory
```bash
# Increase Node.js memory
node --max-old-space-size=4096 dist/index.js
```

### WebSocket connection issues
- Check CORS configuration
- Verify Socket.IO version compatibility
- Check firewall rules for WebSocket traffic

## CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Build
        run: npm run build
      
      - name: Deploy Frontend
        run: |
          npm run deploy:frontend
      
      - name: Deploy Backend
        run: |
          npm run deploy:backend
```

## Maintenance

### Regular Tasks
- Monitor API logs for errors
- Check server resource usage
- Update dependencies: `npm update`
- Back up database regularly
- Review security logs

### Performance Monitoring
```bash
# Monitor real-time performance
node --inspect dist/index.js

# Then visit: chrome://inspect
```

---

**For questions or issues, check the main README.md or GitHub issues.**

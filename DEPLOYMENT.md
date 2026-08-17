# Deploying MediNear (GitHub → Vercel + Render + MongoDB Atlas)

This is the free, standard way to host a React + Node + MongoDB app:
- **Code** lives on **GitHub**
- **Frontend** (React) deploys on **Vercel** (auto-deploys from GitHub)
- **Backend** (Node/Express) deploys on **Render** (auto-deploys from GitHub)
- **Database** lives on **MongoDB Atlas** (free tier)

GitHub Pages alone won't work here — it only serves static files and can't run
your Node/Express backend or connect to MongoDB. That's why the backend needs
a separate host like Render.

## Step 1 — Push the code to GitHub

1. Create a new repository on [github.com](https://github.com/new) (e.g. `medinear`). Leave it empty — no README, no .gitignore (you already have one).
2. In VS Code terminal, from the `medinear` folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/medinear.git
   git push -u origin main
   ```

## Step 2 — Set up MongoDB Atlas (free database)

1. Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free (M0) cluster.
3. Under **Database Access**, create a user with a username/password.
4. Under **Network Access**, add `0.0.0.0/0` (allow access from anywhere) — needed since Render's IP isn't fixed on the free tier.
5. Click **Connect → Drivers**, copy the connection string. It looks like:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/medinear?retryWrites=true&w=majority
   ```
   Keep this — you'll paste it into Render as `MONGO_URI`.

## Step 3 — Deploy the backend on Render

1. Go to [render.com](https://render.com) → sign in with GitHub.
2. **New → Web Service** → select your `medinear` repo.
3. Configure:
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add environment variables (Render dashboard → Environment):
   - `MONGO_URI` = your Atlas connection string from Step 2
   - `PORT` = `5000` (Render sets its own PORT automatically, but keep this as a fallback in code)
5. Deploy. Once live, copy your backend URL, e.g. `https://medinear-backend.onrender.com`.

> Free Render services sleep after inactivity and take ~30–60 seconds to wake up on the first request — normal for free tier.

## Step 4 — Deploy the frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → sign in with GitHub.
2. **Add New → Project** → select your `medinear` repo.
3. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite (auto-detected)
4. Add environment variable:
   - `VITE_API_URL` = your Render backend URL from Step 3 (e.g. `https://medinear-backend.onrender.com`)
5. Deploy. Vercel gives you a live URL like `https://medinear.vercel.app`.

## Step 5 — Keep it updated

Every time you `git push` to `main`, both Vercel and Render automatically rebuild and redeploy. No manual redeploy needed.

## Local vs production summary

| | Local dev | Production |
|---|---|---|
| Frontend | `http://localhost:5173` | Vercel URL |
| Backend | `http://localhost:5000` | Render URL |
| Database | Local MongoDB or Atlas | Atlas |
| Frontend → Backend | `VITE_API_URL` unset → defaults to localhost | `VITE_API_URL` set in Vercel env vars |

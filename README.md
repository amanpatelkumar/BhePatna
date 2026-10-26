# Bombay Hardware & Electricals – website (GitHub Pages test version)

## 1. Put the site on GitHub
1. Create a **public** repository, e.g. `bhepatna`, on github.com.
2. Upload every file from the zip into it, keeping the folders. GitHub Desktop is the safest way (File → Add local repository → Publish). Make sure `index.html` is at the top level of the repository.
3. Repository **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: main, folder: / (root) → Save.**
4. Wait 1–2 minutes. The site is at `https://YOURNAME.github.io/bhepatna/`.

## 2. Create a GitHub access token for the admin (once)
1. GitHub → your profile picture → Settings → Developer settings → Personal access tokens → **Fine-grained tokens** → Generate.
2. Repository access: **Only select repositories** → `bhepatna`.
3. Repository permissions: **Contents → Read and write**.
4. Copy the token (shown only once).

## 3. Set up the admin — do this right after step 1
1. Open `https://YOURNAME.github.io/bhepatna/admin/`.
2. The first visit asks for setup: enter `YOURNAME/bhepatna`, the token, and a password of at least 12 characters.
   **Do this immediately after publishing.** Until it is done, anyone who finds the admin page could set it up with their own token.
3. The token is stored in `admin/vault.json`, encrypted with your password. Without the password it cannot be read.

## 4. Daily use
- Open `/admin/`, enter your password.
- Edit prices, MRP, stock, featured/new flags, descriptions and photos. Add or delete products.
- Press **Publish**. GitHub saves one change and the site updates within about a minute. No rebuild is needed.
- ⚙ Settings: website address, WhatsApp number, phone, and change the password.

## Limits (test version)
- The admin page is public (the password protects the token). Use a long password, and never share the token.
- New **brands** can't be added from the admin (each brand needs its own page). Ask for help when you need one.
- Brand and category pages are generated files; re-run `node build.mjs` on your PC after template changes.
- Lock the admin with ⚙ → Lock admin when you finish.

## For developers
`node build.mjs` regenerates the static pages from `data/*.json`. `hostinger/` holds the PHP admin for later use on Hostinger (it is not used on GitHub).

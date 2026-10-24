# Rafi Ullah — Portfolio

A static portfolio for full-stack web development, Flutter applications, and AI video work. Open `index.html` through a local web server, for example `python -m http.server 4173`, or deploy the repository as a static site on Vercel.

## Design and interactions

Off-white surfaces, teal and black accents, and a blurred abstract hero background. A separate color portrait and education introduction enters from the sides, followed by About and software skills. Projects use a horizontally scrollable gallery with tabs, arrow buttons, and touch swiping. Vertical scrolling leads directly to the AI video section. The full-width animated toolkit ribbon and reversible portrait entrance respond to motion preferences. Mouse-wheel scrolling is gently eased. AI videos appear in a dark teal four-card gallery. Case studies, screenshot enlargement, previous/next screenshot controls, and video playback remain available. The contact form opens an email draft in the visitor's email application.

## Content

All seven projects, fifteen software skills, education, fellowship, certification, résumé, four videos, and contact links are included. SelfText appears first, followed by Naya Purana Store, Daira, ClientFlow CRM, Blood Bank, EVM and EduConnect. SelfText uses actual Flutter UI captures with demonstration records. Daira uses the supplied images. EduConnect, ClientFlow, and Blood Bank screenshots were captured from the local applications. EVM is presented through a written case study only. The original EduConnect images remain in the asset folder.

## Checks

Run `python verify_portfolio.py` to check local asset references, unique element IDs, seven case studies, and four videos. Run `node --check studio.js`, `node --check scroll-scenes.js`, and `node --check refinement.js` to check JavaScript syntax. `minimal.css` is the active theme; `studio.css` preserves the earlier design.

The linked project repositories currently point to the owner's GitHub profile; individual repository URLs can be added when available. Local project source fixes are outside this portfolio repository.

## Live site and updates

Portfolio: https://rafi-builds.vercel.app/
Repository: https://github.com/rafiullah39/myPortfolio

Vercel project `rafi-builds` is connected to this repository. Push commits to its `main` branch to trigger production deployments automatically. Local edits must be committed and pushed before the live site changes. From the publishing worktree, use `git push origin HEAD:main`.

Naya Purana Store is linked to its public sample deployment at https://naya-purana.netlify.app/. Its source repository remains private. Store screenshots show the real public UI, and the case study explicitly identifies the sample/closed-ordering status. The downloadable resume includes Naya Purana second.

# Lakshay Rawat · Engineering Portfolio

[![Deploy to AWS](https://github.com/Lakshaycodes08/portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/Lakshaycodes08/portfolio/actions/workflows/deploy.yml)
[![Vite](https://img.shields.io/badge/bundler-Vite_5-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![AWS S3](https://img.shields.io/badge/hosting-AWS_S3-FF9900?style=flat&logo=amazons3&logoColor=white)](https://aws.amazon.com/s3/)
[![AWS CloudFront](https://img.shields.io/badge/CDN-Amazon_CloudFront-232F3E?style=flat&logo=amazonwebservices&logoColor=white)](https://aws.amazon.com/cloudfront/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Interactive personal portfolio for **Lakshay Rawat**, AI Engineer at [Swytchcode](https://github.com/Lakshaycodes08), showcasing machine learning systems, backend engineering projects, and a football-themed interactive journey.

---

## ⚡ Highlights & Key Features

### 1. 3D Cylindrical Project Selector Wheel
- Built with hardware-accelerated CSS 3D transforms (`translate3d`, `rotateX`, `preserve-3d`).
- **Interactive controls**:
  - Full keyboard accessibility (`ArrowUp`, `ArrowDown`, `PageUp`, `PageDown`, `Enter`, `Space`).
  - Touch & mouse pointer drag physics with momentum calculation and pointer velocity detection.
  - Smooth mouse wheel scrolling with lock debouncing.
  - Idle auto-revolving state that pauses cleanly on user interaction or hover.
- **Accessible modal dialog**: Native HTML5 `<dialog>` with focus trapping, `Escape` key support, and deep project details.

### 2. Interactive Pitch Journey Map
- Vector football pitch rendered via scalable inline SVG.
- Animated pass trajectory utilizing SVG `<animateMotion>` along a custom path.
- Milestones detailing the path from NSUT B.Tech, Campus Placement Leadership (1,000+ offers handled), to AI Engineering at Swytchcode.

### 3. Stadium Audio Player ("Freed from Desire" - Gala)
- Integrated soundtrack featuring the football stadium anthem *Freed from Desire* by Gala.
- **Smart browser audio engine**:
  - Adheres strictly to browser Autoplay Policies; engages automatically on first user click anywhere on the page or project selection.
  - Smooth volume ramp-up (fade-in) to a comfortable listening level.
  - 4-bar animated equalizer visualization in the header that pulses to the rhythm.
  - `visibilitychange` listener that auto-pauses playback when the tab is hidden and resumes when refocused.
  - Full manual control via the header **`PLAY`** / **`PAUSE`** toggle.

### 4. Recruiter-Ready Resume
- Integrated directly into the top navigation bar (`Player Profile` · `Journey` · `Resume` · `Contact`).
- Opens a dedicated, high-resolution PDF ([`Lakshay_Rawat_Resume.pdf`](public/Lakshay_Rawat_Resume.pdf)) in a new tab.

---

## 🛠️ Tech Stack & Philosophy

- **Zero Heavy Framework Bloat**: No React or Vue runtime overhead. Uses modern Vanilla JavaScript (ES Modules) and pure CSS3 variables for maximum rendering speed and sub-second First Contentful Paint (FCP).
- **Modern Typography**: Custom Google Font integration with **Rajdhani** and **Aptos Display**.
- **Content Security Policy (CSP)**: Strict security headers preventing unauthorized inline scripts or cross-site asset injection.
- **Build Tool**: Powered by **Vite 5** with tree-shaking, CSS minification, and optimized static asset hashing.

---

## ☁️ Cloud Architecture & Deployment

This project is architected for production hosting using the AWS static web hosting reference architecture:

```
                      +-------------------+
                      |   GitHub Push     |
                      +---------+---------+
                                |
                                v
                   +---------------------------+
                   |   GitHub Actions CI/CD    |
                   |  (Builds & Tests Vite app)|
                   +-------------+-------------+
                                 |
                     +-----------+-----------+
                     |                       |
                     v                       v
           +-------------------+   +--------------------+
           |  Amazon S3 Bucket |   | CloudFront Edge    |
           |  (Static Storage) |   | (Cache Invalidation|
           +---------+---------+   +---------+----------+
                     |                       |
                     +-----------+-----------+
                                 |
                                 v
                     +-----------------------+
                     | Global Edge Delivery  |
                     | Sub-100ms Worldwide   |
                     | Free SSL/HTTPS via ACM|
                     +-----------------------+
```

### Automated CI/CD Pipeline (`.github/workflows/deploy.yml`)
Every push to the `main` branch automatically triggers:
1. Fresh dependency installation via `npm ci`.
2. Production build via `npm run build`.
3. AWS credential authentication using `aws-actions/configure-aws-credentials@v4`.
4. Incremental static asset sync to Amazon S3 via `aws s3 sync dist/ s3://${{ secrets.S3_BUCKET_NAME }} --delete`.
5. Global CloudFront edge cache invalidation (`/*`) for zero-downtime rollouts.

### Setting Up AWS Credentials (GitHub Secrets)
Add the following secrets under **Settings > Secrets and variables > Actions**:

| Secret Name | Description | Example |
| :--- | :--- | :--- |
| `AWS_ACCESS_KEY_ID` | AWS IAM user access key with S3 and CloudFront permissions | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM user secret access key | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `S3_BUCKET_NAME` | Name of your target Amazon S3 bucket | `lakshay-portfolio` |
| `CLOUDFRONT_DISTRIBUTION_ID` | Target CloudFront CDN Distribution ID | `E1A2B3C4D5E6F` |

---

## 📁 Repository Structure

```
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions CI/CD to S3 + CloudFront
├── assets/
│   ├── fonts/
│   │   ├── OFL.txt                 # Font license
│   │   └── Rajdhani-Bold.ttf       # Custom typography
│   └── images/
│       └── football-player-real-madrid.webp  # Hero player artwork
├── public/
│   ├── audio/
│   │   └── freed-from-desire.mp4   # Original Gala soundtrack
│   └── Lakshay_Rawat_Resume.pdf    # Recruiter-ready resume
├── index.html                      # Semantic HTML5 entry document
├── package.json                    # Project configuration & scripts
├── script.js                       # 3D wheel, audio engine & interactive logic
├── style.css                       # Pitch-themed design system & animations
└── README.md                       # Comprehensive documentation
```

---

## 🚀 Local Development

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or later)
- [npm](https://www.npmjs.com/) (version 9 or later)

### Quick Start
```bash
# 1. Clone the repository
git clone https://github.com/Lakshaycodes08/portfolio.git

# 2. Enter directory
cd portfolio

# 3. Install dev dependencies
npm install

# 4. Start local development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

### Production Build & Preview
```bash
# Build optimized static bundle in dist/
npm run build

# Preview production build locally
npm run preview
```

---

## 📬 Contact & Connect

- **LinkedIn**: [linkedin.com/in/lakshay-r-1b8166287](https://www.linkedin.com/in/lakshay-r-1b8166287/)
- **Email**: [lkomrawat@gmail.com](mailto:lkomrawat@gmail.com)
- **GitHub**: [github.com/Lakshaycodes08](https://github.com/Lakshaycodes08)
- **HuggingFace**: [huggingface.co/luxay08](https://huggingface.co/spaces/luxay08/eurosat-classifier)

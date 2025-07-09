# LinkSnappy 🔗⚡

**Snap your links, share instantly**

A modern, lightning-fast URL shortener built with Next.js and Express. Create short links with powerful analytics, QR codes, and beautiful UI.

![LinkSnappy](https://img.shields.io/badge/LinkSnappy-URL%20Shortener-blue)
![MIT License](https://img.shields.io/badge/License-MIT-green)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Express](https://img.shields.io/badge/Express-4.18-blue)

## ✨ Features

- **🚀 Lightning Fast** - Instant URL shortening with optimized performance
- **📊 Analytics Dashboard** - Track clicks, views, and performance metrics
- **📱 QR Code Generation** - Automatic QR codes for all shortened links
- **🎨 Modern UI** - Clean, responsive design with Tailwind CSS
- **🔒 No Database Required** - Simple JSON file storage
- **⚡ Easy Deploy** - One-click deployment to Vercel
- **📈 Real-time Stats** - Live analytics and click tracking
- **🔗 Custom Short Codes** - 6-character unique identifiers

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Storage**: JSON file system (no database needed)
- **QR Codes**: qrcode library
- **Icons**: Lucide React
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/linksnappy.git
   cd linksnappy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration:
   ```env
   BASE_URL=http://localhost:3000
   PORT=3001
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

4. **Run the development servers**
   
   In one terminal (Backend):
   ```bash
   npm run dev:server
   ```
   
   In another terminal (Frontend):
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
linksnappy/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Homepage with URL shortener
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   ├── redirect/[shortCode]/    # Redirect handler
│   └── analytics/[shortCode]/   # Analytics dashboard
├── server.js                    # Express backend server
├── data/                        # JSON storage directory
│   └── urls.json               # URL storage (auto-generated)
├── public/                      # Static assets
├── vercel.json                  # Vercel deployment config
└── README.md                    # This file
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `BASE_URL` | Base URL for your deployment | `http://localhost:3000` |
| `PORT` | Backend server port | `3001` |
| `NEXT_PUBLIC_API_URL` | Frontend API URL | `http://localhost:3001/api` |

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/shorten` | Create a shortened URL |
| `GET` | `/api/url/:shortCode` | Get URL information |
| `GET` | `/api/redirect/:shortCode` | Get redirect URL and update analytics |
| `GET` | `/api/analytics/:shortCode` | Get analytics data |
| `GET` | `/api/urls` | Get all URLs (dashboard) |

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/linksnappy.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set environment variables:
     - `BASE_URL`: Your Vercel domain (e.g., `https://linksnappy.vercel.app`)
   - Deploy!

### Deploy to Other Platforms

The app works on any platform that supports Node.js:
- **Netlify**: Use `netlify.toml` configuration
- **Railway**: Direct Git deployment
- **DigitalOcean**: App Platform deployment
- **Heroku**: Add `Procfile` with `web: node server.js`

## 🎨 Customization

### Branding

Update the branding in `app/layout.tsx`:
```tsx
// Change colors, logo, and name
const brandName = "YourBrand"
const brandColors = {
  primary: "#your-color",
  secondary: "#your-color"
}
```

### Styling

Modify `tailwind.config.js` for custom colors:
```js
theme: {
  extend: {
    colors: {
      brand: {
        // Your brand colors
      }
    }
  }
}
```

## 📊 Analytics Features

- **Click Tracking**: Monitor total clicks per link
- **Creation Date**: Track when links were created
- **Last Accessed**: See when links were last clicked
- **QR Code Analytics**: Track QR code usage
- **Performance Metrics**: View link performance stats

## 🔐 Security Features

- **URL Validation**: Validates URLs before shortening
- **Rate Limiting**: Prevents abuse (can be added)
- **CORS Protection**: Configured for security
- **Input Sanitization**: Prevents XSS attacks

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** for the amazing React framework
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide React** for the beautiful icons
- **Vercel** for the excellent deployment platform

## 📞 Support

If you have any questions or need help:

- **GitHub Issues**: [Create an issue](https://github.com/yourusername/linksnappy/issues)
- **Email**: your.email@example.com
- **Twitter**: [@yourusername](https://twitter.com/yourusername)

---

Made with ❤️ by [Abraham Stryker](https://github.com/abraham-stryker)

**LinkSnappy** - Snap your links, share instantly! 🔗⚡
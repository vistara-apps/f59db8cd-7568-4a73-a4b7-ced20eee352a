# SoulConnect - AI Dating Profile Generator

A production-ready Base Mini App that uses AI to generate compelling dating app bios and personalized date ideas for meaningful connections.

## ✨ Features

### Core Features
- **🤖 AI Bio Generator**: Create multiple unique, engaging dating app bios based on your personality and interests
- **💕 Personalized Date Ideas**: Get custom date suggestions tailored to your interests and location
- **⛓️ Base Integration**: Built on Base blockchain with wallet connectivity and micro-transactions
- **📱 Mobile-First Design**: Optimized for mobile devices and Farcaster frames

### Production Features
- **🔒 Secure Payments**: Micro-transaction model with Base ETH
- **📊 Analytics Ready**: Comprehensive event tracking and performance monitoring
- **🛡️ Error Handling**: Robust error boundaries and user feedback
- **⚡ Performance Optimized**: Caching, code splitting, and Web Vitals tracking
- **🔐 Security Headers**: Production-grade security configuration
- **📈 SEO Optimized**: Complete meta tags and structured data

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **UI**: React 18, TypeScript, Tailwind CSS
- **Components**: Custom design system with Lucide icons
- **State Management**: React hooks with custom data fetching

### Blockchain
- **Network**: Base (Ethereum L2)
- **Wallet**: OnchainKit, Wagmi, Viem
- **Payments**: Native ETH micro-transactions

### AI & APIs
- **AI Models**: OpenAI GPT-4o-mini / OpenRouter Gemini
- **Caching**: In-memory with production Redis ready
- **Error Handling**: Comprehensive error boundaries

### Production
- **Analytics**: Web Vitals, custom event tracking
- **Security**: Security headers, input validation
- **Performance**: Code splitting, image optimization
- **Deployment**: Vercel-optimized with standalone output

## 🚀 Quick Start

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd soulconnect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your API keys:
   ```bash
   # Required
   OPENAI_API_KEY=your_openai_api_key_here
   NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key_here
   
   # Optional (for production)
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   SENTRY_DSN=your_sentry_dsn
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

### Production Deployment

#### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables
4. Deploy automatically

#### Other Platforms
- **Netlify**: Import from GitHub
- **Railway**: Full-stack deployment
- **DigitalOcean**: Container deployment

📖 **See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide**

## 💡 Usage

1. **Connect Wallet**: Connect your Base-compatible wallet
2. **Generate Bio**: Input your interests, personality traits, and preferences to get AI-generated dating bios
3. **Create Date Ideas**: Share your interests and location to receive personalized date suggestions
4. **Copy & Use**: Copy your favorite bios and date ideas to use on dating apps

## 🏗 Architecture

### API Routes
- `POST /api/generate-bio` - AI bio generation with caching
- `POST /api/generate-date-ideas` - Personalized date suggestions
- `GET/POST /api/process-payment` - Blockchain payment processing
- `GET/POST/DELETE /api/user` - User data management

### Components
- **BioGenerator**: AI-powered bio creation with payment integration
- **DateIdeaGenerator**: Location-based date idea suggestions
- **WalletConnection**: Base wallet integration with user status
- **ErrorBoundary**: Production-grade error handling
- **Analytics**: Comprehensive event tracking

### Hooks
- `usePayment`: Blockchain payment processing
- `useUser`: User data management and persistence
- `useAccount`: Wallet connection state (Wagmi)

## 🔧 Production Features

### Performance
- ⚡ Code splitting and lazy loading
- 🗄️ In-memory caching with Redis fallback
- 📊 Web Vitals monitoring
- 🖼️ Optimized images and assets

### Security
- 🔒 Secure headers and CORS configuration
- 🛡️ Input validation and sanitization
- 🔐 Environment variable protection
- ⛓️ Transaction verification

### Monitoring
- 📈 Analytics event tracking
- 🚨 Error boundary implementation
- 📊 Performance metrics collection
- 🔍 User journey analysis

## Architecture

- `app/` - Next.js App Router pages and layouts
- `components/` - Reusable UI components
- `lib/` - Utilities, types, and AI integration
- `public/` - Static assets

## Key Components

- **BioGenerator**: AI-powered dating bio creation
- **DateIdeaGenerator**: Personalized date idea suggestions
- **WalletConnection**: Base wallet integration
- **AppShell**: Main app layout and navigation

## Deployment

The app is optimized for deployment on Vercel or similar platforms that support Next.js.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

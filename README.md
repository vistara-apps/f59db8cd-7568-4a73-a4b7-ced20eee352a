# SoulConnect 💕

**Craft your perfect dating profile & spark meaningful connections**

A production-ready Next.js Base Mini App that uses AI to generate compelling dating app bios and suggest personalized date ideas for young singles looking for deeper connections.

## ✨ Features

### 🤖 AI Bio Generator
- Generate multiple unique, engaging dating app bios
- Input your interests, personality traits, and what you're looking for
- AI creates personalized content that highlights your personality
- Copy and use bios across different dating platforms

### 💝 Personalized Date Ideas
- Get curated date suggestions based on your interests and location
- Specify desired vibe (romantic, adventurous, casual, etc.)
- Includes estimated costs and duration for each idea
- Perfect for planning memorable first dates or ongoing relationships

### 💰 Micro-Transaction Model
- Pay-per-generation pricing (0.001 ETH per service)
- No subscriptions or large upfront costs
- Secure payments via Base blockchain
- Transparent pricing and instant access

### 🔐 Web3 Integration
- Connect with any Base-compatible wallet
- Secure on-chain payments
- User data privacy and ownership
- Decentralized payment processing

### 📱 Production-Ready Features
- Responsive design optimized for mobile and desktop
- Real-time payment processing with transaction verification
- User profile and generation history
- Analytics and usage tracking
- Error handling and loading states
- Accessibility-compliant UI components

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Base-compatible wallet (for testing payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/f59db8cd-7568-4a73-a4b7-ced20eee352a.git
   cd f59db8cd-7568-4a73-a4b7-ced20eee352a
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your API keys:
   ```env
   # Required: AI Generation
   OPENAI_API_KEY=your_openai_api_key_here
   # OR use OpenRouter instead
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   
   # Required: Base Integration
   NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Web3**: OnchainKit, Wagmi, Viem
- **AI**: OpenAI API (GPT-4) or OpenRouter
- **Database**: In-memory (demo) - easily replaceable with PostgreSQL/MongoDB
- **Payments**: Base blockchain (Ethereum L2)

### Project Structure
```
├── app/
│   ├── api/                 # API routes
│   │   ├── generate-bio/    # Bio generation endpoint
│   │   ├── generate-date-ideas/ # Date ideas endpoint
│   │   ├── payment/         # Payment processing
│   │   └── analytics/       # Usage analytics
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Main application page
│   └── providers.tsx        # Web3 providers
├── components/              # Reusable UI components
│   ├── AppShell.tsx         # Main app container
│   ├── BioGenerator.tsx     # Bio generation interface
│   ├── DateIdeaGenerator.tsx # Date ideas interface
│   ├── PaymentModal.tsx     # Payment processing modal
│   ├── UserProfile.tsx      # User stats and history
│   ├── WalletConnection.tsx # Wallet connection UI
│   └── ui/                  # Base UI components
├── lib/                     # Utility libraries
│   ├── ai.ts               # AI generation logic
│   ├── payment.ts          # Payment service
│   ├── database.ts         # Data persistence
│   ├── types.ts            # TypeScript definitions
│   └── utils.ts            # Helper functions
└── public/                 # Static assets
```

## 💳 Payment Integration

### Supported Networks
- **Base Mainnet**: Production payments
- **Base Sepolia**: Testing and development

### Payment Flow
1. User initiates bio/date idea generation
2. Payment modal displays cost and transaction details
3. User confirms payment through connected wallet
4. Transaction is verified on-chain
5. AI generation begins after successful payment
6. Results are delivered and stored in user history

### Pricing
- **Bio Generation**: 0.001 ETH (~$2-4 USD)
- **Date Ideas**: 0.001 ETH (~$2-4 USD)

## 🔧 API Documentation

### POST `/api/generate-bio`
Generate AI-powered dating bios.

**Request Body:**
```json
{
  "interests": ["hiking", "photography", "cooking"],
  "personalityTraits": ["adventurous", "funny", "thoughtful"],
  "lookingFor": "Someone who shares my love for adventure",
  "age": 28,
  "walletAddress": "0x..."
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    "Adventure-seeking photographer who believes...",
    "Cooking enthusiast with a passion for...",
    "Thoughtful explorer looking for..."
  ]
}
```

### POST `/api/generate-date-ideas`
Generate personalized date ideas.

**Request Body:**
```json
{
  "interests": ["art", "music", "food"],
  "location": "San Francisco, CA",
  "vibe": "romantic and intimate",
  "budget": "$$",
  "walletAddress": "0x..."
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "title": "Sunset Art Gallery Walk",
      "description": "Explore local galleries during golden hour...",
      "category": "Cultural",
      "estimatedCost": "$$",
      "duration": "2-3 hours"
    }
  ]
}
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
npm start
```

### Environment Variables for Production
- Set all API keys securely
- Configure proper CORS settings
- Set up monitoring and analytics
- Configure database connection (replace in-memory storage)

## 🧪 Testing

### Test Payment Flow
1. Use Base Sepolia testnet
2. Get test ETH from Base faucet
3. Test complete payment flow
4. Verify transaction on Base block explorer

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔮 Roadmap

### Phase 1 (Current)
- ✅ AI bio generation
- ✅ Personalized date ideas
- ✅ Base payment integration
- ✅ User profiles and history

### Phase 2 (Coming Soon)
- 📸 Photo analysis and selection tool
- 🎯 A/B testing for bio effectiveness
- 📊 Advanced analytics dashboard
- 🔄 Integration with popular dating apps

### Phase 3 (Future)
- 🤖 Conversation starter suggestions
- 📱 Mobile app (React Native)
- 🌍 Multi-language support
- 🎨 Custom branding for dating platforms

---

**Built with ❤️ for the dating community**

*SoulConnect - Where AI meets authentic connections*

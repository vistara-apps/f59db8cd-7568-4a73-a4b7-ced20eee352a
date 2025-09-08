# SoulConnect 💕

A production-ready Next.js Base Mini App that uses AI to generate compelling dating profiles and personalized date ideas. Built for the Base blockchain ecosystem with secure payment processing and modern UX.

## ✨ Features

### Core Features
- **AI Bio Generator**: Create 3 unique, engaging dating app bios tailored to your personality
- **Personalized Date Ideas**: Get 4 creative, location-specific date suggestions
- **Base Blockchain Payments**: Secure micro-transactions (0.001 ETH per generation)
- **Wallet Integration**: Seamless connection with Base-compatible wallets
- **Real-time Analytics**: Track usage and revenue metrics

### Technical Features
- **Production-Ready**: Complete API layer with rate limiting and error handling
- **Database Integration**: Persistent storage for user data and generations
- **Payment Verification**: On-chain transaction verification
- **Responsive Design**: Mobile-first UI with modern design system
- **Type Safety**: Full TypeScript implementation
- **Performance Optimized**: Efficient caching and loading states

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Base-compatible wallet (for testing)
- OpenAI API key or OpenRouter API key

### Installation

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
   
   Fill in your API keys in `.env.local`:
   ```env
   # AI Generation
   OPENAI_API_KEY=your_openai_api_key_here
   # OR
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   
   # Base Integration
   NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key_here
   
   # Payment Configuration
   PAYMENT_RECIPIENT_ADDRESS=0x1234567890123456789012345678901234567890
   NEXT_PUBLIC_PAYMENT_RECIPIENT_ADDRESS=0x1234567890123456789012345678901234567890
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

### Frontend
- **Next.js 15** with App Router
- **React 18** with modern hooks
- **TypeScript** for type safety
- **Tailwind CSS** with custom design system
- **Wagmi** for wallet connections
- **OnchainKit** for Base integration

### Backend
- **Next.js API Routes** for serverless functions
- **Rate Limiting** to prevent abuse
- **Database Abstraction** (in-memory for dev, PostgreSQL for production)
- **Payment Verification** via Base blockchain
- **Error Handling** with proper HTTP status codes

### Blockchain
- **Base Network** for low-cost transactions
- **Viem** for blockchain interactions
- **Transaction Verification** for payment processing
- **Wallet Integration** via Wagmi

## 📁 Project Structure

```
├── app/
│   ├── api/                 # API routes
│   │   ├── bio/            # Bio generation endpoint
│   │   ├── date-ideas/     # Date ideas endpoint
│   │   ├── payment/        # Payment verification
│   │   ├── user/           # User management
│   │   └── analytics/      # Analytics endpoint
│   ├── globals.css         # Global styles with design tokens
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── providers.tsx       # Context providers
├── components/             # React components
│   ├── AppShell.tsx        # Main app container
│   ├── BioGenerator.tsx    # Bio generation UI
│   ├── DateIdeaGenerator.tsx # Date ideas UI
│   ├── PaymentModal.tsx    # Payment processing UI
│   ├── Button.tsx          # Reusable button component
│   ├── Card.tsx            # Card component
│   ├── TextInput.tsx       # Input components
│   └── ...
├── lib/                    # Utilities and configurations
│   ├── ai.ts              # AI generation functions
│   ├── database.ts        # Database abstraction
│   ├── rate-limit.ts      # Rate limiting utilities
│   ├── types.ts           # TypeScript type definitions
│   └── utils.ts           # Helper functions
├── public/                # Static assets
└── ...config files
```

## 🎨 Design System

The app uses a comprehensive design system with CSS custom properties:

### Colors
- **Primary**: `hsl(240, 80%, 50%)` - Main brand color
- **Accent**: `hsl(300, 70%, 60%)` - Secondary accent
- **Background**: `hsl(220, 20%, 98%)` - App background
- **Surface**: `hsl(220, 20%, 100%)` - Card backgrounds

### Typography
- **Display**: Large headings (text-3xl font-bold)
- **Heading**: Section headers (text-xl font-semibold)
- **Body**: Regular text (text-base leading-relaxed)
- **Caption**: Small text (text-sm text-gray-500)

### Components
All components follow consistent patterns with variants and proper TypeScript types.

## 💳 Payment Integration

### How It Works
1. User connects Base-compatible wallet
2. User fills out bio/date idea form
3. Payment modal shows 0.001 ETH cost
4. User approves transaction
5. App verifies payment on Base network
6. AI generation proceeds after verification

### Payment Configuration
```typescript
const PAYMENT_CONFIG = {
  BIO_GENERATION_COST: parseEther('0.001'), // 0.001 ETH
  DATE_IDEAS_COST: parseEther('0.001'),     // 0.001 ETH
  RECIPIENT_ADDRESS: process.env.PAYMENT_RECIPIENT_ADDRESS,
};
```

## 🗄️ Database Schema

The app includes a complete database schema for production deployment:

```sql
-- Users table
CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address VARCHAR(42) UNIQUE NOT NULL,
  profile_data JSONB,
  preferences JSONB,
  creation_date TIMESTAMP DEFAULT NOW()
);

-- Bio generations table
CREATE TABLE bio_generations (
  generation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id),
  input_prompt TEXT NOT NULL,
  generated_bio TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Date ideas table
CREATE TABLE date_ideas (
  idea_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id),
  interests TEXT[] NOT NULL,
  location VARCHAR(255) NOT NULL,
  generated_ideas JSONB NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Payment records table
CREATE TABLE payment_records (
  transaction_hash VARCHAR(66) PRIMARY KEY,
  wallet_address VARCHAR(42) NOT NULL,
  service_type VARCHAR(20) NOT NULL,
  amount DECIMAL(18, 8) NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  verified BOOLEAN DEFAULT FALSE
);
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
```env
# AI Generation
OPENAI_API_KEY=your_production_openai_key
OPENROUTER_API_KEY=your_production_openrouter_key

# Base Integration
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_production_onchainkit_key

# Payment Configuration
PAYMENT_RECIPIENT_ADDRESS=your_production_wallet_address
NEXT_PUBLIC_PAYMENT_RECIPIENT_ADDRESS=your_production_wallet_address

# Database (PostgreSQL recommended)
DATABASE_URL=postgresql://user:password@host:port/database

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Database Setup (Production)
1. Set up PostgreSQL database (Supabase, Railway, or AWS RDS)
2. Run the schema from `lib/database.ts`
3. Update `DATABASE_URL` environment variable
4. Replace in-memory database with PostgreSQL implementation

## 📊 Analytics

Access analytics at `/api/analytics`:

```json
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "totalBioGenerations": 300,
    "totalDateIdeas": 200,
    "totalPayments": 500,
    "totalRevenue": 0.5,
    "averageRevenuePerUser": 0.0033
  }
}
```

## 🔒 Security Features

- **Rate Limiting**: Prevents API abuse (10 requests/minute per IP)
- **Input Validation**: Comprehensive validation on all inputs
- **Payment Verification**: On-chain transaction verification
- **Error Handling**: Secure error messages without sensitive data
- **Type Safety**: Full TypeScript coverage

## 🧪 Testing

### Manual Testing Checklist
- [ ] Wallet connection works
- [ ] Bio generation with payment
- [ ] Date idea generation with payment
- [ ] Payment verification
- [ ] Error handling
- [ ] Mobile responsiveness
- [ ] Rate limiting

### API Testing
```bash
# Test bio generation
curl -X POST http://localhost:3000/api/bio \
  -H "Content-Type: application/json" \
  -d '{"interests":["hiking"],"personalityTraits":["funny"],"lookingFor":"adventure","walletAddress":"0x..."}'

# Test analytics
curl http://localhost:3000/api/analytics
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ for the Base ecosystem**

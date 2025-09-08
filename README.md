# SoulConnect - AI Dating Profile Generator

A Base Mini App that uses AI to generate compelling dating app bios and personalized date ideas for meaningful connections.

## Features

### Core Features ✨
- **AI Bio Generator**: Create multiple unique, engaging dating app bios based on your personality and interests
- **Personalized Date Ideas**: Get custom date suggestions tailored to your interests and location
- **Generation History**: View and manage your past bio and date idea generations
- **Copy & Share**: Easy copy-to-clipboard functionality for all generated content

### Technical Features 🔧
- **Base Integration**: Built on Base blockchain with secure wallet connectivity
- **Micro-Payments**: Pay-per-generation model using ETH on Base network
- **Mobile-First Design**: Optimized for mobile devices and Farcaster frames
- **Real-time Feedback**: Toast notifications and loading states
- **Data Persistence**: Local storage for user preferences and generation history
- **Error Handling**: Comprehensive error handling and user feedback

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Blockchain**: Base (Layer 2)
- **AI**: OpenAI GPT / OpenRouter
- **Styling**: Tailwind CSS
- **Wallet**: OnchainKit + MiniKit

## Getting Started

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
   
   Fill in your API keys:
   - `OPENAI_API_KEY` or `OPENROUTER_API_KEY` for AI generation
   - `NEXT_PUBLIC_ONCHAINKIT_API_KEY` for Base integration

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. **Connect Wallet**: Connect your Base-compatible wallet
2. **Generate Bio**: Input your interests, personality traits, and preferences to get AI-generated dating bios
3. **Create Date Ideas**: Share your interests and location to receive personalized date suggestions
4. **Copy & Use**: Copy your favorite bios and date ideas to use on dating apps

## Architecture

- `app/` - Next.js App Router pages and layouts
- `components/` - Reusable UI components
- `lib/` - Utilities, types, and AI integration
- `public/` - Static assets

## Key Components

### Core Components
- **BioGenerator**: AI-powered dating bio creation with form validation
- **DateIdeaGenerator**: Personalized date idea suggestions with location-based filtering
- **GenerationHistory**: View and manage past generations with copy functionality
- **PaymentModal**: Secure Base blockchain payment processing

### Infrastructure Components
- **WalletConnection**: Base wallet integration with OnchainKit
- **AppShell**: Main app layout and responsive navigation
- **ToastProvider**: Global notification system for user feedback
- **API Routes**: Secure server-side AI generation endpoints

### Utility Components
- **Button**: Consistent button component with variants and loading states
- **Card**: Flexible card component with elevation variants
- **TextInput/Textarea**: Form input components with validation
- **LoadingSpinner**: Animated loading indicator

## Deployment

The app is optimized for deployment on Vercel or similar platforms that support Next.js.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

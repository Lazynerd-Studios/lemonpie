# LemonnPie 🎬

**LemonnPie** is a comprehensive Nigerian movie review and criticism platform - a Nigerian alternative to Rotten Tomatoes. Built with the latest technologies to showcase the best of Nollywood and African cinema.

## 🌟 Features

### Core Functionality
- **Movie Reviews & Ratings**: Comprehensive critic and audience reviews with detailed ratings
- **Nigerian Cinema Focus**: Special emphasis on Nollywood movies and African cinema
- **Advanced Search & Filtering**: Find movies by genre, year, director, cast, and more
- **Responsive Design**: Optimized for all devices with modern, accessible UI
- **Dark/Light Theme**: Toggle between themes with system preference detection

### Design System
- **Custom Design Tokens**: Nigerian-inspired color palette with green, gold, and cultural themes
- **Modern UI Components**: Built with Tailwind CSS 4+ and custom component library
- **Animations & Interactions**: Smooth transitions and hover effects for enhanced UX
- **Typography**: Carefully selected fonts with proper hierarchy and readability

### User Experience
- **Intuitive Navigation**: Easy-to-use navigation with clear categorization
- **Movie Discovery**: Trending movies, featured content, and personalized recommendations
- **Community Reviews**: Both critic and audience reviews with verification system
- **Social Features**: Share movies, create watchlists, and engage with the community

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/) for type safety
- **Styling**: [Tailwind CSS 4+](https://tailwindcss.com/) with custom design system
- **UI Components**: Custom component library with [Radix UI](https://www.radix-ui.com/) primitives
- **State Management**: React hooks and context
- **Theme Management**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Utilities**: 
  - [clsx](https://github.com/lukeed/clsx) for conditional classnames
  - [tailwind-merge](https://github.com/dcastil/tailwind-merge) for class merging
  - [class-variance-authority](https://cva.style/docs) for component variants

## 🎨 Design System

### Color Palette
- **Primary**: Warm orange/amber tones
- **Nigerian Green**: #008751 (inspired by Nigerian flag)
- **Nollywood Gold**: #FFD700 (celebrating Nollywood glamour)
- **Lagos Blue**: #0066CC (modern Nigerian urban culture)
- **Supporting**: Carefully curated secondary colors for different contexts

### Custom Utilities
- **Gradient Text**: `.gradient-text` for eye-catching headlines
- **Glass Effect**: `.glass-effect` for modern frosted glass appearance
- **Hover Animations**: `.hover-lift` for interactive elements
- **Custom Animations**: Fade-in, slide-up, and scale effects

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles and design system
│   ├── layout.tsx         # Root layout with theme provider
│   ├── page.tsx           # Homepage
│   ├── movies/            # Movies listing and details
│   └── [other-routes]/    # Additional pages
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (Button, Card, etc.)
│   ├── layout/           # Layout components (Navigation, etc.)
│   ├── movie/            # Movie-specific components
│   └── providers/        # Context providers
├── lib/                  # Utility functions and configurations
└── types/               # TypeScript type definitions
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/lemonnpie.git
   cd lemonnpie
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📱 Pages & Features

### Homepage (`/`)
- Hero section with featured movie
- Trending movies carousel
- Latest reviews showcase
- Community statistics
- Call-to-action sections

### Movies (`/movies`)
- Comprehensive movie listing
- Advanced search and filtering
- Sort by rating, year, popularity
- Grid and list view modes
- Real-time filtering

### Movie Details (`/movies/[id]`)
- Detailed movie information
- Cast and crew details
- Critics and audience reviews
- Related movie recommendations
- Social sharing features

### Reviews (`/reviews`)
- Latest reviews from critics and users
- Filter by movie, reviewer type
- Review submission interface

## 🎯 Development Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

## 🌍 Nigerian Cultural Integration

LemonnPie celebrates Nigerian and African cinema through:

- **Nollywood Emphasis**: Special badges and sections for Nollywood movies
- **Nigerian Color Scheme**: Green and gold reflecting the Nigerian flag
- **Local Context**: Nigerian Naira (₦) for box office figures
- **Cultural Themes**: Design elements inspired by Nigerian art and culture
- **Local Language Support**: Ready for Yoruba, Igbo, and Hausa localization

## 🔮 Future Enhancements

- **User Authentication**: Login, profiles, and personalization
- **Advanced Reviews**: Video reviews, detailed critiques
- **Social Features**: Follow critics, share watchlists
- **Mobile App**: React Native companion app
- **API Integration**: Real movie data from TMDB or custom API
- **Recommendation Engine**: AI-powered movie suggestions
- **Multi-language Support**: Nigerian languages and international accessibility

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📞 Contact

- **Project**: LemonnPie Nigerian Movie Reviews
- **Description**: Celebrating the best of Nigerian and African cinema
- **Built with**: ❤️ for Nollywood and African storytelling

---

**Made with ❤️ for Nigerian cinema** 🇳🇬

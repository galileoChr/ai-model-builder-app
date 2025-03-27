# AI Model Builder

A sophisticated web application that allows users to create, train, and download AI models using natural language prompts. Built with Next.js 13+, TypeScript, and Tailwind CSS.

## Features

- **Natural Language Model Building** - Describe your ML task in plain English
- **Real-time Training Insights** - Watch your model train with live metrics
- **Model Management** - Store and download your trained models
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Dark Mode Support** - Choose between light and dark themes
- **Web3 Integration** - Connect your wallet using RainbowKit

## Tech Stack

- **Frontend**
  - Next.js 13+ (App Router)
  - TypeScript
  - Tailwind CSS
  - shadcn/ui Components
  - RainbowKit & wagmi
  - Lucide Icons

- **Backend**
  - FastAPI
  - Python
  - Model Context Protocol (MCP)

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm 9.0 or later

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-model-builder.git
cd ai-model-builder
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

To start the production server:
```bash
npm start
```

## Project Structure

```
├── app/                    # Next.js 13 app directory
│   ├── builder/           # AI model building interface
│   ├── models/            # Model management
│   ├── logs/             # Training logs
│   └── settings/         # User settings
├── components/            # Reusable React components
├── backend/              # Python FastAPI backend
│   ├── agents/           # AI agents and model builders
│   ├── mcp/              # Model Context Protocol definitions
│   └── data/             # Generated models and logs
└── public/               # Static assets
```

## Environment Variables

Create a `.env` file in the root directory:

```env
NEXT_PUBLIC_PROJECT_ID=your_wallet_connect_project_id
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Copyright © 2025 Christophe Manzi. All rights reserved.

## Contact

Christophe Manzi - [@galileoChr](https://github.com/galileoChr)

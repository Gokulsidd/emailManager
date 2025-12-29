# EmailManagerUI

A Next.js 15 application for managing email configurations with shadcn/ui components.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (New York style)
- **Icons**: Lucide React
- **Package Manager**: npm

## Getting Started

### Prerequisites

- Node.js v20 or higher
- npm

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## shadcn/ui Setup

This project is configured with shadcn/ui components. The following components are already installed:

- Button
- Input
- Table
- Card
- Dialog
- Dropdown Menu
- Select
- Checkbox
- Badge
- Separator

### Adding More Components

To add additional shadcn components:

```bash
npx shadcn@latest add [component-name]
```

For example:
```bash
npx shadcn@latest add form
npx shadcn@latest add toast
```

To see all available components:
```bash
npx shadcn@latest add
```

### Using shadcn Components

Import and use components from `@/components/ui`:

```tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Example Card</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="Enter text..." />
        <Button>Submit</Button>
      </CardContent>
    </Card>
  )
}
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── emailrule/         # Email rule configuration page
│   ├── globals.css        # Global styles with Tailwind
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── data/                 # Mock data
├── lib/                  # Utility functions
└── types/                # TypeScript type definitions
```

## Configuration Files

- `components.json` - shadcn/ui configuration
- `next.config.ts` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration (v4)
- `postcss.config.js` - PostCSS configuration
- `tsconfig.json` - TypeScript configuration

## Features

- Modern UI with shadcn/ui components
- Type-safe with TypeScript
- Tailwind CSS v4 for styling
- Responsive design
- Dark mode support (via shadcn/ui theme)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev)
export const colors = {
  background: 'hsl(var(--background))', // bg-background - Cor de fundo padrão.
  foreground: 'hsl(var(--foreground))', // text-foreground - Cor de texto padrão.

  primary: {
    DEFAULT: 'hsl(var(--primary))',
    50: 'hsl(var(--primary-50))',
    100: 'hsl(var(--primary-100))',
    200: 'hsl(var(--primary-200))',
    300: 'hsl(var(--primary-300))',
    400: 'hsl(var(--primary-400))',
    500: 'hsl(var(--primary-500))',
    600: 'hsl(var(--primary-600))',
    700: 'hsl(var(--primary-700))',
    800: 'hsl(var(--primary-800))',
    900: 'hsl(var(--primary-900))',
    950: 'hsl(var(--primary-950))',
    foreground: 'hsl(var(--primary-foreground))',
  },

  secondary: {
    DEFAULT: 'hsl(var(--secondary))',
    foreground: 'hsl(var(--secondary-foreground))',
  },

  destructive: {
    DEFAULT: 'hsl(var(--destructive))',
    foreground: 'hsl(var(--destructive-foreground))',
  },

  muted: {
    DEFAULT: 'hsl(var(--muted))',
    foreground: 'hsl(var(--muted-foreground))',
  }, // Planos de fundo silenciados, como <TabsList />, <Skeleton /> e <Switch /> desativado.

  border: 'hsl(var(--border))',
  input: 'hsl(var(--input))',
  ring: 'hsl(var(--ring))',

  accent: {
    DEFAULT: 'hsl(var(--accent))',
    foreground: 'hsl(var(--accent-foreground))',
  }, // warning using this like a primary color, ex: is color is hover in ghost button

  card: {
    DEFAULT: 'hsl(var(--card))', // bg-card - Cor de fundo de cartões.
    foreground: 'hsl(var(--card-foreground))', // text-card - Cor de texto de cartões.
  },

  popover: {
    DEFAULT: 'hsl(var(--popover))', // bg-popover - Cor de fundo para popovers como <DropdownMenu />, <HoverCard />, <Popover />
    foreground: 'hsl(var(--popover-foreground))',
  },
}

export type ColorKey = keyof typeof colors

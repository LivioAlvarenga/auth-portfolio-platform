export const colors = {
  background: 'hsl(var(--background))', // bg-background - Cor de fundo padrão.
  foreground: 'hsl(var(--foreground))', // text-foreground - Cor de texto padrão.

  primary: {
    DEFAULT: 'hsl(var(--primary))',
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

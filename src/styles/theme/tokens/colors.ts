export const colors = {
  background: '#EFEFEF', // bg-background - Cor de fundo padrão.
  foreground: '#000000', // text-foreground - Cor de texto padrão.
  dark: '#1D1D1B', // text-dark - Cor de texto escura alternativa.
  darker: '#181818', // text-darker - Cor de texto mais escura alternativa.

  primary: {
    DEFAULT: '#0866FF',
    foreground: '#FFFFFF',
  },

  secondary: {
    DEFAULT: '#001f2a',
    foreground: '#ffffff',
  },

  'tertiary-100': '#EFEFEF',
  'tertiary-200': '#DCDCDC',

  destructive: {
    DEFAULT: '#DC2626',
    foreground: '#FFFFFF',
  },

  muted: {
    DEFAULT: '#d9d9d9',
    foreground: 'rgba(0, 0, 0, 0.6)',
  }, // Planos de fundo silenciados, como <TabsList />, <Skeleton /> e <Switch /> desativado.

  border: 'rgba(8, 102, 255, 0.3)',
  input: 'rgba(8, 102, 255, 0.3)',
  ring: '#0866FF',

  accent: {
    DEFAULT: '#25D366',
    foreground: '#000000',
  }, // warning using this like a primary color, ex: is color is hover in ghost button

  card: {
    DEFAULT: '#ffffff', // bg-card - Cor de fundo de cartões.
    foreground: '#000000', // text-card - Cor de texto de cartões.
  },

  popover: {
    DEFAULT: '#ffffff', // bg-popover - Cor de fundo para popovers como <DropdownMenu />, <HoverCard />, <Popover />
    foreground: '#000000',
  },

  header: {
    DEFAULT: '#ffffff', // bg-header - Cor de fundo do cabeçalho.
    foreground: '#000000', // text-header - Cor de texto do cabeçalho.
  },

  footer: {
    DEFAULT: '#0866FF', // bg-footer - Cor de fundo do rodapé.
    foreground: '#FFFFFF', // text-footer - Cor de texto do rodapé.
  },
}

export type ColorKey = keyof typeof colors

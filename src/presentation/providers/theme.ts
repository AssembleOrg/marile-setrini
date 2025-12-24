import { createTheme, rem } from '@mantine/core'

export const theme = createTheme({
  fontFamily: "var(--font-jakarta), system-ui, sans-serif",
  headings: {
    fontFamily: "var(--font-playfair), var(--font-jakarta), system-ui, sans-serif",
    fontWeight: "600",
  },

  primaryColor: "brand",
  autoContrast: true,
  luminanceThreshold: 0.4,
  colors: {
    brand: [
      "#FFF6DD", // 0
      "#FDECC4", // 1
      "#FBE2AA", // 2
      "#F6D68E", // 3
      "#F1CA73", // 4
      "#ECB856", // 5 (primary)
      "#E6A11E", // 6 (hover/strong)
      "#C98312", // 7
      "#9E640B", // 8
      "#704606", // 9
    ],
    rose: [
      "#FFF1F1",
      "#FADADA",
      "#F3B3B3",
      "#EA8C8C",
      "#E26C6C",
      "#D06763",
      "#D9231D",
      "#B81D18",
      "#8F1411",
      "#650C0A",
    ],
    leaf: [
      "#EAF7EF",
      "#D6F0E0",
      "#ADE1C2",
      "#7DD2A0",
      "#4EC681",
      "#28AF68",
      "#1F9156",
      "#187445",
      "#115835",
      "#0A3C23",
    ],
  },

  defaultRadius: "lg",
  radius: { 
    xs: rem(8),
    sm: rem(12),
    md: rem(18), 
    lg: rem(24), 
    xl: rem(32) 
  },

  shadows: {
    xs: '0 4px 12px rgba(17, 17, 20, 0.05)',
    sm: '0 8px 20px rgba(17, 17, 20, 0.08)',
    md: '0 12px 30px rgba(17, 17, 20, 0.10)',
    lg: '0 16px 40px rgba(17, 17, 20, 0.12)',
    xl: '0 20px 60px rgba(17, 17, 20, 0.14)',
  },

  components: {
    Button: {
      defaultProps: {
        radius: 'lg',
      },
      styles: {
        root: {
          fontWeight: 500,
          transition: 'all 0.3s ease',
        },
      },
    },
    Card: {
      defaultProps: {
        radius: 'xl',
        shadow: 'md',
      },
      styles: {
        root: {
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        },
      },
    },
    TextInput: {
      defaultProps: {
        radius: 'lg',
      },
    },
    Select: {
      defaultProps: {
        radius: 'lg',
      },
    },
    Modal: {
      defaultProps: {
        radius: 'xl',
        centered: true,
      },
    },
    Notification: {
      defaultProps: {
        radius: 'lg',
      },
    },
    Paper: {
      defaultProps: {
        radius: 'xl',
      },
    },
  },
})

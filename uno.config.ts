import { defineConfig, presetUno, transformerVariantGroup } from "unocss";

export default defineConfig({
  presets: [presetUno()],
  transformers: [transformerVariantGroup()],

  preflights: [
    {
      getCSS: () => `
        * {
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.15) transparent;
        }
        *::-webkit-scrollbar {
          width: 6px;
        }
        *::-webkit-scrollbar-track {
          background: transparent;
        }
        *::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.15);
          border-radius: 3px;
        }
        *::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.3);
        }
        [data-kb-slider-thumb] {
          display: block !important;
          opacity: 1 !important;
        }
      `
    }
  ],

  theme: {
    colors: {
      primary: "#f3a952",
      "primary-st": "#f3a95230",
      secondary: "#8b8aa2",
      success: "#4bb543",
      bgd: {
        "100": "hsla(0,0%,7%,.75)",
        "200": "rgba(40,40,40,.3)",
        "300": "hsla(0,0%,100%,.05)"
      },
      bg: {
        "100": "#000000cb",
        "150": "#00000080",
        "300": "#24242f"
      }
    },
    
    fontFamily: {
      sans: "'Roboto', sans-serif"
    }
  }
});

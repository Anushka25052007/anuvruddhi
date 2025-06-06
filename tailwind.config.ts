import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" }
        },
        "twinkle": {
          "0%, 100%": { opacity: "0.1" },
          "50%": { opacity: "1" }
        },
        "shine": {
          "0%": { backgroundPosition: "200% center" },
          "100%": { backgroundPosition: "-200% center" }
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        },
        "wave-animation": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        }
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out forwards",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "twinkle": "twinkle 3s infinite ease-in-out",
        "shine": "shine 3s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "wave-bg": "wave-animation 15s ease infinite",
      },
      backgroundImage: {
        "certificate-pattern": "url('/lovable-uploads/a1f630c9-1610-45af-8613-37fe87fdfb8b.png')",
        "blue-wave-1": "url('/lovable-uploads/b5d3468c-bd12-458e-8c44-de321cb0d03b.png')",
        "blue-wave-2": "url('/lovable-uploads/5ed150ea-c0a9-490d-bf39-c25dc83c8c03.png')",
        "blue-wave-3": "url('/lovable-uploads/92d9362a-9ef4-47dc-85fa-82397b07b443.png')",
        "blue-wave-4": "url('/lovable-uploads/26341c30-b6be-45ff-b1fd-ae1fc8514f8f.png')",
        "blue-wave-5": "url('/lovable-uploads/581cb1b9-c88f-4c7a-87c9-a09d1081e425.png')",
        "blue-wave-6": "url('/lovable-uploads/f57c341b-06e3-4fb5-9f0b-c6eb94e07978.png')",
        "wave-1": "url('/lovable-uploads/5c9bb7e5-2b95-47d0-9a9b-b8d500841173.png')",
        "wave-2": "url('/lovable-uploads/1dc85859-3463-4d94-8c05-387c35ac7c7e.png')",
        "wave-3": "url('/lovable-uploads/e3abfa43-1d08-4a1a-8e8a-723655833d8b.png')",
        "wave-4": "url('/lovable-uploads/62895f60-7e5c-4e9f-9d65-a4666f520cc8.png')",
        "wave-5": "url('/lovable-uploads/0bcc6f59-dd40-4584-ae11-fa052d8d5808.png')",
        "wave-6": "url('/lovable-uploads/37cc5497-571b-4199-8dea-bcf84cdfb9a4.png')",
      },
      backgroundSize: {
        'wave-cover': '200% 200%',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

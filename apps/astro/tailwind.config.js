/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: [
    './src/**/*.{astro,html,js,jsx,ts,tsx}', // Make sure Astro files are included
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			primary: 'rgb(var(--primary) / <alpha-value>)',
  			'primary-dark': 'rgb(var(--primary-dark) / <alpha-value>)',
  			secondary: 'rgb(var(--secondary) / <alpha-value>)',
  			accent: 'rgb(var(--accent) / <alpha-value>)',
  			success: 'rgb(var(--success) / <alpha-value>)',
  			warning: 'rgb(var(--warning) / <alpha-value>)',
  			danger: 'rgb(var(--danger) / <alpha-value>)',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			sans: ['Inter', 'system-ui', 'sans-serif'],
  		},
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
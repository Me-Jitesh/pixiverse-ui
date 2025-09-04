export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
        "./node_modules/flowbite/**/*.js"
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#f8f5f2', 100: '#eee5de', 200: '#e0cdc3', 300: '#cfb19f',
                    400: '#b98874', 500: '#a65a3f', 600: '#8e442c', 700: '#6f3421',
                    800: '#582b1c', 900: '#492517'
                }
            },
            boxShadow: {
                soft: '0 6px 20px rgba(0,0,0,0.06)'
            },
            borderRadius: {
                xl2: '1rem'
            }
        }
    },
    plugins: [require('flowbite/plugin')],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // ต้องระบุแบบนี้เพื่อให้ครอบคลุมโฟลเดอร์ pages ที่คุณสร้างไว้
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
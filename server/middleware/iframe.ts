export default defineEventHandler((event) => {
  // Allow iframe embedding for results pages
  if (event.path.startsWith('/results/')) {
    setHeader(event, 'X-Frame-Options', 'ALLOWALL')
    setHeader(event, 'Content-Security-Policy', "frame-ancestors *")
  }
})

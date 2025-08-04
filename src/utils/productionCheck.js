// Production environment check
if (import.meta.env.PROD) {
  // Disable console.log in production
  console.log = () => {};
  console.debug = () => {};
  console.info = () => {};
}

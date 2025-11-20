// SPA Fallback for HTML5 History API
(function() {
  const path = window.location.pathname;
  const validRoutes = ['/', '/login', '/register', '/dashboard'];
  
  // If it's a known route but we get 404, redirect to index.html
  if (validRoutes.includes(path) && !document.querySelector('#root')) {
    window.location.href = '/?redirect=' + encodeURIComponent(path);
  }
})();

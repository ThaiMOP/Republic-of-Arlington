
const clientId = '1369199171793584190';
const redirectUri = 'https://rep-arlington.pages.dev/ARLID/dashboard';
const scope = 'identify';

document.getElementById('login-btn').addEventListener('click', () => {
  const url = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${scope}`;
  window.location.href = url;
});

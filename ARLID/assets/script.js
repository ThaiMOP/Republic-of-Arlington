const clientId = '1369199171793584190';
const redirectUri = 'dashboard.html';
const scope = 'identify';

document.getElementById('login-btn').addEventListener('click', () => {
  const url = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${scope}`;
  window.location.href = url;
});

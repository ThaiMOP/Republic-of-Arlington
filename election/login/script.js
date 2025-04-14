const clientId = '1361187603352784967'; // แทนที่ด้วย Client ID ของคุณ
const redirectUri = 'https://rep-arlington.pages.dev/election/login/callback';
const scope = 'identify';

document.getElementById('login-btn').addEventListener('click', () => {
  const url = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${scope}`;
  window.location.href = url;
});

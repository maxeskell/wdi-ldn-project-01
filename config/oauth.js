const github = {
  loginURL: 'https://github.com/login/oauth/authorize',
  accessTokenURL: 'https://github.com/login/oauth/access_token',
  clientId: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  profileURL: 'https://api.github.com/user',
  scope: 'user:email',
  getLoginURL() {
    return `${this.loginURL}?client_id=${this.clientId}&scope=${this.scope}`;
  }
};

const facebook = {
  loginURL: 'https://www.facebook.com/v2.9/dialog/oauth',
  accessTokenURL: 'https://graph.facebook.com/v2.9/oauth/access_token',
  clientId: process.env.FB_OAUTH_ID_PROPJECT1,
  clientSecret: process.env.FB_OAUTH_SECRET_PROPJECT1,
  redirectURL: 'http://localhost:8000/oauth/facebook',
  scope: 'email',
  getLoginURL() {
    return `${this.loginURL}?client_id=${this.clientId}&redirect_uri=${this.redirectURL}&scope=${this.scope}`;
  }
};

module.exports = {
  facebook,
  github
};

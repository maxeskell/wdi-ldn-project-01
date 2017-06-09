const github = {
  loginUrl: 'http://github.com/login/oauth/authorize',
  accessTokenUrl: 'https://github.com/login/oauth/access_token',
  profileUrl: 'https://api.github.com/user',
  clientId: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  scope: 'user:email',
  getLoginUrl() {
    //query string
    return `${this.loginUrl}?client_id=${this.clientId}&scope=${this.scope}`;
  }
};

console.log(github);

module.exports = {
  github
};

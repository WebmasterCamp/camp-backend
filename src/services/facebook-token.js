import request from 'superagent';

export const getUserInfoFromToken = (token) => {
  const url = `https://graph.facebook.com/me?fields=id,name,email&access_token=${token}`;
  return new Promise((resolve, reject) => {
    request.get(url).end((err, res) => {
      // if (err) reject(err);
      if (err) reject({ code: 500, message: 'Invalid token' });
      else resolve(JSON.parse(res.text));
    });
  });
};

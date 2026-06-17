const https = require('https');
const checkUrl = (url) => {
  https.get(url, (res) => {
    console.log(url, '-> Status:', res.statusCode);
  }).on('error', console.error);
};

checkUrl('https://cdn.simpleicons.org/openai');
checkUrl('https://cdn.simpleicons.org/openai/white');
checkUrl('https://cdn.simpleicons.org/huggingface/ffffff');
checkUrl('https://cdn.simpleicons.org/googlegemini/ffffff');
checkUrl('https://cdn.simpleicons.org/anthropic/ffffff');

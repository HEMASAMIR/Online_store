const https = require('https');
const fs = require('fs');

const pageId = '61580540353298';
const url = `https://graph.facebook.com/${pageId}/picture?type=large`;

console.log('Fetching URL:', url);

const request = https.get(url, (response) => {
  console.log('Status code:', response.statusCode);
  console.log('Headers:', response.headers);

  if (response.statusCode === 302 || response.statusCode === 301) {
    const redirectUrl = response.headers.location;
    console.log('Redirecting to:', redirectUrl);
    
    https.get(redirectUrl, (imgRes) => {
      console.log('Image status code:', imgRes.statusCode);
      if (imgRes.statusCode === 200) {
        const fileStream = fs.createWriteStream('public/logo.jpg');
        imgRes.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          console.log('Downloaded logo to public/logo.jpg successfully!');
        });
      } else {
        console.error('Failed to download image, status code:', imgRes.statusCode);
      }
    });
  } else {
    let data = '';
    response.on('data', (chunk) => { data += chunk; });
    response.on('end', () => {
      console.log('Response body:', data);
    });
  }
});

request.on('error', (err) => {
  console.error('Request error:', err);
});

const https = require('https');

const data = new URLSearchParams();
data.append('name', 'Test Name');
data.append('email', 'test@example.com');
data.append('phone', '0123456789');
data.append('channel', 'zalo');
data.append('timing', 'morning');
data.append('note', 'Test Note');

const urlString = 'https://script.google.com/macros/s/AKfycbyDE5FEBrHvhTmX69K9MRhcQr_Q56GeojQNFmbpktUpmMDloPQyjbFwJ4NMAB7oPMvz/exec';
const url = new URL(urlString);

const options = {
  hostname: url.hostname,
  path: url.pathname + url.search,
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': data.toString().length
  }
};

const req = https.request(options, (res) => {
  if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      console.log('REDIRECT LOCATION: ', res.headers.location);
      
      // Follow the redirect
      https.get(res.headers.location, (res2) => {
          let body2 = '';
          res2.on('data', chunk => body2 += chunk);
          res2.on('end', () => console.log('REDIRECT BODY:', body2));
      });
  } else {
      res.setEncoding('utf8');
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        console.log(`BODY: ${body}`);
      });
  }
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(data.toString());
req.end();

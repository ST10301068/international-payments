const selfsigned = require('selfsigned');
const fs = require('fs');

// Attributes for the certificate
const attrs = [{ name: 'commonName', value: 'localhost' }];

// Generate a self-signed certificate valid for 1 year
const pems = selfsigned.generate(attrs, { days: 365 });

// Make sure the /ssl folder exists
if (!fs.existsSync('./ssl')) {
    fs.mkdirSync('./ssl');
}

// Save key and certificate to /ssl
fs.writeFileSync('./ssl/key.pem', pems.private);
fs.writeFileSync('./ssl/cert.pem', pems.cert);

console.log('✅ SSL certificate and key generated in /ssl folder');

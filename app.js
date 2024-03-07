const express = require('express')
const app = express()
const port = 3000

// const { Client, Location, Poll, List, Buttons, LocalAuth } = require('./index');

const qrcode =require("qrcode-terminal");
var bodyParser = require('body-parser');
const { Client , LocalAuth } = require("whatsapp-web.js");
const client = new Client({
    authStrategy: new LocalAuth(),
    // proxyAuthentication: { username: 'username', password: 'password' },
    puppeteer: { 
        // args: ['--proxy-server=proxy-server-that-requires-authentication.example.com'],
        headless: true
    }
});

client.initialize();

client.on('loading_screen', (percent, message) => {
    console.log('LOADING SCREEN', percent, message);
});

client.on('qr', (qr) => {
    // NOTE: This event will not be fired if a session is specified.
    qrcode.generate(qr, { small: true });
});

client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {
    console.log('READY');
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post('/kirimpesan', async (req, res) => {
let tujuan = req.body.tujuan;
let pesan = req.body.pesan;
console.log(tujuan);
tujuan = tujuan.substring(1);
tujuan = `62${tujuan}@c.us`;

let cekUser = await client.isRegisteredUser(tujuan);
const key = "Bangkinang12";

if(req.body.key == key){
if (cekUser == true){
    client.sendMessage(tujuan, pesan);
    res.json({status:true, pesan : "Notifikasi Whatsapp berhasil dikirim"});

}else{
    res.json({status:false, pesan : "Nomor tujuan tidak terdaftar"});
}

}else{
    res.json({status:false, pesan : "Key tidak valid"});
}




})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
const qr = require('qr-image');

exports = module.exports = {
    qr_code(req, res) {
        let url = req.query.url;
        //待生成二维码的url
        let qr_url = "https://video.chenweidong.top";
        qr_url += url ? '?url=' + url : ''; 
        
        var img = qr.image(qr_url, { size: 10 });
        res.writeHead(200, { 'Content-Type': 'image/png' });
        img.pipe(res);
    },
}
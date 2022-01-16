exports = module.exports = {
    index(req, res) {
        let url = req.query.url;
        res.render('vip/index', {url});
    },
}

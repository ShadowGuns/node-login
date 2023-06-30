const validator = require('validator');

checkUrls = async (req, res, next) => {
    const url = req.body.url;
    try{
        // Kiểm tra xem liên kết có hợp lệ không
        if (!validator.isURL(url)) {
            return res.status(400).json({ error: 'Invalid URL' });
        }
        // Kiểm tra xem liên kết có vượt quá 512 ký tự không
        if (url.length > 512) {
            return res.status(400).json({ error: 'URL is too long' });
        }
        next();
    }
    catch(error){
        return res.status(500).json({ error: error.message });
    }
}

const validate = {
    checkUrls: checkUrls,
};
  
module.exports = validate;
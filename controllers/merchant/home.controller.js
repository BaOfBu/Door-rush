import multer from "multer";
import Profile from "../../services/user/profile.service.js";

const index = function (req, res) {
    res.render("merchant/home", {
        type: "home"
    });
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.cwd() + '/static/images/user/account/');
    },
    filename: function (req, file, cb) {
        const userID = req.session.authUser._id;
        const filename = userID + '.' + file.originalname.split('.').pop();
        req.body.image = "/static/images/user/account/" + filename;
        console.log(filename);
        cb(null, filename);
    }
});
const upload = multer({ storage: storage });

const uploadAvatar = async function(req, res) {
    console.log("Đã vô upload roi ne");
    const userID = req.session.authUser._id;
    console.log("userID: ", userID);
    upload.single('image')(req, res, async function (err) {
        if (err) {
            console.error("error: ", err);
            return res.status(500).json({ error: 'Error during upload.' });
        } else {
            console.log("file name: ", req.body.image);
            const update = await Profile.updateMerchantInfo(userID, { image: req.body.image });
            console.log("Đã up ảnh thành công, ", update);
            //return res.json({ success: true, image: req.body.image });
            req.session.authUser.image = req.body.image;
            return res.redirect("/merchant/home");
        }
    });
}
export default {uploadAvatar, index };

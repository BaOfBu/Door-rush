import MerChant from "../../services/user/search.service.js";

const index = async function (req, res) {
    const merchants = (await MerChant.getListMerchantDiscount()).slice(0, 16);

    let infoMerchants = new Array();


    merchants.forEach(merchant => {
        let link = "/foods/" + merchant._id;
        let image = merchant.image;
        let name = merchant.name;
        let priceRange = merchant.priceRange;
        let rating = merchant.rating;
        infoMerchants.push({link, image, name, priceRange, rating});
    })

    res.render("user/home", {
        user: false,
        type: "home",
        userName: "Họ và tên",
        merchants: infoMerchants
    });
};

export default { index };

const index = async function (req, res) {
    res.render("merchant/chat", {
        type: "chats",
        userId: req.session.authUser._id
    });
};

const chatHistory = async function (req, res) {
    res.render("merchant/chat", {
        type: "chats",
        
    });
}
export default { index, chatHistory };

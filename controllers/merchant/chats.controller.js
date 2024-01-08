const index = async function (req, res) {
    res.render("merchant/chat", {
        type: "chats"
    });
};
export default { index };

const User = require('../Model/user');

module.exports.addUser = async function addUser(req, res) {
    const username = req.body.username;
    try {
        let userD = await User.findOne({username});
        if (userD) {
            return res.status(400).send({
                error: "Username already exists"
            });
        }
        let user = await new User({
            username,
        }).save();
        res.status(201).send(user);
    } catch (err) {
        res.status(500).send({
            error: err.message
        });
    }
}
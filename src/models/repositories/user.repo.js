const userModel = require("../user.model")


const createUser = async ({
    usr_id,
    usr_slug,
    usr_name,
    usr_password,
    usr_role
}) => {
    const user = await userModel.create({
        usr_id,
        usr_slug,
        usr_name,
        usr_password,
        usr_role
    });

    return user;
}

module.exports = {
    createUser
}
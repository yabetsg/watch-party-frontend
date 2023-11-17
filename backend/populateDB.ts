import User from "./src/models/User";
const users = [];


export const createUser = async () => {
    try {
        const user = new User({ name:"James"});
        await user.save();
    } catch (error) {
        console.error(`Error creating user: ${error}`);
    }
};


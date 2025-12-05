import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js"
// ----------- SERVICE: CREATE USER -------------
export const registerUser = async (name, email, password) => {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return { error: "Email already registered" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
        name,
        email,
        password: hashedPassword
    });

    return { user: newUser };
};



export const loginUser = async (email, password) => {
    // 1. Check user exists
    const user = await User.findOne({ email });
    if (!user) {
        return { error: "User not found" };
    }

    // 2. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return { error: "Invalid password" };
    }

    // 3. Generate JWT Token
    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return { token, user };
};

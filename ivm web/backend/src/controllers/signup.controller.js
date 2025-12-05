import * as  userSign  from "../services/signup.service.js";
// ---------------- SIGNUP CONTROLLER ----------------
export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Call service (business logic)
        const result = await userSign.registerUser(name, email, password);

        if (result.error) {
            return res.status(400).json({ message: result.error });
        }

        const user = result.user;

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Call service
        const result = await userSign.loginUser(email, password);

        if (result.error) {
            return res.status(400).json({ message: result.error });
        }

        res.status(200).json({
            message: "Login successful",
            token: result.token,
            user: {
                id: result.user._id,
                name: result.user.name,
                email: result.user.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

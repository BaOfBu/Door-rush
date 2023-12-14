import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ["User", "Merchant", "Admin"],
            required: true
        },
        status: {
            type: String,
            enum: ["active", "ban", "pending"],
            required: true
        }
    },
    { collection: "Account" }
);

// The function before saving data for password hashing.
accountSchema.pre("save", async function (next) {
    try {
        // If the password is changed or a new user is created
        if (this.isModified("password") || this.isNew) {
            const hashedPassword = await bcrypt.hash(this.password, 10);
            this.password = hashedPassword;
        }
        return next();
    } catch (error) {
        return next(error);
    }
});

// Password checker function
accountSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

const Account = mongoose.model("Account", accountSchema, "Account");

export default Account;

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: [true, "Email already taken"]
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minLength: [6, "Password lenght should be greater than 6 character"]

        },
        address: {
            type: String,
            required: [true, "Address is required"]
        },
        city: {
            type: String,
            required: [true, "City name is required"]
        },
        country: {
            type: String,
            required: [true, "Country name is required"]
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"]
        },
        profilePic: {
            public_id: String,
            url: String,
        },
        answer: {
            type: String,
            required: [true, "answer is required"],
        },
        role: {
            type: String,
            default: "user",
        },


    },
    {
        timestamps: true
    });

//functuions
// hash func
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
});

// compare function
userSchema.methods.comparePassword = async function (plainPassword) {
    return await bcrypt.compare(plainPassword, this.password);
};

//JWT TOKEN
userSchema.methods.generateToken = function () {
    return JWT.sign({ _id: this._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

export const Users = mongoose.model('Users', userSchema);

export default Users;

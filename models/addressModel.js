import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    houseNumber: {
        type: String,
        required: true,
    },
    street: {
        type: String,
        required: true,
    },
    ward: {
        type: String,
        required: true,
    },
    district: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
},
    { collection: "Address" }
);

const Address = mongoose.model('Address', addressSchema, "Address");

export default Address;
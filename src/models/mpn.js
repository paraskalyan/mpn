import mongoose, { Schema } from "mongoose";

const MpnSchema = new Schema(
    {
        mpn: String,
        make: String,
        category: String,
        subcategory: String,
        partNumber: Number,
    },
    {
        timestamps: true,
    }
)

const MPN = mongoose.models.MPN || mongoose.model("MPN", MpnSchema)
export default MPN;
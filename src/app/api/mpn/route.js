import { NextResponse } from "next/server";
import connectMongoDB from "../../../libs/mongodb";
import MPN from "../../../models/mpn";

export async function POST(request) {
    connectMongoDB();
    const { mpn, make, category, subcategory, partNumber } = await request.json();
    console.log(mpn, make, category, subcategory, partNumber)
    try {

        await MPN.create({ mpn, make, category, subcategory, partNumber })
        return NextResponse.json({ message: "MPN ADDED" }, { status: 200 })
    }
    catch (err) {
        return NextResponse.json({ message: "error" }, { status: 500 })
    }
}

export async function GET(request) {
    connectMongoDB();
    const { searchParams } = new URL(request.url)
    const mpn = searchParams.get('mpn')
    const make = searchParams.get('make')
    const category = searchParams.get('choosenCategory')
    const subcategory = searchParams.get('choosenSubcategory')

    try {

        if (mpn && make) {
            const doc = await MPN.findOne({ "mpn": mpn, "make": make })
            return NextResponse.json(doc, { status: 200 })
        }

        if (category && subcategory) {
            const doc = await MPN.findOne({ "category": category, "subcategory": subcategory }).sort({ partNumber: -1 })

            return NextResponse.json(doc, { status: 200 })
        }
    }
    catch (err) {
        return NextResponse.json({ message: "error" }, { status: 500 })
    }

    // return NextResponse.json({ mess: "sdf" })
    // const doc = await MPN.findOne({ "mpn": mpn, "make": make })
    // return NextResponse.json(doc)
}

// connectMongoDB();
// await MPN.findOne()
// connectMongoDB();
// await mpn.create({ mpn, make });
// export const sendMpn = async (request) => {
//     connectMongoDB();
//     const { mpn, make } = await request.json();
//     await mpn.create({ mpn, make });
// }

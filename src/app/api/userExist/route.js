import { NextResponse } from "next/server";
import connectMongoDB from "../../../libs/mongodb";
import User from "../../../models/user";
import bcrypt from 'bcrypt'
import { cookies } from 'next/headers'

export async function POST(req) {
    connectMongoDB();
    const { username, password } = await req.json();

    const res = await User.findOne({ username: username })
    console.log(res)


    if (res) {
        const match = await bcrypt.compare(password, res.password);
        if (match) {
            cookies().set('name', res.name, { secure: true })
            return NextResponse.json({ message: "user exist" }, { status: 200 })
        }
        else
            return NextResponse.json({ message: "wrong password" }, { status: 404 })
    }

}
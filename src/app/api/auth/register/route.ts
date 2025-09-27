import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { fullName, email, password } = await request.json();

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists.' },
        { status: 409 } // 409 Conflict
      );
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // 3. Create a new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json(
      { message: 'User registered successfully!' },
      { status: 201 } // 201 Created
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: 'An error occurred.', error: error.message },
      { status: 500 } // 500 Internal Server Error
    );
  }
}
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email, password } = await request.json();

    // 1. Basic validation: Check if email and password are provided
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required.' },
        { status: 400 } // Bad Request
      );
    }

    // 2. Find the user by email in the database
    const user = await User.findOne({ email });

    // 3. If user does not exist, return an error
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials. User not found.' },
        { status: 401 } // Unauthorized
      );
    }

    // 4. Compare the provided password with the hashed password in the database
    // bcrypt.compare is a secure function that handles the hashing and comparison
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    // 5. If passwords do not match, return an error
    if (!isPasswordMatch) {
      return NextResponse.json(
        { message: 'Invalid credentials. Incorrect password.' },
        { status: 401 } // Unauthorized
      );
    }

    // 6. If everything is correct, login is successful
    // In a real app, you would generate and return a JWT (JSON Web Token) here
    return NextResponse.json(
      { message: 'Login successful!' },
      { status: 200 } // OK
    );

  } catch (error: any) {
    return NextResponse.json(
      { message: 'An error occurred during login.', error: error.message },
      { status: 500 } // Internal Server Error
    );
  }
}
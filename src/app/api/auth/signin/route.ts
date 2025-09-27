import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/jwt';
import { recordUserAction } from '@/lib/metrics';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email, password } = await request.json();

    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      recordUserAction('signin', 'failure');
      return NextResponse.json(
        { message: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // 2. Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      recordUserAction('signin', 'failure');
      return NextResponse.json(
        { message: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // 3. Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
    });

    // Record successful signin
    recordUserAction('signin', 'success');

    return NextResponse.json(
      { 
        message: 'Sign in successful!',
        token,
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
        }
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: 'An error occurred.', error: error.message },
      { status: 500 }
    );
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
//import clientPromise from '../../../lib/mongodb';

export async function GET() {
    try {
      //const client = await clientPromise;
   //   const db = client.db('workout-plan'); // Replace 'test' with your database name
     // const collections = await db.listCollections().toArray();
  
  //    return NextResponse.json({ collections });
    } catch (error: any) {
      console.error('Error connecting to MongoDB:', error);
      return NextResponse.json(
        { error: error.message || 'An error occurred while fetching collections' },
        { status: 500 }
      );
    }
  }
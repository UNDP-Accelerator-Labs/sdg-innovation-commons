import { NextRequest, NextResponse } from 'next/server';
import { getApiAuth } from '@/app/lib/helpers/api-auth';
import { query as dbQuery } from '@/app/lib/db';

export async function POST(request: NextRequest) {
  try {
    const authResult = await getApiAuth(request);
    
    if (!authResult.isAuthenticated || !authResult.uuid) {
      return NextResponse.json(
        { status: 400, message: 'You need to be logged in to engage with content.' },
        { status: 400 }
      );
    }

    const { uuid } = authResult;
    const body = await request.json();
    const { object, id, type, message, action } = body;

    // Validate required fields
    if (!object || !id || !type || !action) {
      return NextResponse.json(
        { status: 400, message: 'Missing required fields: object, id, type, and action are required.' },
        { status: 400 }
      );
    }

    // Validate action type
    if (!['insert', 'delete'].includes(action)) {
      return NextResponse.json(
        { status: 400, message: 'Invalid action. Must be either "insert" or "delete".' },
        { status: 400 }
      );
    }

    try {
      let result;

      if (action === 'insert') {
        // Insert engagement
        result = await dbQuery(
          'general',
          `INSERT INTO engagement (contributor, doctype, docid, type, message) 
           VALUES ($1, $2, $3::INT, $4, $5)
           RETURNING TRUE AS bool`,
          [uuid, object, id, type, message || null]
        );
      } else if (action === 'delete') {
        // Delete engagement
        result = await dbQuery(
          'general',
          `DELETE FROM engagement
           WHERE contributor = $1
             AND doctype = $2
             AND docid = $3
             AND type = $4
           RETURNING NULL AS bool`,
          [uuid, object, id, type]
        );
      }

      if (result?.rows && result.rows.length > 0) {
        return NextResponse.json({ 
          status: 200, 
          active: result.rows[0].bool 
        });
      }

      return NextResponse.json({ 
        status: 200, 
        active: action === 'insert' 
      });

    } catch (err) {
      console.error('Error processing engagement:', err);
      return NextResponse.json(
        { status: 500, message: 'An unexpected error occurred.' },
        { status: 500 }
      );
    }

  } catch (err) {
    console.error('Error in engagement endpoint:', err);
    return NextResponse.json(
      { status: 500, message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}

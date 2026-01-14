import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/lib/session';
import db from '@/app/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const { uuid, rights } = session || {};

    const body = await request.json();
    const { user_uuid, password, anonymize = true, schedule_date } = body;

    // Authorization check: user can only delete their own account unless admin
    if (!uuid || (user_uuid !== uuid && (!rights || rights <= 2))) {
      return NextResponse.json(
        { status: 401, message: 'Unauthorized action.' },
        { status: 401 }
      );
    }

    // Validate password
    const userQuery = `SELECT password FROM users WHERE uuid = $1`;
    const userResult = await db.query('general', userQuery, [user_uuid]);

    if (!userResult || userResult.rowCount === 0) {
      return NextResponse.json(
        { status: 404, message: 'User not found.' },
        { status: 404 }
      );
    }

    const hashedPassword = userResult.rows[0].password;
    const passwordMatch = await bcrypt.compare(password, hashedPassword);

    if (!passwordMatch) {
      return NextResponse.json(
        { status: 400, message: 'Incorrect password. Please try again.' },
        { status: 400 }
      );
    }

    const now = new Date();
    const deletion_date = schedule_date ? new Date(schedule_date) : now;

    // Placeholder data for anonymization
    const placeholderName = 'Anonymous User';
    const placeholderEmail = 'deleted.' + new Date().valueOf() + '@deleted.com';

    // Perform deletion/anonymization
    const client = await db.getClient('general');
    try {
      await client.query('BEGIN');

      if (anonymize) {
        // Anonymize user data
        await client.query(
          `UPDATE users
           SET name = $1,
               email = $2,
               position = NULL,
               iso3 = NULL,
               password = '',
               language = NULL,
               secondary_languages = NULL,
               last_login = NULL,
               rights = 0,
               left_at = $3
           WHERE uuid = $4`,
          [placeholderName, placeholderEmail, deletion_date, user_uuid]
        );
      } else {
        // Just revoke access
        await client.query(
          `UPDATE users
           SET rights = 0,
               left_at = $1
           WHERE uuid = $2`,
          [deletion_date, user_uuid]
        );
      }

      // Delete trusted devices
      await client.query(
        `DELETE FROM trusted_devices WHERE user_uuid = $1`,
        [user_uuid]
      );

      // Delete session records
      await client.query(
        `DELETE FROM session WHERE sess->>'uuid' = $1`,
        [user_uuid]
      );

      await client.query('COMMIT');

      return NextResponse.json({
        status: 200,
        message: anonymize
          ? 'User account has been anonymized successfully.'
          : 'User account has been deactivated successfully.',
      });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error during user deletion/anonymization:', error);
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error in delete contributor endpoint:', error);
    return NextResponse.json(
      {
        status: 500,
        message: 'An error occurred while processing the request.',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

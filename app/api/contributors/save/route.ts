import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSession } from '@/app/lib/session';
import db from '@/app/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendEmail } from '@/app/lib/helpers';
import { isPasswordSecure } from '@/app/lib/helpers/utils';

const LOCAL_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function POST(request: NextRequest) {
  const { APP_SECRET, NODE_ENV } = process.env;
  
  if (!APP_SECRET) {
    return NextResponse.json(
      { status: 500, message: 'Server configuration error: APP_SECRET not configured' },
      { status: 500 }
    );
  }

  try {
    const session = await getSession();
    const { uuid: session_uuid, rights: session_rights, name: username, is_trusted, email: initiatorEmail } = session || {};

    const body = await request.json();
    let { id, fromBaseHost, new_name, new_email, new_position, new_password, iso3, language, rights, reviewer, secondary_languages } = body;

    fromBaseHost = fromBaseHost === 'true' || fromBaseHost === true;

    if (secondary_languages && !Array.isArray(secondary_languages)) {
      secondary_languages = [secondary_languages];
    }

    // Validate password if provided
    if (id && new_password?.length) {
      const passwordErrors = isPasswordSecure(new_password);
      if (passwordErrors.length > 0) {
        return NextResponse.json(
          { status: 400, message: passwordErrors.join('\n') },
          { status: 400 }
        );
      }
    }

    // CREATE NEW USER (REGISTRATION)
    if (!id) {
      // Generate random password if not provided
      const password = new_password ?? (Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10));
      
      if (fromBaseHost) {
        rights = 1;
        language = 'en';
      }

      const client = await db.getClient('general');
      try {
        await client.query('BEGIN');

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const userResult = await client.query(
          `INSERT INTO users (name, email, position, password, iso3, language, secondary_languages, rights, notifications, reviewer)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           RETURNING uuid`,
          [
            new_name,
            new_email,
            new_position,
            hashedPassword,
            iso3,
            language,
            JSON.stringify(secondary_languages || []),
            rights,
            true, // notifications
            reviewer || false
          ]
        );

        const newUserId = userResult.rows[0].uuid;

        // If not from base host, create cohort relationship
        if (!fromBaseHost && session_uuid) {
          await client.query(
            `INSERT INTO cohorts (contributor, host) VALUES ($1, $2)`,
            [newUserId, session_uuid]
          );
        }

        await client.query('COMMIT');

        // Send welcome email
        if (fromBaseHost) {
          const emailSubject = 'Welcome to SDG Commons!';
          const emailHtml = `
            <p>Hello ${new_name}!</p>
            <p>Welcome to the SDG Commons platform. We are excited to have you join our community.</p>
            <p>You can now log in using your email and the password you set during registration.</p>
            <p>Best regards,<br/>SDG Commons Team</p>
          `;
          await sendEmail(new_email, undefined, emailSubject, emailHtml);

          return NextResponse.json({
            status: 200,
            message: 'Account created successfully. Please proceed to login with your email and password.',
            data: { uuid: newUserId }
          });
        }

        return NextResponse.json({
          status: 200,
          message: 'User created successfully.',
          data: { uuid: newUserId }
        });

      } catch (error) {
        await client.query('ROLLBACK');
        
        if (error instanceof Error && error.message.includes('duplicate key')) {
          return NextResponse.json(
            {
              status: 400,
              message: 'It seems the email you want to use is already associated with an account. Please use a different email.'
            },
            { status: 400 }
          );
        }
        
        throw error;
      } finally {
        client.release();
      }
    }

    // UPDATE EXISTING USER
    const client = await db.getClient('general');
    try {
      await client.query('BEGIN');

      // Check if user has permission to update
      const cohortResult = await client.query(
        `SELECT c.host FROM cohorts c WHERE c.contributor = $1`,
        [id]
      );

      const canUpdate = id === session_uuid || 
                       cohortResult.rows.some((d: any) => d.host === session_uuid) || 
                       (session_rights && session_rights > 2);

      if (!canUpdate) {
        await client.query('ROLLBACK');
        return NextResponse.json(
          { status: 403, message: 'Unauthorized to update this user.' },
          { status: 403 }
        );
      }

      // Get current user data
      const currentUser = await client.query(
        `SELECT email, name FROM users WHERE uuid = $1`,
        [id]
      );

      if (currentUser.rowCount === 0) {
        await client.query('ROLLBACK');
        return NextResponse.json(
          { status: 404, message: 'User not found.' },
          { status: 404 }
        );
      }

      const user = currentUser.rows[0];
      const emailChanged = user.email !== new_email;
      const passwordChanged = new_password && new_password.trim().length > 0;
      const nameChanged = user.name !== new_name;
      let logoutAll = false;

      // Check if sensitive changes require trusted device
      if ((emailChanged || passwordChanged || nameChanged)) {
        if (!is_trusted && !fromBaseHost) {
          await client.query('ROLLBACK');
          return NextResponse.json(
            {
              status: 403,
              message: 'This action can only be authorized on trusted devices. Please log in from a trusted device.'
            },
            { status: 403 }
          );
        }
        logoutAll = true;
      }

      // Handle email change with confirmation
      if (emailChanged) {
        // Generate email confirmation token
        const token = jwt.sign(
          { email: new_email, uuid: id, name: new_name, old_email: user.email, action: 'confirm-email' },
          APP_SECRET as string,
          { expiresIn: '1h' }
        );

        const confirmationLink = NODE_ENV === 'production'
          ? `https://sdg-innovation-commons.org/confirm-email/${token}`
          : `${LOCAL_BASE_URL}/confirm-email/${token}`;

        const emailSubject = 'Email Address Confirmation - SDG Commons';
        const emailHtml = `
          <div>
            <p>Dear ${new_name},</p>
            <br/>
            <p>We have noticed that you recently attempted to change your email address on the SDG Commons platform.</p>
            <p>To confirm your new email address, please click on the link below:</p>
            <a href="${confirmationLink}">${confirmationLink}</a>
            <br/>
            <p>This link expires in 1 hour. If you did not initiate this change, please ignore this email or contact our support team.</p>
            <br/>
            <p>Best regards,</p>
            <p>SDG Commons Team</p>
          </div>
        `;

        await sendEmail(new_email, undefined, emailSubject, emailHtml);

        await client.query('COMMIT');

        // Don't update email yet, wait for confirmation
        return NextResponse.json({
          status: 200,
          message: 'An email has been sent to your new email address. Please confirm the email to complete the update.',
          requiresConfirmation: true
        });
      }

      // Build update query
      let updateParts: string[] = [];
      let updateValues: any[] = [];
      let paramIndex = 1;

      updateParts.push(`name = $${paramIndex++}`);
      updateValues.push(new_name);

      if (new_position !== undefined) {
        updateParts.push(`position = $${paramIndex++}`);
        updateValues.push(new_position);
      }

      if (passwordChanged && (id === session_uuid || (session_rights && session_rights > 2))) {
        const hashedPassword = await bcrypt.hash(new_password, 10);
        updateParts.push(`password = $${paramIndex++}`);
        updateValues.push(hashedPassword);
      }

      if (iso3 !== undefined) {
        updateParts.push(`iso3 = $${paramIndex++}`);
        updateValues.push(iso3);
      }

      if (language !== undefined) {
        updateParts.push(`language = $${paramIndex++}`);
        updateValues.push(language);
      }

      if (secondary_languages !== undefined) {
        updateParts.push(`secondary_languages = $${paramIndex++}`);
        updateValues.push(JSON.stringify(secondary_languages));
      }

      if (rights !== undefined && (cohortResult.rows.some((d: any) => d.host === session_uuid) || (session_rights && session_rights > 2))) {
        updateParts.push(`rights = $${paramIndex++}`);
        updateValues.push(rights);
      }

      updateParts.push(`notifications = $${paramIndex++}`);
      updateValues.push(true);

      if (reviewer !== undefined) {
        updateParts.push(`reviewer = $${paramIndex++}`);
        updateValues.push(reviewer);
      }

      updateValues.push(id);

      // Execute update
      await client.query(
        `UPDATE users SET ${updateParts.join(', ')} WHERE uuid = $${paramIndex}`,
        updateValues
      );

      // Handle session logout if needed
      if (logoutAll) {
        await client.query(
          `DELETE FROM session WHERE sess->>'uuid' = $1`,
          [id]
        );
      }

      await client.query('COMMIT');

      // Send notification email if updated by someone else
      if (id !== session_uuid && username) {
        const emailSubject = '[SDG Commons] Your account information has been modified';
        const emailHtml = `Your account information has been modified by ${username} via the SDG Commons platform.`;
        await sendEmail(new_email || user.email, undefined, emailSubject, emailHtml);
      }

      // Force logout if password or email changed
      if (logoutAll) {
        // Delete all sessions for this user from the database
        await client.query(
          `DELETE FROM session WHERE sess::jsonb->>'user_uuid' = $1`,
          [id]
        );

        const cookieStore = await cookies();
        
        // Delete all possible NextAuth cookie variants
        const cookieNames = [
          'next-auth.session-token',
          '__Secure-next-auth.session-token',
          'authjs.session-token',
          '__Secure-authjs.session-token',
        ];
        
        for (const name of cookieNames) {
          cookieStore.delete(name);
        }
      }

      return NextResponse.json({
        status: 200,
        message: logoutAll ? 'Account updated successfully. Please log in again with your new credentials.' : 'Account updated successfully.',
        data: { uuid: id },
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error in save contributor endpoint:', error);
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

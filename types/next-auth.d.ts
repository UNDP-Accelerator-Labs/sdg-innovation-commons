import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      uuid: string;
      rights: number;
      iso3: string;
      language?: string;
      bureau?: string;
      collaborators?: any[];
      pinboards?: any[];
      is_trusted?: boolean;
      sessionId?: string;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    uuid: string;
    rights: number;
    iso3: string;
    language?: string;
    bureau?: string;
    collaborators?: any[];
    pinboards?: any[];
    is_trusted?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    uuid: string;
    rights: number;
    iso3: string;
    language?: string;
    bureau?: string;
    collaborators?: any[];
    pinboards?: any[];
    is_trusted?: boolean;
    sessionId?: string;
  }
}

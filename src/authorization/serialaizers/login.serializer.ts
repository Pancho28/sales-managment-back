export class LoginSerializer {

    userId: string;

    email: string;

    role: string;

    status: string;

    accessToken: string;

    constructor(partial: Partial<LoginSerializer>) {
      Object.assign(this, partial);
    }
}
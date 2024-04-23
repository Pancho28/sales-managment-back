export class LoginSerializer {

    id: string;

    username: string;

    role: string;

    status: string;

    accessToken: string;

    constructor(partial: Partial<LoginSerializer>) {
      Object.assign(this, partial);
    }
}
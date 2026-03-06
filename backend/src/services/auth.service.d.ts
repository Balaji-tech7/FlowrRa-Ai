export default class AuthService {
    static register(email: string, password: string): Promise<{
        id: any;
        email: any;
    }>;
    static login(email: string, password: string): Promise<string>;
    static getUserById(id: string): Promise<any>;
}
//# sourceMappingURL=auth.service.d.ts.map
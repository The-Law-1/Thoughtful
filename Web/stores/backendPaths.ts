function safeJsonParse(str: string) {
    try {
      return JSON.parse(str);
    } catch (err) {
      return null;
    }
}

export default class BackendPath {
    // either you make a proxy or not, if you don't, this will read from environment variable
    static readonly BASE_URL: string = "/api";
  
    // public static Admin = class {
    //   static readonly PATH: string = `${BackendPath.BASE_URL}/admin`;
  
    //   public static async GetUsers(token: string): Promise<User[]> {
    //     const path = `${this.PATH}/user`;
  
    //     const res = await fetch(path, {
    //       method: "GET",
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     });
    //     if (!res.ok) {
    //       const data = await res.text();
    //       return Promise.reject({
    //         name: `${res.status}`,
    //         message: data ? safeJsonParse(data) ?? data : null,
    //       } as Error);
    //     }
    //     return await res.json();
    //   }
  
    //   public static async GetUser(userId: string, token: string): Promise<User> {
    //     const path = `${this.PATH}/user/${encodeURIComponent(userId)}`;
  
    //     const res = await fetch(path, {
    //       method: "GET",
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     });
    //     if (!res.ok) {
    //       const data = await res.text();
    //       return Promise.reject({
    //         name: `${res.status}`,
    //         message: data ? safeJsonParse(data) ?? data : null,
    //       } as Error);
    //     }
    //     return await res.json();
    //   }
  
    //   public static async DeleteUser(
    //     userId: string,
    //     token: string
    //   ): Promise<void> {
    //     const path = `${this.PATH}/user/${encodeURIComponent(userId)}`;
  
    //     const res = await fetch(path, {
    //       method: "DELETE",
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     });
    //     if (!res.ok) {
    //       const data = await res.text();
    //       return Promise.reject({
    //         name: `${res.status}`,
    //         message: data ? safeJsonParse(data) ?? data : null,
    //       } as Error);
    //     }
    //     return Promise.resolve();
    //   }
    // };

}
    
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

    public static Auth = class {
        static readonly PATH: string = `${BackendPath.BASE_URL}/auth`;

        // you could make a type for the access_token object
        public static async Login(password: string): Promise<any> {
            const path = `${this.PATH}/login`;

            const res = await fetch(path, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password }),
            });
            if (!res.ok) {
                const data = await res.text();
                return Promise.reject({
                    name: `${res.status}`,
                    message: data ? safeJsonParse(data) ?? data : null,
                } as Error);
            }
            return await res.text();
        }
    }

    public static Notes = class {
        static readonly PATH: string = `${BackendPath.BASE_URL}/notes`;

        public static async CreateNote(token: string, newNote: note): Promise<note> {
            const path = `${this.PATH}`;

            const res = await fetch(path, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title: newNote.title, thoughts: newNote.thoughts}),
            });
            if (!res.ok) {
                const data = await res.text();
                return Promise.reject({
                    name: `${res.status}`,
                    message: data ? safeJsonParse(data) ?? data : null,
                } as Error);
            }
            return await res.json();
        }

        public static async GetNotes(token: string): Promise<note[]> {
            const path = `${this.PATH}`;

            const res = await fetch(path, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) {
                const data = await res.text();
                return Promise.reject({
                    name: `${res.status}`,
                    message: data ? safeJsonParse(data) ?? data : null,
                } as Error);
            }
            return await res.json();
        }

        public static async GetNoteById(token: string, noteId: string): Promise<note> {
            const path = `${this.PATH}/${noteId}`;

            const res = await fetch(path, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) {
                const data = await res.text();
                return Promise.reject({
                    name: `${res.status}`,
                    message: data ? safeJsonParse(data) ?? data : null,
                } as Error);
            }
            return await res.json();
        }

        public static async GetNotesByTitle(token: string, title: string): Promise<note[]> {
            const path = `${this.PATH}/filter/${title}`;

            const res = await fetch(path, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) {
                const data = await res.text();
                return Promise.reject({
                    name: `${res.status}`,
                    message: data ? safeJsonParse(data) ?? data : null,
                } as Error);
            }
            return await res.json();
        }

        // delete
        public static async DeleteNoteById(token: string, noteId: string): Promise<note> {
            const path = `${this.PATH}/${noteId}`;

            const res = await fetch(path, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) {
                const data = await res.text();
                return Promise.reject({
                    name: `${res.status}`,
                    message: data ? safeJsonParse(data) ?? data : null,
                } as Error);
            }
            return await res.json();
        }

        // update
        public static async UpdateNoteById(token: string, noteId: string, updatedNote: note): Promise<note> {
            const path = `${this.PATH}/${noteId}`;

            const res = await fetch(path, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title: updatedNote.title, thoughts: updatedNote.thoughts}),
            });

            if (!res.ok) {
                const data = await res.text();
                return Promise.reject({
                    name: `${res.status}`,
                    message: data ? safeJsonParse(data) ?? data : null,
                } as Error);
            }
            return await res.json();
        }

        // rename
        public static async RenameNoteById(token: string, noteId: string, newTitle: string): Promise<note> {
            const path = `${this.PATH}/rename/${noteId}/${newTitle}`;

            const res = await fetch(path, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const data = await res.text();
                return Promise.reject({
                    name: `${res.status}`,
                    message: data ? safeJsonParse(data) ?? data : null,
                } as Error);
            }
            return await res.json();
        }
    }
  
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
    
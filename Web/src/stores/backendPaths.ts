import { note } from "@/types/note";
import { thought } from "@/types/thought";

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

    public static HelloWorld = class {
        static readonly PATH: string = `${BackendPath.BASE_URL}`;

        public static async GetHelloWorld(): Promise<string> {
            const path = `${this.PATH}`;

            const res = await fetch(path, {
                method: "GET",
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

    public static Auth = class {
        static readonly PATH: string = `${BackendPath.BASE_URL}/auth`;

        public static async VerifyToken(token: string): Promise<boolean> {
            const path = `${this.PATH}/verify`;

            const res = await fetch(path, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            // * apparently, unauthorized constitutes an "ok" response. lol
            if (!res.ok || res.status === 401) {
                const data = await res.text();
                return Promise.reject({
                    name: `${res.status}`,
                    message: data ? safeJsonParse(data) ?? data : null,
                } as Error);
            }
            if (res.status === 200)
                return true;
            return false;
        }

        // you could make a type for the access_token object
        public static async Login(password: string): Promise<any> {
            const path = `${this.PATH}/login`;

            const res = await fetch(path, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password }),
            })
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
            return res.json();
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

    public static Thoughts = class {
        static readonly PATH: string = `${BackendPath.BASE_URL}/thoughts`;

        // either adds a thought to a note or creates a new note with the thought
        public static async CreateThoughtOnNote(token: string, newThought: thought, noteTitle: string) {
            const path = `${this.PATH}/note/${noteTitle}`;

            const res = await fetch(path, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ content: newThought.content, noteId: newThought.noteId }),
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

        public static async CreateThought(token: string, newThought: thought): Promise<thought> {
            const path = `${this.PATH}`;

            const res = await fetch(path, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ content: newThought.content, noteId: newThought.noteId }),
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

        public static async GetThoughts(token: string): Promise<thought[]> {
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

        public static async GetThoughtById(token: string, thoughtId: string): Promise<thought> {
            const path = `${this.PATH}/${thoughtId}`;

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

        public static async GetThoughtsByContent(token: string, content: string): Promise<thought[]> {
            const path = `${this.PATH}/filter/${content}`;

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

        public static async DeleteThoughtById(token: string, thoughtId: string): Promise<thought> {
            const path = `${this.PATH}/${thoughtId}`;

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
    }

}
    
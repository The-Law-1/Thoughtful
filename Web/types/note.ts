interface note {
    id: string;
    name: string;
    content: thought[]; // * definitely should store references to thoughts
    emoji: string;
}
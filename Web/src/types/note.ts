import { thought } from './thought';

export interface note {
    id: string;
    title: string;
    thoughts: thought[]; // * definitely should store references to thoughts
}
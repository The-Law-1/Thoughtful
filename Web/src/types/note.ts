import { thought } from './thought';

export interface note {
    _id: string;
    title: string;
    thoughts: thought[]; // * definitely should store references to thoughts
}
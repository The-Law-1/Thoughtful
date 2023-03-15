import { Injectable } from "@nestjs/common";
import { getFirestore } from "firebase-admin/firestore";

@Injectable()
export class MyFireStoreService {

    db = getFirestore();
}

import { collection, query, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { AppUser, Conversation } from "../interface";
import { auth, db } from "../config/firebase";
import { getRecipientEmail } from "../utils/getRecipient";


export const useRecipient = (conversationUsers: Conversation['users']) => {
    const [loggedInUser, _loading, _error] = useAuthState(auth)

    // get recipient email
    const recipientEmail = getRecipientEmail(conversationUsers, loggedInUser)

    // get recipient avata
    const queryRecipient = query(collection(db, "users"), where("email", "==", recipientEmail))
    const [recipientsSnapshot, __loadind, __error] = useCollection(queryRecipient)

    // recipientsSnapshot?.docs could be an emty array, leading to docs[0] being undefind
    // so we have force "?" after docs[0] becasue there is no data() on undefind
    const recipient = recipientsSnapshot?.docs[0]?.data() as AppUser | undefined
    return {
        recipient,
        recipientEmail
    }
}
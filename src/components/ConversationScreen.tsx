import React, { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import styled from 'styled-components'
import { auth, db } from '../config/firebase'
import { useRecipient } from '../hooks/useRecipent'
import { convertFirestoreTimeStamToString, generateQueryGetMessage, transformMessage } from '../utils/generateQueryGetMessage'
import { Props } from './ConversationDetail'
import RecipientAvata from './RecipientAvata'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import IconButton from '@mui/material/IconButton'
import { useCollection } from 'react-firebase-hooks/firestore'
import Message from './Message'
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon'
import SendIcon from '@mui/icons-material/Send'
import MicIcon from '@mui/icons-material/Mic'
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore'

const EndOfMessagesForAutoScroll = styled.div`
    margin-bottom: 30px;
`

const StyledRecipientHeader = styled.div`
	position: sticky;
	background-color: white;
	z-index: 100;
	top: 0;
	display: flex;
	align-items: center;
	padding: 11px;
	height: 80px;
	border-bottom: 1px solid whitesmoke;
`
const StyledHeaderInfo = styled.div`
	flex-grow: 1;
	> h3 {
		margin-top: 0;
		margin-bottom: 3px;
	}
	> span {
		font-size: 14px;
		color: gray;
	}
`
const StyledH3 = styled.h3`
	word-break: break-all;
`
const StyledHeaderIcons = styled.div`
	display: flex;
`
const StyledMessageContainer = styled.div`
	padding: 30px;
	background-color: #e5ded8;
	min-height: 90vh;
`
const StyledInputContainer = styled.form`
	display: flex;
	align-items: center;
	padding: 10px;
	position: sticky;
	bottom: 0;
	background-color: white;
	z-index: 100;
`

const StyledInput = styled.input`
	flex-grow: 1;
	outline: none;
	border: none;
	border-radius: 10px;
	background-color: whitesmoke;
	padding: 15px;
	margin-left: 15px;
	margin-right: 15px;
    word-break: break-all;
`

interface ConversationScreenProps extends Props {
    conversationId: string
}
const ConversationScreen = ({ conversation, messages, conversationId }: ConversationScreenProps) => {
    const [loggedInUser, _loading, _error] = useAuthState(auth)
    const [newMessage, setnewMessage] = useState<string>("")
    const conversationUsers = conversation.users
    const { recipient, recipientEmail } = useRecipient(conversationUsers)

    const queryMessages = generateQueryGetMessage(conversationId)
    const [messagesSnapShot, messagesLoading, __error] = useCollection(queryMessages)

    const showMessages = () => {
        // If front-end is loading messages behind the scenes, display messages from firebase
        if(messagesLoading) {
            return messages.map((message) => <Message key={message.id} message={message} />)
        }

        // If front-end has finished loading messages, so now we have messagesSnapshot
        if(messagesSnapShot) {
            return messagesSnapShot.docs.map((message) => <Message key={message.id} message={transformMessage(message)} />)
        }

        return null
    }

    const addMessageToDbAndUpdateLastSeen = async () => {
        // Update last seen in "users" collection
        await setDoc(doc(db, "users", loggedInUser?.email as string),
            { lastSeen: serverTimestamp() },
            { merge: true }
        )

        // add message to "messages" collection
        await addDoc(collection(db, "messages"), {
            conversation_id: conversationId,
            sent_at: serverTimestamp(),
            text: newMessage,
            user: loggedInUser?.email
        })

        // reset input field
        setnewMessage("")

        // scroll to bottom
        scrollToBottom()
    }

    const sendMessageOnEnter: React.KeyboardEventHandler<HTMLInputElement> = event => {
        if(event.key === "Enter") {
            event.preventDefault();
            if(!newMessage) return 
            addMessageToDbAndUpdateLastSeen()
        }
    }
    const sendMessageOnClick: React.MouseEventHandler<HTMLButtonElement> = event => {
        event.preventDefault();
        if(!newMessage) return 
        addMessageToDbAndUpdateLastSeen()
    }
    const endOfMessageRef = React.useRef<HTMLDivElement>(null)
    const scrollToBottom = () => {
        endOfMessageRef.current?.scrollIntoView({behavior: "smooth"})
    }
    return <>
        <StyledRecipientHeader>
            <RecipientAvata recipient={recipient} recipientEmail={recipientEmail} />
            <StyledHeaderInfo>
                <StyledH3>
                    {recipientEmail}
                </StyledH3>
                {recipient && <span>Last active: {convertFirestoreTimeStamToString(recipient.lastSeen)}</span>}
            </StyledHeaderInfo>
            <StyledHeaderIcons>
                <IconButton>
                    <AttachFileIcon />
                </IconButton>
                <IconButton>
                    <MoreVertIcon />
                </IconButton>
            </StyledHeaderIcons>
        </StyledRecipientHeader>
        <StyledMessageContainer>
            {showMessages()}

            {/* For auto scroll to the end when a new message is sent */}
            <EndOfMessagesForAutoScroll ref={endOfMessageRef} />
        </StyledMessageContainer>

        <StyledInputContainer>
            <InsertEmoticonIcon />
            <StyledInput
                value={newMessage}
                onChange={e => setnewMessage(e.target.value)}
                onKeyDown={sendMessageOnEnter}
            />
            <IconButton onClick={sendMessageOnClick}>
                <SendIcon />
            </IconButton>
            <IconButton>
                <MicIcon />
            </IconButton>
        </StyledInputContainer>
    </>
}

export default ConversationScreen
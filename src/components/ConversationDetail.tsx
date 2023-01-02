import { doc, getDoc, getDocs } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { auth, db } from '../config/firebase'
import { Conversation, IMessage } from '../interface'
import { generateQueryGetMessage, transformMessage } from '../utils/generateQueryGetMessage'
import { getRecipientEmail } from '../utils/getRecipient'
import ConversationScreen from './ConversationScreen'
import Sidebar from './Sidebar'

const StyledContainer = styled.div`
    display:flex;
`
const StyledConversationContainer = styled.div`
	flex-grow: 1;
	overflow: scroll;
	height: 100vh;
	/* Hide scrollbar for Chrome, Safari and Opera */
	::-webkit-scrollbar {
		display: none;
	}
	/* Hide scrollbar for IE, Edge and Firefox */
	-ms-overflow-style: none; /* IE and Edge */
	scrollbar-width: none; /* Firefox */
`

export interface Props {
  conversation: Conversation,
  messages: IMessage[]
}

const ConversationDetail = ({ }) => {
  const [loggedInUser, _loading, _error] = useAuthState(auth)
  const [conversations, setconversations] = useState<Props>({
    conversation: { users: [""] },
    messages: [{
      conversation_id: "",
      text: "",
      sent_at: "",
      user: ""
    }]
  })
  const { conversationId } = useParams()

  useEffect(() => {
    const getServerSideProps = async () => {
      // get conversation, to know who we are chatting with
      const conversationRef = doc(db, "conversations", conversationId as string)
      const conversationSnapshot = await getDoc(conversationRef)

      // get all message between logged in user and recipient in this conversation
      const queryMessages = generateQueryGetMessage(conversationId)
      const messagesSnapshot = await getDocs(queryMessages)

      const messages = messagesSnapshot.docs.map(messageDoc => transformMessage(messageDoc))

      if (conversationSnapshot && messages) {
        setconversations({
          ...conversations,
          conversation: conversationSnapshot.data() as Conversation,
          messages: messages as IMessage[]
        })
      }
    }
    getServerSideProps()
  }, [conversationId])

  return (
    <StyledContainer>
      <head>
        <title>Conversation with {getRecipientEmail(conversations.conversation.users, loggedInUser)} </title>
      </head>

      <Sidebar />
      <StyledConversationContainer>
        <ConversationScreen 
          conversation={conversations.conversation} 
          messages={conversations.messages}
          conversationId={conversationId as string}
        />
      </StyledConversationContainer>
    </StyledContainer>
  )
}

export default ConversationDetail

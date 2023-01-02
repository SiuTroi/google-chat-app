import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useRecipient } from '../hooks/useRecipent'
import { Conversation } from '../interface'
import RecipientAvata from './RecipientAvata'

const StyledContainer = styled.div`
    width: 100%;
	display: flex;
	align-items: center;
	cursor: pointer;
	padding: 15px;
	word-break: break-all;

	:hover {
		background-color: #e9eaeb;
	}
`

const ConversationSelect = ({ id, conversationUsers }: { id: string, conversationUsers: Conversation["users"] }) => {
    const { recipient, recipientEmail } = useRecipient(conversationUsers)
    return (
        <Link to={`/conversations/${id}`} style={{ display: "flex", alignItems: "center", textDecoration: "none", color: "#666" }}>
            <StyledContainer>
                <RecipientAvata recipient={recipient} recipientEmail={recipientEmail} />
                <span>{recipientEmail}</span>
            </StyledContainer>
        </Link>
    )
}

export default ConversationSelect
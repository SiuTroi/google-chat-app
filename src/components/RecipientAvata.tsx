import Avatar from "@mui/material/Avatar"
import styled from "styled-components"
import { useRecipient } from "../hooks/useRecipent"

type Props = ReturnType<typeof useRecipient>

const StyledAvatar = styled(Avatar)`
	margin: 5px 15px 5px 5px;
`
const RecipientAvata = ({recipient, recipientEmail}: Props) => {
  return recipient?.email ? <StyledAvatar src={recipient.photoURL} /> : <StyledAvatar>{recipientEmail && recipientEmail[0].toUpperCase()}</StyledAvatar>
}

export default RecipientAvata
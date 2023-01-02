import { Avatar, Button, IconButton, Tooltip } from "@mui/material";
import { useCollection } from "react-firebase-hooks/firestore"
import styled from "styled-components";
import ChatIcon from "@mui/icons-material/Chat"
import MoreVerticalIcon from "@mui/icons-material/MoreVert"
import LogoutIcon from "@mui/icons-material/Logout"
import SearchIcon from "@mui/icons-material/Search"
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import { signOut } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import * as EmailValidator from "email-validator"
import { addDoc, collection, query, where } from "firebase/firestore";
import { Conversation } from "../interface";
import ConversationSelect from "./ConversationSelect";


const StyledContainer = styled.div`
    height: 100vh;
	min-width: 300px;
	max-width: 350px;
	overflow-y: scroll;
	border-right: 1px solid whitesmoke;
    
    /* Hide scrollbar for Chrome, Safari and Opera */
	::-webkit-scrollbar {
		display: none;
	}
	/* Hide scrollbar for IE, Edge and Firefox */
	-ms-overflow-style: none; /* IE and Edge */
	scrollbar-width: none; /* Firefox */`
const StyledHeader = styled.div`
display: flex;
justify-content: space-between;
align-items: center;
padding: 15px;
height: 80px;
border-bottom: 1px solid whitesmoke;
position: sticky;
top: 0;
background-color: white;
z-index: 1;`
const StyledSearch = styled.div`
display: flex;
align-items: center;
padding: 15px;
border-radius: 2px;`
const StyledUserAvatar = styled(Avatar)`
cursor: pointer;
:hover {
    opacity: 0.8;
}`
const StyledSearchIput = styled.input`
outline: none;
border: none;
flex: 1;`
const StyledSidebarButton = styled(Button)`
width: 100%;
border-top: 1px solid whitesmoke;
border-bottom: 1px solid whitesmoke;
`
const Sidebar = () => {
  const [loggedInUser, _loading, _error] = useAuthState(auth)
  const [isOpenNewConversationDialog, setisOpenNewConversationDialog] = useState(false)
  const [recipientEmail, setrecipientEmail] = useState("")

  const toggleNewConversationDialog = (isOpen: boolean) => {
    setisOpenNewConversationDialog(isOpen)

    if(!isOpen) { setrecipientEmail("") }
  }

  const closeNewConversationDialog = () => {
    toggleNewConversationDialog(false)
  } 

  // check if conversation already exists between the currently logged uin user and recipient
  const queryGetConversationsForCurrentUser = query(collection(db, "conversations"), where("users", "array-contains", loggedInUser?.email))
  const [conversationsSnapshot, __loading, __error] = useCollection(queryGetConversationsForCurrentUser)
  const isConversationAlreadyExists = (recipientEmail: string) => conversationsSnapshot?.docs.find(conversation => (conversation.data() as Conversation).users.includes(recipientEmail))


  const isInvitingSeft = recipientEmail === loggedInUser?.email
  const createNewConversation = async () => {
    if(EmailValidator.validate(recipientEmail) && !isInvitingSeft && !isConversationAlreadyExists(recipientEmail)){
      // add conversation user to db "conversations" colection
      // A conversation is between the currently logged in user and the user invited

      await addDoc(collection(db, "conversations"), {
        users: [loggedInUser?.email, recipientEmail]
      })
    }

    closeNewConversationDialog()
  }

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.log("ERROR LOGGING OUT", error)
    }
  }


  return (
    <StyledContainer>
      <StyledHeader>
        <Tooltip title={loggedInUser?.email || ""} placement="right">
          <StyledUserAvatar src={loggedInUser?.photoURL as string || ""} alt="avata" />
        </Tooltip>
        <div>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVerticalIcon />
          </IconButton>
          <IconButton onClick={logout}>
            <LogoutIcon />
          </IconButton>
        </div>
      </StyledHeader>

      <StyledSearch>
        <SearchIcon />
        <StyledSearchIput placeholder="Search your conversations" />
      </StyledSearch>

      <StyledSidebarButton onClick={() => {
        toggleNewConversationDialog(true)
      }}>
        Start a new conversation
      </StyledSidebarButton>

      {/* List of conversation */}
      {conversationsSnapshot?.docs.map(conversation => (
        <ConversationSelect 
          key={conversation.id}
          id={conversation.id}
          conversationUsers={(conversation.data() as Conversation).users}
        />
      ))}

      <Dialog open={isOpenNewConversationDialog} onClose={closeNewConversationDialog}>
        <DialogTitle>New Conversation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a Google email address for the user you wish to chat with
          </DialogContentText>
          <TextField 
            autoFocus
            label="Email Address"
            type={"email"}
            fullWidth
            variant="standard"
            value={recipientEmail}
            onChange={e => setrecipientEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeNewConversationDialog}>Cancel</Button>
          <Button disabled={!recipientEmail} onClick={createNewConversation}>Create</Button>
        </DialogActions>
      </Dialog>
    </StyledContainer>
  )
}

export default Sidebar
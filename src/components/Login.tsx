import { Button } from '@mui/material'
import { useSignInWithGoogle } from 'react-firebase-hooks/auth'
import styled from 'styled-components'
import googlechatapp from "../assets/googlechatapp.png"
import { auth } from '../config/firebase'

const StyledContainer = styled.div`
    height: 100vh;
    display: grid;
    place-items: center;
    background-color: whitesmoke;`
const StyledLoginContainer = styled.div`
display: flex;
	flex-direction: column;
	align-items: center;
	padding: 100px;
	background-color: white;
	border-radius: 5px;
	box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);`
const StyledImageWrapper = styled.div`
    margin-bottom: 50px;`

const Login = () => {
    const [signInWithGoogle, _user, _loading, _error] = useSignInWithGoogle(auth)
    const signIn = () => {
        signInWithGoogle()
    }
    return (
    <StyledContainer>
        <title>Login</title>

        <StyledLoginContainer>
            <StyledImageWrapper>
                <img src={googlechatapp} alt="Google chat app logo" height={200} width={200} />
            </StyledImageWrapper>
            <Button variant='outlined' onClick={signIn}>
                Sign up with google
            </Button>
        </StyledLoginContainer>
    </StyledContainer>
  )
}

export default Login
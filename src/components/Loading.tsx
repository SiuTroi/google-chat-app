import styled from 'styled-components'
import googlechatapp from '../assets/googlechatapp.png'
import CircularProgress from '@mui/material/CircularProgress'

const StyledContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100vh;
`

const StyledImageWrapper = styled.div`
	margin-bottom: 50px;
`

const Loading = () => {
    return (
        <StyledContainer>
            <StyledImageWrapper>
                <img src={googlechatapp} alt="Chat app logo" height="200" width="200" />

            </StyledImageWrapper>

            <CircularProgress />
        </StyledContainer>
    )
}

export default Loading
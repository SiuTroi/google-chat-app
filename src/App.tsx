import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from "./config/firebase"
import Loading from './components/Loading';
import { useEffect } from 'react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import ConversationDetail from './components/ConversationDetail';

function App() {
  const [loggedInUser, loading, _error] = useAuthState(auth)

  useEffect(() => {
    const setUserInDb = async () => {
      try {
        await setDoc(
          // derectory
          doc(db, "users", loggedInUser?.email as string),
          // data want write
          {
            email: loggedInUser?.email,
            lastSeen: serverTimestamp(),
            photoURL: loggedInUser?.photoURL
          },
          // update what changed
          { merge: true }
        )
      } catch (error) {
        console.log("ERROR WHEN WRITE DATA IN DATABASE", error)
      }
    }
    setUserInDb()
  }, [loggedInUser])


  if (loading) return <Loading />
  if (!loggedInUser) return <Login />
  return (
    <div>
      <Routes>
        <Route path='/' element={<Sidebar />} />
        <Route path='/conversations/:conversationId' element={<ConversationDetail />} />
      </Routes>
    </div>
  );
}

export default App;

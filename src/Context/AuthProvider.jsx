import { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../Firebase/Firebase.init';

const AuthProvider = ({ children }) => {
    const [user,setUser]=useState(null);
    const [loading,setLoading]=useState(false);

    const createUser=async(email,password)=>
    {
        setLoading(true);
       const credential=await createUserWithEmailAndPassword(auth,email,password);
         setUser(credential.user);
            setLoading(false);
            return credential.user;
    }
    const loginUser=async(email,password)=>
    {
        setLoading(true);
         const credential = await signInWithEmailAndPassword(auth,email,password);
      setUser(credential.user);
      setLoading(false);
      return credential;
    }
    const logoutUser=async()=>
    {
        setLoading(true);
        await signOut(auth);
        setUser(null);
            setLoading(false);
    }
    useEffect(()=>
    {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) =>
        {
            setUser(currentUser);
            setLoading(false);
        })
        return ()=>
        {
            unsubscribe();
        }
    }   ,[])



    const authInfo = {user,setUser,loading,setLoading,createUser,loginUser,logoutUser};
  return (
        <AuthContext.Provider value={authInfo}>
        {children}
        </AuthContext.Provider>
  )
}

export default AuthProvider
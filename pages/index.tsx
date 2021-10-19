import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import firebase from '../firebase/clientApp'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import Auth from '../components/Auth';




export default function Home() {

  const db = firebase.firestore();
  
  const[user, loading, error] = useAuthState(firebase.auth());

  console.log("Loading:", loading, "|", "Current user:", user);

  const[votes, votesLoading, votesError] = useCollection(firebase.firestore().collection('votes'),{});

  if (!votesLoading && votes){
    votes.docs.map((doc) => console.log(doc.data()));
  }

  const addVoteDocument = async (vote: string) => {
    await db.collection('votes').doc(user.uid).set({vote,});
  };


  type VoteDocument = {
    vote: string;
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gridGap: 8,
        background:
          "linear-gradient(180deg, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)",
      }}
    >
      {loading && <h4>Loading...</h4>}
      {!user && <Auth />}
      {user && (
        <>
          <h1>Is soccer the superior sport?🤔</h1>

          <div style={{ flexDirection: "row", display: "flex" }}>
            <button
              style={{ fontSize: 32, marginRight: 8 }}
              onClick={() => addVoteDocument("yes")}
            >
              Heck yeah⚽ 
            </button>
            <h3>
              Soccer Lovers:{" "}
              {
                votes?.docs?.filter(
                  (doc) => (doc.data() as VoteDocument).vote === "yes"
                ).length
              }
            </h3>
          </div>
          <div style={{ flexDirection: "row", display: "flex" }}>
            <button
              style={{ fontSize: 32, marginRight: 8 }}
              onClick={() => addVoteDocument("no")}
            >
              No🤡
            </button>
            <h3>
              Soccer Haters:{" "}
              {
                votes?.docs?.filter(
                  (doc) => (doc.data() as VoteDocument).vote === "no"
                ).length
              }
            </h3>
          </div>
        </>
      )}
    </div>
    
  );
}

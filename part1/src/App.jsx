import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Button, Form } from "react-bootstrap";

// import Header from './components/header'
// import Content from './components/content'
// import Total from './components/total'
// import Reviews from './components/Reviews';
import Notes from "./components/notes";
import axios from "axios";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");

  // const anecdotes = [
  //   "If it hurts, do it more often.",
  //   "Adding manpower to a late software project makes it later!",
  //   "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
  //   "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  //   "Premature optimization is the root of all evil.",
  //   "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
  //   "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
  //   "The only way to go fast, is to go well.",
  // ];
  // const [selected, setSelected] = useState(0);
  // const initialReview = {};
  // anecdotes.forEach((anecdote, index) => {
  //   initialReview[index] = 0;
  // });
  // const [anecdoteReview, setAnecdoteReview] = useState(initialReview);
  // console.log("anecdoteReview", anecdoteReview);

  // const handleVote = () => {
  //   const newReview = { ...anecdoteReview };
  //   newReview[selected] += 1;
  //   setAnecdoteReview(newReview);
  // };

  // const returnMaxVoteAnecdote = () => {
  //   let maxVotes = Math.max(...Object.values(anecdoteReview));
  //   let maxVotesIndex = Object.keys(anecdoteReview).find(
  //     (index) => anecdoteReview[index] === maxVotes
  //   );
  //   return anecdotes[maxVotesIndex];
  // };

  // const [reviews, setReviews] = useState({
  //   good: 0,
  //   neutral: 0,
  //   bad: 0,
  // });

  // const handleGood = () => {
  //   let newReview = {
  //     ...reviews,
  //     good: reviews.good + 1,
  //   };
  //   setReviews(newReview);
  // };

  // const handleNeutral = () => {
  //   let newReview = {
  //     ...reviews,
  //     neutral: reviews.neutral + 1,
  //   };
  //   setReviews(newReview);
  // };

  // const handleBad = () => {
  //   let newReview = {
  //     ...reviews,
  //     bad: reviews.bad + 1,
  //   };
  //   setReviews(newReview);
  // };
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3007/api/notes")
      .then((response) => {
        console.log("obtianed response", response);
        setNotes(response.data);
      })
      .catch((error) => {
        alert("There was an error fetching the notes!", error);
      });
  }, []);

  const handleAddNote = async (e) => {
    e.preventDefault();
    const newNote = {
      title: title,
      summary: summary,
      important: false,
      complete: false,
    };

    try {
      // Check if the note already exists
      const existingNotesResponse = await axios.get(
        "http://localhost:3007/api/notes"
      );
      console.log("existingNotesResponse", existingNotesResponse);
      const existingNotesEntries = existingNotesResponse.data;
      const noteExists = existingNotesEntries.some(
        (note) => note.title === newNote.title
      );

      if (noteExists) {
        alert("Note already exists!");
      } else {
        // Post the new note
        const response = await axios.post(
          "http://localhost:3007/api/notes",
          newNote
        );
        console.log("response posted", response);
        setNotes(notes.concat(response.data));
        setShowForm(false);
        setTitle("");
        setSummary("");
      }
    } catch (error) {
      alert("There was an error adding the note!");
      console.error("Error details:", error); // Log the error details
    }
  };

  const markAsComplete = (id) => {
    // const updatedNotes = notes.map((note, index) =>
    //   index === id ? { ...note, complete: true } : note
    // );
    // setNotes(updatedNotes);
    axios
      .patch(`http://localhost:3007/api/notes/${id}`, { complete: true })
      .then((response) => {
        const updatedNotes = notes.map((note) =>
          note.id === id ? { ...note, complete: true } : note
        );
        setNotes(updatedNotes);
      })
      .catch((error) => {
        alert("There was an error updating the note!", error);
      });
  };

  const markAsImportant = (id) => {
    // const updatedNotes = notes.map((note, index) =>
    //   index === id ? { ...note, important: true } : note
    // );
    // setNotes(updatedNotes);
    axios
      .patch(`http://localhost:3007/api/notes/${id}`, { important: true })
      .then((response) => {
        const updatedNotes = notes.map((note) =>
          note.id === id ? { ...note, important: true } : note
        );
        setNotes(updatedNotes);
      })
      .catch((error) => {
        alert("There was an error updating the note!", error);
      });
  };

  const removeNote = (id) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this note?"
    );

    // if (confirmation) {
    //   const updatedNotes = notes.filter((_, index) => index !== id);
    //   setNotes(updatedNotes);
    // }
    if (confirmation) {
      axios
        .delete(`http://localhost:3007/api/notes/${id}`)
        .then(() => {
          const updatedNotes = notes.filter((note) => note.id !== id);
          setNotes(updatedNotes);
        })
        .catch((error) => {
          console.error("There was an error deleting the note!", error);
        });
    }
  };

  return (
    <div>
      {/* <Header/>
      <Content/>
      <Total/> */}
      {/* <Reviews reviews={reviews} />
      <h1>Vote</h1>
      <button onClick={handleGood}>Good</button>
      <button onClick={handleNeutral}>Neutral</button>
      <button onClick={handleBad}>Bad</button> */}
      {/* <h1>{anecdotes[selected]}</h1>
      <h3>has {anecdoteReview[selected]} votes</h3>
      <hr />
      <h1>Anecdote with most votes</h1>
      <h2>{returnMaxVoteAnecdote()}</h2>
      <hr />
      <button onClick={handleVote}>Vote</button>
      <button onClick={() => setSelected((selected + 1) % anecdotes.length)}>
        Next Anecdote
      </button> */}
      {notes.length > 0 ? (
        <div className="Notes-Btn-Container">
          <Notes
            notes={notes}
            markAsComplete={markAsComplete}
            markAsImportant={markAsImportant}
            removeNote={removeNote}
          />
          <Button variant="primary" onClick={() => setShowForm(true)}>
            Add Item
          </Button>
        </div>
      ) : (
        <div className="Notes-Btn-Container">
          <Button variant="primary" onClick={() => setShowForm(true)}>
            Add Item
          </Button>
        </div>
      )}
      {showForm && (
        <Form onSubmit={handleAddNote}>
          <label>Note Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
          />
          <label>Note Summary</label>
          <input
            type="text"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Enter Summary"
          />
          <Button type="submit">Add Note</Button>
        </Form>
      )}
    </div>
  );
};

export default App;

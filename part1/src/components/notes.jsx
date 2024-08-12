import React, { useState } from "react";
import "./notes.css";
import { Button } from "react-bootstrap";

const Notes = ({ notes, markAsComplete, markAsImportant, removeNote }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("default");

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredNotes = searchQuery
    ? notes.filter((note) =>
        note.title.toLowerCase().includes(searchQuery.toString().toLowerCase())
      )
    : notes;

  const handleSort = () => {
    setSortOrder((prevOrder) =>
      prevOrder === "default" ? "important" : "default"
    );
  };

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (sortOrder === "important") {
      if (a.important && !b.important) return -1;
      if (!a.important && b.important) return 1;
    }
    if (a.complete && !b.complete) return 1;
    if (!a.complete && b.complete) return -1;
    return 0;
  });

  return (
    <div>
      <h1 className="Notes-Heading-top">Notes</h1>
      <input
        className="notes-input"
        type="text"
        placeholder="Search by title..."
        value={searchQuery}
        onChange={handleSearch}
      />
      <Button onClick={handleSort}>
        {sortOrder === "default" ? "Sort by Importance" : "Sort by Default"}
      </Button>
      {sortedNotes.map((note, index) => (
        <div className="note-container" key={index}>
          <h3>Title</h3>
          <h5
            className={`note ${note.complete ? "complete" : ""} ${
              note.important ? "important" : ""
            }`}
          >
            {note.title}
          </h5>
          <h3>Summary</h3>
          <p>{note.summary}</p>
          <Button
            className="Notes-btn"
            variant="success"
            onClick={() => markAsComplete(note.id)}
          >
            Mark as Complete
          </Button>
          <Button
            className="Notes-btn"
            variant="dark"
            onClick={() => markAsImportant(note.id)}
          >
            Mark as Important
          </Button>
          <Button
            className="Notes-btn"
            variant="danger"
            onClick={() => removeNote(note.id)}
          >
            Remove
          </Button>
        </div>
      ))}
    </div>
  );
};

export default Notes;

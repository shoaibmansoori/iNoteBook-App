import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props) => {
  const host = "http://localhost:5000"
  const notesInitial = []
  const [notes, setNotes] = useState(notesInitial);

  // Get all notes 
  const getNotes = async () => {
    // api call
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjFlOTUzNjQ3MTJmZjk1ZTAxYzk2ZTkxIn0sImlhdCI6MTY0Mjg0NDkyMn0.aryEufDxkuadZRGFKLMuiytOD_KnqfPeUgjABAniqy0"
      }

    });
   const json = await response.json() 
    console.log(json)
    setNotes(json)
  }



  //Add Note
  const addNote = async (title, description, tag) => {
    // api call
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjFlOTUzNjQ3MTJmZjk1ZTAxYzk2ZTkxIn0sImlhdCI6MTY0Mjg0NDkyMn0.aryEufDxkuadZRGFKLMuiytOD_KnqfPeUgjABAniqy0"
      },
      body: JSON.stringify({title,description,tag})

    });
    const json = await response.json(); 
    console.log(json);

    console.log("adding a nore");
    const note = {
      "_id": "61f5009174f7781f30edcadd",
      "user": "61e95364712ff95e01c96e91",
      "title": title,
      "description": description,
      "tag": tag,
      "Date": "2022-01-29T08:53:37.834Z",
      "__v": 0
    };
    setNotes(notes.concat(note))
  }

  //Delete a Note
  const deleteNote = async (id) => {
    // TODO:API CALL
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjFlOTUzNjQ3MTJmZjk1ZTAxYzk2ZTkxIn0sImlhdCI6MTY0Mjg0NDkyMn0.aryEufDxkuadZRGFKLMuiytOD_KnqfPeUgjABAniqy0"
      },
      

    });
    const json = response.json();
     console.log(json);

    console.log("deleting the note" + id);
    const newNotes = notes.filter((note) => { return note._id !== id })
    setNotes(newNotes)
  }
  //Edit a Note
  const editNote = async (id, title, description, tag) => {
    //API CALL
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjFlOTUzNjQ3MTJmZjk1ZTAxYzk2ZTkxIn0sImlhdCI6MTY0Mjg0NDkyMn0.aryEufDxkuadZRGFKLMuiytOD_KnqfPeUgjABAniqy0"
      },
      body: JSON.stringify({title,description,tag})

    });
    const json = await response.json();
    console.log(json);

    let newNotes = JSON.parse(JSON.stringify(notes))
    //logic to edit in client
    for (let index = 0; index < notes.length; index++) {
      const element =newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
    }
    setNotes(newNotes);
  }


  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
      {props.children}
    </NoteContext.Provider>
  )
}
export default NoteState;
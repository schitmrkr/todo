import './App.css';
import React, { useEffect, useState } from 'react';

import axios from "axios";


function App() {

  const [tasks, setTasks]= useState([]);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);

  const [updated, setUpdated] = useState(true);

  
  useEffect(() => {
    const fetchTasks = async () => {
      console.log("running");
      const response = await axios.get(
        `http://127.0.0.1:5090/listtasks`
      );
      setTasks(response.data);
      console.log(response.data)
    };

    fetchTasks();
  }, [updated]);

  const handleCreate = async () => {
    console.log("button working");
    console.log(title);
    console.log(description);
    console.log(completed);

    const response = await axios.post(
      `http://127.0.0.1:5090/create_task`,
      { title, description, completed },
      {
        headers: {
            'Content-Type': 'application/json',
        },
    }
    )

    console.log(response);

    if (response.status == 200){
      setUpdated(!updated);
      setTitle("");
      setDescription("")
      setCompleted(false)
    }
    
  };

  const handleTaskStatusChange = async (e, task_id) => {
      const id = task_id;

      const response = await axios.post(
        `http://127.0.0.1:5090/manage_task`,
        { id },
        {
          headers: {
              'Content-Type': 'application/json',
          },
      }
      )

      if (response.status == 200) {
        setUpdated(!updated);
      }


  };

  return (
    <div className="App">
        <div className="list-task">
            <table>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Completed</th>
            </tr>

            {tasks.map((task) => 
            <tr>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td> 
              <input
                type="checkbox"
                id={task.id}
                checked={task.completed} 
                onChange={(e) => handleTaskStatusChange(e, task.id)}
              />
              </td>
            </tr>
            )}
            
            </table>
        </div>
        <div className="create-task">
              Title: <input value={title} onChange={(e) => setTitle(e.target.value)}/> <br/>
              Description: <textarea value={description} onChange={(e) => setDescription(e.target.value)}/><br/>
              Completed: 
              <select name="completed" id="completed" value={completed} onChange={(e) => setCompleted(e.target.value)}>
                <option value={false}>False</option>
                <option value={true}>True</option>
                
              </select>
              <br/>

              <button onClick={handleCreate}>
                Createe
              </button>
        </div>
    </div>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import './App.css';

import Navbar from "./Components/Navbar/Navbar";
import Board from "./Components/Board/Board";
import axios from "axios"; 

function App() {
  const initialGroupingOption = localStorage.getItem('groupBy') || "status";
  const initialSortingOption = localStorage.getItem('sortBy') || "priority";

  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupingOption, setGroupingOption] = useState(initialGroupingOption);
  const [sortingOption, setSortingOption] = useState(initialSortingOption);

  //  set priority lebel for the makeing user level

  const priorityLabels = {
    0:(
      <div className="user-label">
      <img src={process.env.PUBLIC_URL + "/5.jpg"} className='user-pic' alt="No Priority" />  No Priority
      </div>
    ),
    1:(
      <div className="user-label">
      <img src={process.env.PUBLIC_URL + "/l.jpg"} className='user-pic' alt="Low" />  Low
      </div>
    ),
    2:(
      <div className="user-label">
      <img src={process.env.PUBLIC_URL + "/m.jpg"} className='user-pic' alt="Medium" />  Medium
      </div>
    ), 
    3:(
      <div className="user-label">
      <img src={process.env.PUBLIC_URL + "/h.jpg"}  className='user-pic' alt="High" />  High
      </div>
    ),  
    4:(
      <div className="user-label">
      <img src="https://cdn-icons-png.flaticon.com/128/6324/6324052.png" className='user-pic' alt="Urgent" />  Urgent
      </div>
    )
  };

  //  Extract firstname lastname firstletter and lastletter of the name for making the the user lebel 

  const userLabels=users.reduce((labels, user) => {
    const nameParts=user.name.split(' ');
    const firstName=nameParts[0];
    const lastName=nameParts.length > 1 ? nameParts[1] : '';
    const firstLetterFirstName = firstName.charAt(0).toUpperCase();
    const firstLetterLastName = lastName.charAt(0).toUpperCase();

    const randomColor = getRandomColor();

    labels[user.id] = (
      <div className="user-label">
        <div
          className="user-pic"
          style={{
            backgroundColor: randomColor,
          }}
        >
          {firstLetterFirstName}
          {lastName && ` ${firstLetterLastName}`}
        </div>
        {user.name}
      </div>
    );
    return labels;
  }, {});

  //  Generating the random color for the backgroung of the user level 

  function getRandomColor() {
    const letters='0123456789ABCDEF';
    let color='#';
    for (let i=0;i<6;i++) {
      color+=letters[Math.floor(Math.random()*7)];
    }
    return color;
  }

  useEffect(() => {
    getDetails();
  }, []);

  useEffect(() => {
    localStorage.setItem('groupBy', groupingOption);
    localStorage.setItem('sortBy',sortingOption);
  }, [groupingOption, sortingOption])

  // Fetching the data form the Api given 
  async function getDetails() {
    try {
      const { data } = await axios.get("https://tfyincvdrafxe7ut2ziwuhe5cm0xvsdu.lambda-url.ap-south-1.on.aws/ticketAndUsers");
      const updatedTickets = data.tickets.map((ticket) => {
        return ticket;
      });
      setTickets(updatedTickets); 
      setUsers(data.users);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
//  Mapping all the user fo there respective status priority and user
  const organizeTickets = () => {
    const organizedData = {};
  
    if (groupingOption === 'status') {
      const ticketStatus = {
        "Backlog": [],
        "Todo": [],
        "In progress": [],
        "Done": [],
        "Cancelled": []
      };
  
      tickets.forEach(ticket => {
        if (ticketStatus[ticket.status]) {
          ticketStatus[ticket.status].push(ticket);
        }
      });
  
      return ticketStatus;
    } else if (groupingOption === 'priority') {
      const priorityStatus = {
        0: [],
        1: [],
        2: [],
        3: [],
        4: []
      };
  
      tickets.forEach(ticket => {
        if (priorityStatus[ticket.priority]) {
          priorityStatus[ticket.priority].push(ticket);
        }
      });
  
      return priorityStatus;
    } else if (groupingOption === 'user') {
      const userStatus = {
        "usr-1": [],
        "usr-2": [],
        "usr-3": [],
        "usr-4": [],
        "usr-5": []
      };
  
      tickets.forEach(ticket => {
        if (userStatus[ticket.userId]) {
          userStatus[ticket.userId].push(ticket);
        }
      });
  
      return userStatus;
    } 
  
    return organizedData;
  };

  // Sort the tickets in the given conditions 

  const sortByPriority = (tickets) => {
    return [...tickets].sort((a, b) => b.priority - a.priority);
  };

  const sortByTitle = (tickets) => {
    return [...tickets].sort((a, b) => a.title.localeCompare(b.title));
  };

  const handleSortingChange = (event) => {
    setSortingOption(event.target.value);
  };

  const handleGroupingChange = (event) => {
    setGroupingOption(event.target.value);
  };

  const sortedTickets = (tickets) => {
    const sortingFunctions = {
      priority: sortByPriority,
      title: sortByTitle,
    };
  
    const sortingFunction = sortingFunctions[sortingOption];
  
    if (sortingFunction) {
      return sortingFunction(tickets);
    }
  
    return tickets;
  };

  const boards = organizeTickets();

  // Main funtion 
  
  return (
    <div className="app-container">
      <div className="app-navbar">
        <nav>
          <Navbar
            sortingOption={sortingOption}
            onSortingChange={handleSortingChange}
            groupingOption={groupingOption}
            onGroupingChange={handleGroupingChange}
          />
        </nav>
      </div>
      <div className="app-outer-container">
        <div className="app-boards">
        {Object.keys(boards).map(boardKey => (
            <Board 
              key={boardKey} 
              title={groupingOption === 'priority' ? priorityLabels[boardKey] : 
              groupingOption === "user" ? userLabels[boardKey] : boardKey}
              count={boards[boardKey].length}
              tickets={sortedTickets(boards[boardKey])}
              sortingOption={sortingOption}
              groupingOption={groupingOption} 
              users={users}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
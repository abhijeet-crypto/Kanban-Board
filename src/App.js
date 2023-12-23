
import React, {useEffect,useState} from 'react'
import './App.css';
import Navbar from './component/Navbar/Navbar';
import Board from './component/Board/Board';
import axios from 'axios';


function App() {
  const initialGroupingOption = localStorage.getItem('groupBy') || "status";
  const initialSortingOption = localStorage.getItem('sortBy') || "priority";

  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupingOption, setGroupingOption] = useState(initialGroupingOption);
  const [sortingOption, setSortingOption] = useState(initialSortingOption);

  const priorityLabels={
    0:(
      <div className='user-label'>
        <img src={process.env.PUBLIC_URL+"/5.jpg"} className='user-pic' alt='No Priority'/> No Priority
      </div>
    ),
    1:(
      <div className='user-label'>
        <img src={process.env.PUBLIC_URL+"/l.jpg"} className='user-pic' alt='Low'/> Low
      </div>
    ),
    2:(
      <div className='user-label'>
        <img src={process.env.PUBLIC_URL+"/m.jpg"} className='user-pic' alt='Medium'/> Medium
      </div>
    ),
    3:(
      <div className='user-label'>
        <img src={process.env.PUBLIC_URL+"/h.jpg"} className='user-pic' alt='High'/> High
      </div>
    ),
    4:(
      <div className='user-label'>
        <img src="https://cdn-icons-png.flaticon.com/128/6324/6324052.png" className='user-pic' alt='Urgent'/> Urgent
      </div>
    ),
  };
  const userLabels=users.reduce((labels,user)=>{
    const nameParts=user.name.split(' ');
    const firstName=nameParts[0];
    const lastName=nameParts.length>1?nameParts[1]:'';
    const firstLetterFirstName=firstName.charAt(0).toUpperCase();
    const firstLetterLastName=lastName.charAt(0).toUpperCase();

    const randomColor=getRandomColor();

    labels[user.id]=(
      <div className='user-label'>
        <div className='user-pic' style={{backgroundColor:randomColor,}}>
          {firstLetterFirstName}
          {lastName && `${firstLetterLastName}`}
        </div>
        {user.name}
      </div>
    );
    return labels;
  },{});
  function getRandomColor(){
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
     }
    return color;
  }
  useEffect(()=>{
    getDetails();
  },[]);
  useEffect(()=>{
    localStorage.setItem('groupBy',groupingOption);
    localStorage.setItem('sortBy',sortingOption);
  },[groupingOption,sortingOption]);



  async function getDetails(){
    try{
      const{data}=await axios.get("https://tfyincvdrafxe7ut2ziwuhe5cm0xvsdu.lambda-url.ap-south-1.on.aws/ticketAndUsers")
      const updatedTickets=data.tickets.map((ticket)=>{
        return ticket;
      })
      setTickets(updatedTickets);
      setUsers(data.users);
      // console.log(data);
    }catch(error){
      console.error("Error fetching data: ",error);
    }
  }

  const organizeTickets=()=>{
    const organizeData={};
    if(groupingOption==='status'){
      const ticketStatus={
        'Backlog':[],
        "Todo":[],
        "In progress":[],
        "Done":[],
        "Cancelled":[]
      };
      tickets.forEach(ticket=> {
        if(ticketStatus[ticket.status]){
          ticketStatus[ticket.status].push(ticket);
        }  
      });
      return ticketStatus;
    }else if(groupingOption==='priority'){
      const priorityStatus={
        0:[],
        1:[],
        2:[],
        3:[],
        4:[]
      };
      tickets.forEach(ticket=>{
        if(priorityStatus[ticket.priority]){
          priorityStatus[ticket.priority].push(ticket);
        }
      });
      return priorityStatus
    }else if(groupingOption==='user'){
      const userStatus={
        "usr-1":[],
        "usr-2":[],
        "usr-3":[],
        "usr-4":[],
        "usr-5":[]
      };
      tickets.forEach(ticket=>{
        if(userStatus[ticket.userId]){
          userStatus[ticket.userId].push(ticket);
        }
      });
      return userStatus;
    }
    return organizeData;
  }

  // sorting 

  const sortByPriority=(tickets)=>{
    return [...tickets].sort((a,b)=>b.priority-a.priority);
  };

  const sortByTitle=(tickets)=>{
    return [...tickets].sort((a,b)=>a.title.localeCompare(b.title));
  };

  const sortedTickets=(tickets)=>{
    const sortingFuntions={
      priority: sortByPriority,
      title: sortByTitle,
    };
    const sortingFuntion=sortingFuntions[sortingOption];

    if(sortingFuntion){
      return sortingFuntion(tickets);
    }
    return tickets;
  }

  const boards=organizeTickets();

  const handleSortingChange=(event)=>{
    setSortingOption(event.target.value);
  }

  const handleGroupingChange=(event)=>{
    setGroupingOption(event.target.value);
  }

  return (
    <div className='app-container'>
      <div className="app-navbar">
        <nav>
          <Navbar sortingOption={sortingOption}
           onSortingChange={handleSortingChange}
           groupingOption={groupingOption}
           onGroupingChange={handleGroupingChange} ></Navbar>
          
        </nav>
        
      </div>
      <div className='app-outer-container'>
        <div className='app-board'>
          {Object.keys(boards).map(boardkey=>(
            <Board 
            key={boardkey}
            title={groupingOption==='priority' ? priorityLabels[boardkey] : groupingOption==='user' ? userLabels[boardkey] : boardkey}
            count={boards[boardkey].length}
            tickets={sortedTickets(boards[boardkey])}
            sortingOption={sortingOption}
            groupingOption={groupingOption}
            users={users}
            ></Board>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;

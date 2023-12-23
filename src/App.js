
import './App.css';
import Navbar from './component/Navbar/Navbar';
import React, {useEffect,useState} from 'react'
import axios from 'axios';


function App() {
  // const initialGroupingOption = localStorage.getItem('groupBy') || "status";
  // const initialSortingOption = localStorage.getItem('sortBy') || "priority";

  // const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  // const [groupingOption, setGroupingOption] = useState(initialGroupingOption);
  // const [sortingOption, setSortingOption] = useState(initialSortingOption);

  const priorityLabels={
    0:(
      <div className='user-label'>
        <img src={'process.env.PUBLIC_URL'+"/5.jpg"} className='user-pic' alt='No Priority'/> No Priority
      </div>
    ),
    1:(
      <div className='user-label'>
        <img src={'process.env.PUBLIC_URL'+"/l.jpg"} className='user-pic' alt='Low'/> Low
      </div>
    ),
    2:(
      <div className='user-label'>
        <img src={'process.env.PUBLIC_URL'+"/m.jpg"} className='user-pic' alt='Medium'/> Medium
      </div>
    ),
    3:(
      <div className='user-label'>
        <img src={'process.env.PUBLIC_URL'+"/h.jpg"} className='user-pic' alt='High'/> High
      </div>
    ),
    4:(
      <div className='user-label'>
        <img src="https://cdn-icons-png.flaticon.com/128/6324/6324052.png" className='user-pic' alt='Urgent'/> Urgent
      </div>
    ),
  };
  useEffect(()=>{
    getDetails();
  },[]);
  // useEffect(()=>{
  //   localStorage.setItem('groupBy',groupingOption);
  //   localStorage.setItem('sortBy',sortingOption);
  // },[groupingOption,sortingOption]);

  function getRandomColor(){
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
     }
    return color;
  }

  async function getDetails(){
    try{
      const{data}=await axios.get("https://tfyincvdrafxe7ut2ziwuhe5cm0xvsdu.lambda-url.ap-south-1.on.aws/ticketAndUsers")
      setUsers(data.users);
      // console.log(data);
    }catch(error){
      console.error("Error fetching data: ",error);
    }
  }

  return (
    <div className='app-container'>
      {/* <div className="navbar">
        <nav>
          <Navbar sortingOption={sortingOption}
           onSortingChange={handleSortingChange}
           groupingOption={groupingOption}
           onGroupingChange={handleGroupingChange} ></Navbar>
          
        </nav>
        
      </div> */}
      HII
    </div>
  );
}

export default App;

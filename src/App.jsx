import { useState, useEffect } from 'react'
import Sidebar from "./components/Sidebar"
import RequestContent from "./components/RequestContent"
import axios from "axios"

function App() {
  const [endpoints, setEndpoints] = useState([])
  const [selectedEP, setSelectedEP] = useState([])
  const [requests, setRequests] = useState([])
  const [selectedRequest, setSelectedRequest] = useState({})

  useEffect(() => {
    if (localStorage.userEndpoints) {
      setEndpoints(localStorage.userEndpoints)
    }
  }, [])
  
  useEffect(() => {
    axios
      .get("http://localhost:3000/requests") // Will change this to /api/:hash
      .then(response => {
        setRequests(response.data)
      }).catch(err => {
        console.log(err.message)
      })
  }, [])

  const handleSidebarClick = (e, sidebarRequest) => {
    axios
      .get(`http://localhost:3000/requestData/${sidebarRequest.id}`) // Will change this to /api/:hash/sidebarRequest.id
      .then(response => {
        const reqInfo = Object.assign({}, response.data, sidebarRequest)
        setSelectedRequest(reqInfo)
      }).catch(err => {
        console.log(err.message)
      })
  }

  return (
    <>
      <header>
        <label htmlFor="hash">ourrequestbinsite.com/</label>
      </header>
      <main>
        <Sidebar requests={requests} handleSidebarClick={handleSidebarClick}/>
        <RequestContent selectedRequest={selectedRequest}/>
      </main>
  </>
  )
}

export default App

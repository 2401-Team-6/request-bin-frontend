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
  }, [selectedEP])

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

  const handleNewEndpointClick = (e) => {
    axios
      .get(`http//localhost:3000/newEndpoint`) // Will change to this /api/new
      .then(response => {
        setSelectedEP(response.data.hash) // Check with backend about the format of this response
        setEndpoints(endpoints.concat(response.data.hash))
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

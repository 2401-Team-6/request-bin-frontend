import { useState, useEffect } from 'react'
import Sidebar from "./components/Sidebar"
import RequestContent from "./components/RequestContent"
import EndpointDropdown from './components/EndpointDropdown'
import axios from "axios"

function App() {
  const [endpoints, setEndpoints] = useState([])
  const [selectedEP, setSelectedEP] = useState([])
  const [requests, setRequests] = useState([])
  const [selectedRequest, setSelectedRequest] = useState({})
  
  // If client has previous endpoints stored in local storage, load them
  useEffect(() => {
    if (localStorage.userEndpoints) {
      setEndpoints(localStorage.userEndpoints)
      setSelectedEP(localStorage.userEndpoints[0])
    }
  }, [])
  
  // Load the requests for the selected endpoint (each time )
  useEffect(() => {
    axios
      .get("http://localhost:3000/requests") // Will change this to /api/${selectedEP.hash}
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
      .get(`http://localhost:3000/newEndpoint`) // Will change to this /api/new
      .then(response => {
        setSelectedEP(response.data) // Check with backend about the format of this response
        setEndpoints(endpoints.concat(response.data))
        localStorage.userEndpoints.push(response.data)
      })
  }

  const handleEndpointSubmit = (e, hash) => {
    if (e.key !== 'Enter') return;

    axios
      .get(`http://localhost:3000/endpoints/${hash}`)
      .then(response => {
        // Handle 404
        setSelectedEP(response.data)
        setEndpoints(endpoints.concat(response.data))
        localStorage.userEndpoints.push(response.data)
      })
  }
 
  return (
    <>
      <header>
        <label htmlFor="hash">ourrequestbinsite.com/</label>
        <EndpointDropdown endpoints={endpoints} selectedEP={selectedEP} onKeyPress/>
      </header>
      <main>
        <Sidebar requests={requests} handleSidebarClick={handleSidebarClick}/>
        <RequestContent selectedRequest={selectedRequest}/>
      </main>
  </>
  )
}

export default App

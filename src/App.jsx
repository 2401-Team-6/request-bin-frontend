import { useState, useEffect } from 'react'
import Sidebar from "./components/Sidebar"
import RequestContent from "./components/RequestContent"
import EndpointDropdown from './components/EndpointDropdown'
import HeaderButton from './components/HeaderButton'
import axios from "axios"

function App() {
  const [endpoints, setEndpoints] = useState([])
  const [selectedEP, setSelectedEP] = useState({})
  const [requests, setRequests] = useState([])
  const [selectedRequest, setSelectedRequest] = useState({})
  
  // If client has previous endpoints stored in local storage, load them
  useEffect(() => {
    if (!localStorage.getItem("userEndpoints") || localStorage.getItem("userEndpoints") === "") {
      localStorage.setItem("userEndpoints", "[]")
    } else {
      const endpointsInStorage = JSON.parse(localStorage.getItem("userEndpoints"))
      setEndpoints(endpointsInStorage)
      setSelectedEP(endpointsInStorage[0] || {})
    } 
  }, [])
  
  // Load the requests for the selected endpoint (each time )
  useEffect(() => {
    axios
      .get("http://localhost:3000/requests/") // Will change this to /api/${selectedEP.hash}
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
        const endpointsInStorage = JSON.parse(localStorage.getItem("userEndpoints"))
        localStorage.setItem("userEndpoints", JSON.stringify(endpointsInStorage.concat(response.data)))
      }).catch(err => console.log(err.message))
  }

  const handleEndpointSubmit = (e) => {
    axios
      .get(`http://localhost:3000/endpoints/${e.target.value}`)
      .then(response => {
        setSelectedEP(response.data)

        if (endpoints.find(endpoint => endpoint.hash === response.data.hash)) {
          return
        } else {
          setEndpoints(endpoints.concat(response.data))
        }
        
        const endpointsInStorage = JSON.parse(localStorage.getItem("userEndpoints"))
        if (endpointsInStorage.find(endpoint => endpoint.hash === response.data.hash)) {
          return
        } else {
          localStorage.setItem("userEndpoints", JSON.stringify(endpointsInStorage.concat(response.data)))
        }
      }).catch(err => {
        console.log(err.message)
      })
  }

  const handleCopyClick = (e, text) => {
    console.log("fired")
    navigator.clipboard.writeText(text)
  }
 
  return (
    <>
      <header>
        <label htmlFor="hash">ourrequestbinsite.com/</label>
        <EndpointDropdown endpoints={endpoints} selectedEP={selectedEP} onSubmit={handleEndpointSubmit}/>
        <HeaderButton onClick={(e) => handleCopyClick(e, document.getElementById("hash-dropdown").value)} src="./assets/img/copy_icon.png" />
        <HeaderButton onClick={handleNewEndpointClick} src="./assets/img/plus_icon.png" />
      </header>
      <main>
        <Sidebar requests={requests} handleSidebarClick={handleSidebarClick}/>
        <RequestContent selectedRequest={selectedRequest} copyClick={handleCopyClick}/>
      </main>
  </>
  )
}

export default App

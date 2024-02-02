import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import RequestContent from './components/RequestContent';
import EndpointDropdown from './components/EndpointDropdown';
import EndpointText from './components/EndpointText';
import HeaderButton from './components/HeaderButton';
import useSocket from './hooks/UseSocket';
import axios from 'axios';

function App() {
  const [endpoints, setEndpoints] = useState([]);
  const [selectedEP, setSelectedEP] = useState({});
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState({});
  const [selectedSidebarRequest, setSelectedSidebarRequest] = useState({});
  const { connectSocket } = useSocket(requests, setRequests);

  // If client has previous endpoints stored in local storage, load them
  useEffect(() => {
    if (
      !localStorage.getItem('userEndpoints') ||
      localStorage.getItem('userEndpoints') === ''
    ) {
      localStorage.setItem('userEndpoints', '[]');
    } else {
      const endpointsInStorage = JSON.parse(
        localStorage.getItem('userEndpoints')
      );
      setEndpoints(endpointsInStorage);
      setSelectedEP(endpointsInStorage[0] || {});
    }
  }, []);

  // Load the requests for the selected endpoint & initialize a websockets connection
  // Each time a new endpoint is selected
  useEffect(() => {
    if (selectedEP.hash === undefined) {
      return;
    }

    connectSocket(selectedEP.hash);

    axios
      .get(`/api/${selectedEP.hash}`) 
      .then((response) => {
        setRequests(response.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [selectedEP]);

  useEffect(() => {
    if (!requests.some(req => req.id === selectedRequest.id)) {
      setSelectedRequest({});
    }
  }, [requests]);

  // Handle clicks on sidebar requests
  const handleSidebarClick = (e, sidebarRequest) => {
    if (e.target.tagName === 'SPAN') {
      return;
    }

    axios
      .get(`api/${selectedEP.hash}/${sidebarRequest.id}`)
      .then((response) => {
        const reqInfo = Object.assign({}, response.data, sidebarRequest);
        setSelectedRequest(reqInfo);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  // Handle clicking the "create a new endpoint" button
  const handleNewEndpointClick = (e) => {
    axios
      .post(`/api/new`) // Will change to this /api/new
      .then((response) => {
        setSelectedEP(response.data); // Check with backend about the format of this response
        setEndpoints(endpoints.concat(response.data));
        const endpointsInStorage = JSON.parse(
          localStorage.getItem('userEndpoints')
        );
        localStorage.setItem(
          'userEndpoints',
          JSON.stringify(endpointsInStorage.concat(response.data))
        );
      })
      .catch((err) => console.log(err.message));
  };

  // Handle an endpoint submitted through the text field
  const handleEndpointSubmit = (e) => {
    axios
      .get(`api/endpoint/${e.target.value}`)
      .then((response) => {
        setSelectedEP(response.data);

        if (
          endpoints.find((endpoint) => endpoint.hash === response.data.hash)
        ) {
          return;
        } else {
          setEndpoints(endpoints.concat(response.data));
        }

        const endpointsInStorage = JSON.parse(
          localStorage.getItem('userEndpoints')
        );
        if (
          endpointsInStorage.find(
            (endpoint) => endpoint.hash === response.data.hash
          )
        ) {
          return;
        } else {
          localStorage.setItem(
            'userEndpoints',
            JSON.stringify(endpointsInStorage.concat(response.data))
          );
        }
      })
      .catch((err) => {
        let endpointsInStorage = JSON.parse(localStorage.getItem('userEndpoints'))
        endpointsInStorage = endpointsInStorage.filter(ep => ep.hash !== e.target.value)

        localStorage.setItem('userEndpoints', JSON.stringify(endpointsInStorage))
        setEndpoints(endpoints.filter(ep => ep.hash !== e.target.value))

        console.log(err.message);
      });
  };

  // Handle copy button clicks
  const handleCopyClick = (e, text) => {
    try {
      while (typeof text === "string") {
        text = JSON.parse(text)
      }
    } catch (e) { }

    navigator.clipboard.writeText(text);
  };

  // Delete all requests button handler
  const handleDeleteAll = (e) => {
    axios
      .delete(`/api/${selectedEP.hash}`)
      .then((_response) => {
        setRequests([]);
      })
      .catch((err) => console.log(err.message));
  };

  // Delete individual request button handler
  const handleDeleteRequest = (e, requestId) => {
    console.log(requestId);
    axios
      .delete(`/api/${selectedEP.hash}/${requestId}`)
      .then((_response) => {
        setRequests(requests.filter((req) => req.id !== requestId))
      })
      .catch((err) => console.log(err.message));
  };

  return (
    <>
      <header>
        <label htmlFor='hash-dropdown'>Endpoint:</label>
        <EndpointDropdown
          endpoints={endpoints}
          selectedEP={selectedEP}
          setSelectedEP={setSelectedEP}
        />
        <EndpointText 
          endpoints={endpoints}
          onSubmit={handleEndpointSubmit}
        />
        <HeaderButton
          onClick={(e) => {
             handleCopyClick(e, Object.keys(selectedEP).length > 0 ? 
                                `https://${location.host}/log/${selectedEP.hash}`
                                : ""
             )
            }
          }
          type='copy'
        />
        <HeaderButton
          onClick={handleNewEndpointClick}
          type='plus'
        />
      </header>
      <main>
        <Sidebar
          requests={requests}
          handleSidebarClick={handleSidebarClick}
          handleDeleteAll={handleDeleteAll}
          handleDeleteRequest={handleDeleteRequest}
          selectedSidebarRequest={selectedSidebarRequest}
          setSelectedSidebarRequest={setSelectedSidebarRequest}
          selectedEP={selectedEP}
        />
        <RequestContent
          selectedRequest={selectedRequest}
          copyClick={handleCopyClick}
        />
      </main>
    </>
  );
}

export default App;

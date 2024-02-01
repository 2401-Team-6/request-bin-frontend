import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import RequestContent from './components/RequestContent';
import EndpointDropdown from './components/EndpointDropdown';
import HeaderButton from './components/HeaderButton';
import useSocket from './hooks/UseSocket';
import axios from 'axios';

let ws = null;

function App() {
  const [endpoints, setEndpoints] = useState([]);
  const [selectedEP, setSelectedEP] = useState({});
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState({});
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

  // Load the requests for the selected endpoint (each time )
  useEffect(() => {
    if (selectedEP.hash === undefined) {
      return;
    }

    connectSocket(selectedEP.hash);

    axios
      .get(`/api/${selectedEP.hash}`) // Will change this to /api/${selectedEP.hash}
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

  const handleSidebarClick = (e, sidebarRequest) => {
    if (e.target.tagName === 'SPAN') {
      return;
    }

    axios
      .get(`api/${selectedEP.hash}/${sidebarRequest.id}`) // Will change this to /api/:hash/sidebarRequest.id
      .then((response) => {
        const reqInfo = Object.assign({}, response.data, sidebarRequest);
        setSelectedRequest(reqInfo);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

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

  const handleCopyClick = (e, text) => {
    while (typeof text === 'string') {
      text = JSON.parse(text)
    }

    navigator.clipboard.writeText(JSON.stringify(text));
  };

  const handleDeleteAll = (e) => {
    axios
      .delete(`/api/${selectedEP.hash}`)
      .then((_response) => {
        setRequests([]);
      })
      .catch((err) => console.log(err.message));
  };

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
        <label htmlFor='hash'>ourrequestbinsite.com /</label>
        <EndpointDropdown
          endpoints={endpoints}
          selectedEP={selectedEP}
          onSubmit={handleEndpointSubmit}
        />
        <HeaderButton
          onClick={(e) =>
            handleCopyClick(e, document.getElementById('hash-dropdown').value)
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

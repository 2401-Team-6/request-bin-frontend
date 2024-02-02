import { useState } from "react"
import axios from 'axios'

const EndpointText = ({ endpoints, setEndpoints, setSelectedEP }) => {
  const [typedEP, setTypedEP] = useState("")

  const handleChange = (e) => {
    setTypedEP(e.target.value)
  }

   // Handle an endpoint submitted through the text field
   const submitEndpoint = (e) => {
    console.log("here")
    const hashLength = 21
    axios
      .get(`api/endpoint/${e.target.value.slice(e.target.value.trim().length - hashLength)}`)
      .then((response) => {
        setSelectedEP(response.data);

        if (
          endpoints.find((endpoint) => endpoint.hash === response.data.hash)
        ) {
          setTypedEP("")
          return;
        } else {
          setEndpoints(endpoints.concat(response.data))
        }

        const endpointsInStorage = JSON.parse(
          localStorage.getItem('userEndpoints')
        );
        if (
          endpointsInStorage.find(
            (endpoint) => endpoint.hash === response.data.hash
          )
        ) {
          setTypedEP("")
          return;
        } else {
          localStorage.setItem(
            'userEndpoints',
            JSON.stringify(endpointsInStorage.concat(response.data))
          );
        }
        console.log("down here")
        setTypedEP("")
      })
      .catch((err) => {
        let endpointsInStorage = JSON.parse(localStorage.getItem('userEndpoints'))
        endpointsInStorage = endpointsInStorage.filter(ep => ep.hash !== e.target.value)

        localStorage.setItem('userEndpoints', JSON.stringify(endpointsInStorage))
        setEndpoints(endpoints.filter(ep => ep.hash !== e.target.value.trim().length - hashLength))
        setTypedEP("Invalid endpoint URL. Try again.")
        console.log(err.message);
      });
  };

  const handleKeyUp = (e) => {
    const hashLength = 21

    if (e.key === 'Enter') {
      submitEndpoint(e)
    } else if (endpoints.find(ep => ep.hash === e.target.value.trim().slice(e.target.value.length - hashLength))) {
      submitEndpoint(e)
    }
  }

  return (
    <input type="text" 
            name="endpoint-text" 
            id="endpoint-text" 
            value={typedEP} 
            placeholder={"Paste a shared endpoint URL here."} 
            onChange={handleChange} 
            onKeyUp={handleKeyUp}
            autoComplete="off">
    </input>
  )
}

export default EndpointText
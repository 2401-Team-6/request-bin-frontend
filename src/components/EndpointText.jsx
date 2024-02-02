import { useState } from "react"

const EndpointText = ({ endpoints, onSubmit }) => {
  const [typedEP, setTypedEP] = useState("")

  const handleChange = (e) => {
    if (e.key === 'Enter') {
      onSubmit(e)
    }

    setTypedEP(e.target.value)

    if (endpoints.find(ep => ep.hash === e.target.value)) {
      onSubmit(e)
    }
  }

  return (
    <input type="text" 
            name="endpoint-text" 
            id="endpoint-text" 
            value={typedEP} 
            placeholder={"Paste a shared endpoint URL here."} 
            onChange={handleChange} 
            autoComplete="off">
    </input>
  )
}

export default EndpointText
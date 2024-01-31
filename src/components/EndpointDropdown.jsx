import { useState } from "react"

const EndpointDropdown = ({endpoints, selectedEP, onSubmit}) => {
  const [currentTypedEP, setTypedEP] = useState("")

  const handleTyping = (e) => {
    if (e.key === 'Enter') {
      onSubmit(e)
    }

    setTypedEP(e.target.value)
  }

  return (
    <>
      <input type="text" name="hash" id="hash-dropdown" list="hashes" placeholder={selectedEP.hash} onKeyUp={handleTyping}></input>
      <datalist id="hashes">
        {
          endpoints.map(endpoint => (
              <option key={endpoint.hash} value={endpoint.hash} />
          ))
        }
      </datalist>
    </>
  )
}

export default EndpointDropdown
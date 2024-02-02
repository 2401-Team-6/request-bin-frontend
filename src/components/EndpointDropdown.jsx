import { useState } from "react"

// const EndpointDropdown = ({endpoints, selectedEP, onSubmit}) => {
//   const [currentTypedEP, setTypedEP] = useState("")

//   const handleTyping = (e) => {
//     if (e.key === 'Enter') {
//       onSubmit(e)
//     }

//     setTypedEP(e.target.value)

//     if (endpoints.find(ep => ep.hash === e.target.value)) {
//       onSubmit(e)
//     }
//   }

//   return (
//     <>
//       <input type="text" name="hash" id="hash-dropdown" list="hashes" value={currentTypedEP} placeholder={selectedEP.hash} onChange={handleTyping} autoComplete="off"></input>
//       <datalist id="hashes">
//         {
//           endpoints.map(endpoint => (
//               <option key={endpoint.hash} value={endpoint.hash} onClick={onSubmit} />
//           ))
//         }
//       </datalist>
//     </>
//   )
// }

const EndpointDropdown = ({endpoints, selectedEP, setSelectedEP}) => {
  const handleChange = (e) => {
    setSelectedEP(endpoints.find(ep => ep.hash === e.target.value));
  }
  console.log(selectedEP)
  return (
    <select id="hash-select" value={selectedEP.hash || ""} onChange={handleChange}>
      {
        endpoints.map(ep => (
          <option key={ep.hash} value={ep.hash}>{`https://${location.host}/log/${ep.hash}`}</option>
        ))
      }
    </select>
  )
}

export default EndpointDropdown
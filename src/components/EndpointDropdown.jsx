const EndpointDropdown = ({endpoints, selectedEP}) => {
  return (
    <>
      <input type="text" name="hash" id="hash-dropdown" list="hashes" placeholder={selectedEP.hash}></input>
      <datalist id="hashes">
        {
          endpoints.map(endpoint => (
              <option value={endpoint.hash} />
          ))
        }
      </datalist>
    </>
  )
}

export default EndpointDropdown
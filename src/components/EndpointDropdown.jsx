const EndpointDropdown = ({endpoints, selectedId}) => {
  return (
    <select id="hash">
      {
        endpoints.map(endpoint => (
            <option value={endpoint.hash} selected={endpoint.id === selectedId}>
              {endpoint.hash}
            </option>
        ))
      }
    </select>
  )
}

export default EndpointDropdown
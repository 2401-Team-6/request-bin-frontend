const EndpointDropdown = ({endpoints, selectedEP, setSelectedEP}) => {
  const handleChange = (e) => {
    setSelectedEP(endpoints.find(ep => ep.hash === e.target.value));
  }

  return (
    <select id="hash-dropdown" value={selectedEP.hash || ""} onChange={handleChange}>
      {
        endpoints.map(ep => (
          <option key={ep.hash} value={ep.hash}>{`https://${location.host}/log/${ep.hash}`}</option>
        ))
      }
    </select>
  )
}

export default EndpointDropdown
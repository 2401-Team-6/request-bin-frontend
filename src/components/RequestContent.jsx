const Headers = ({ headers }) => (
  <li id="headers-row">
    <h1 className="request-list-header">Headers</h1>
    <img className="request-content-collapse actionable" src="./assets/img/arrow_icon.png" />
    <div className="collapsible">
      <div id="request-headers">
      <img className="copy-data actionable" src="./assets/img/copy_icon.png" />
      <table>
        <tbody>
        {
          headers && Object.keys(headers).map(header => {
            return (
              <tr key={header}>
                <td>
                  {header}
                </td>
                <td>
                  {headers[header]}
                </td>
              </tr>
            )
          })
        }
        </tbody>
      </table>
      </div>
    </div>
  </li>
)

const RequestBody = ({ body }) => (
  <li id="body-row">
    <h1 className="request-list-header">Body</h1>
    <img className="request-content-collapse actionable" src="./assets/img/arrow_icon.png" />
    <div className="collapsible">
      <img className="copy-data actionable" src="./assets/img/copy_icon.png" />
      <pre id="request-body">
<input type="radio" id="raw" name="json-display-type" value="raw" checked /><label htmlFor="raw">RAW</label><input type="radio" id="pretty" name="json-display-type" value="pretty" /><label htmlFor="pretty">PRETTY</label><input type="radio" id="structured" name="json-display-type" value="structured" /><label htmlFor="structured">STRUCTURED</label>
{JSON.stringify(body)}</pre>
    </div>
  </li>
)

const RequestContent = ({ selectedRequest }) => {
  if (Object.keys(selectedRequest).length == 0) {
    return (<></>)
  }

  return (
    <div id="request-content">
    <div id="request-content-header">
      <span>HTTP REQUEST</span>
      <span><a href="#" id="copy-request">request link</a></span>
      <span>{selectedRequest.timestamp}</span>
    </div>
    <ul id="request-list">
      <li>
        <h1 className="request-list-header">Details</h1>
        <span className={selectedRequest.method.toLowerCase()} id="request-list-method">{selectedRequest.method}</span>
        <span id="request-table-path">{selectedRequest.path}</span>
      </li>
      <Headers headers={selectedRequest.headers}/>
      <RequestBody body={selectedRequest.body}/>
    </ul>
  </div>
  )
}

export default RequestContent
import { JsonViewer } from '@textea/json-viewer'
import { useState, useEffect } from 'react';

const CopyButton = ({ onClick }) => (
  <span className="material-symbols-outlined copy-data actionable" onClick={onClick}>
    content_copy
  </span>
)

const Headers = ({ headers, copyClick }) => (
  <li id="headers-row">
    <h1 className="request-list-header">Headers</h1>
    <img className="request-content-collapse actionable" src="./assets/img/arrow_icon.png" />
    <div className="collapsible">
      <div id="request-headers">
      <CopyButton onClick={(e) => copyClick(e, JSON.stringify(headers))}/>
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

const Query = ({ query, copyClick }) => (
  <li id="query-row">
  <h1 className="request-list-header">Query</h1>
  <div id="request-queries">
    {Object.keys(query).map((key) => (
      <div key={key}>
        <span>{key}={query[key]}</span>
      </div>
    ))}
    <CopyButton onClick={(e) => copyClick(e, `?${queryString}`)} />
  </div>
</li>
)

function isJsonString(text) {
  try {
    while (typeof text === "string") {
      text = JSON.parse(text)
    }
  } catch (e) {
    return false;
  }

  return true;
}

const RequestBody = ({ body, copyClick, selectedRequest }) => {
  const [bodyIsJson, setBodyIsJson] = useState(true);
  const [displayLabels, setDisplayLabels] = useState(false);
  
  useEffect(() => {
    setDisplayLabels(isJsonString(body))
  }, [selectedRequest])

  return (
    <li id="body-row">
      <h1 className="request-list-header">Body</h1>
      <img className="request-content-collapse actionable" src="./assets/img/arrow_icon.png" />
      <div className="collapsible">
        <CopyButton onClick={(e) => copyClick(e, JSON.stringify(body))}/>
        <div id="request-body" style={displayLabels ? {} : {paddingTop: "1rem"}}>
          <input type="radio" id="pretty" name="json-display-type" value="pretty" defaultChecked />
          <BodyDisplayLabel text="pretty" onClick={(e) => setBodyIsJson(true)} display={displayLabels} />
          <input type="radio" id="raw" name="json-display-type" value="raw" />
          <BodyDisplayLabel text="raw" onClick={(e) => setBodyIsJson(false)} display={displayLabels} />
          <BodyContent body={body} bodyIsJson={bodyIsJson} />
        </div>
      </div>
    </li>
  )
}

const BodyContent = ({ body, bodyIsJson }) => {
  try {
    if (typeof body === 'object' && JSON.stringify(body) === '{}') body = '';
    
    JSON.parse(body)
    return bodyIsJson ? (<JsonViewer value={JSON.parse(body)} />) : (<div>{body}</div>)
  } catch (e) {
    return (<div>{body}</div>)
  }
}

const BodyDisplayLabel = ({ text, onClick, display }) => (
  <label htmlFor={text.toLowerCase()} onClick={onClick} className={display ? '' : 'hidden' }>{text.toUpperCase()}</label>
)

const RequestContent = ({ selectedRequest, copyClick }) => {
  if (Object.keys(selectedRequest).length == 0) {
    return (<></>)
  }

  return (
    <div id="request-content">
    <div id="request-content-header">
      <h1 id="request-content-header-title">HTTP REQUEST</h1>
      <span>{selectedRequest.created}</span>
    </div>
    <ul id="request-list">
      <li>
        <h1 className="request-list-header">Details</h1>
        <span className={selectedRequest.method.toLowerCase()} id="request-list-method">{selectedRequest.method}</span>
        <span id="request-table-path">{selectedRequest.path}</span>
      </li>
      <Headers headers={selectedRequest.headers} copyClick={copyClick}/>
      <Query query={selectedRequest.query} copyClick={copyClick} />
      <RequestBody body={selectedRequest.body} copyClick={copyClick} selectedRequest={selectedRequest} />
    </ul>
  </div>
  )
}

export default RequestContent
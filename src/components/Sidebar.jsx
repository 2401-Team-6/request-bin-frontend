const SidebarRequest = ({ request, handleClick, handleDeleteRequest }) => {

  const clickHandler = (event) => {
    handleClick(event, request)
  }

  return (  
    <tr onClick={clickHandler}>
      <td>
        {request.timestamp}
      </td>
      <td className={request.method.toLowerCase()}>
        {request.method}
      </td>
      <td>
        {request.path}
      </td>
      <td>
        <DeleteRequestButton onClick={(e) => handleDeleteRequest(e, request.id)}/>
      </td>
    </tr>
  )
}

const DeleteAllButton = ({ onClick }) => {
  return (
    <div id="delete-all" onClick={onClick}>
      <img className="delete-icon" src="./assets/img/trash_icon.png" />
      DELETE ALL
    </div>
  )
}

const DeleteRequestButton = ({ onClick }) => <img className="sidebar-delete" src="./assets/img/trash_icon.png" onClick={onClick}/>

const Sidebar = ({ requests, handleSidebarClick, handleDeleteAll, handleDeleteRequest }) => (
  <div id="sidebar">
    <table id="sidebar-table">
      <tbody>
      {
        requests.map(request => <SidebarRequest key={request.id} request={request} handleClick={handleSidebarClick} handleDeleteRequest={handleDeleteRequest}/>)
      }
      </tbody>
    </table>
    <DeleteAllButton onClick={handleDeleteAll}/>
  </div>
)

export default Sidebar
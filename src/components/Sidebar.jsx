const SidebarRequest = ({ request, handleClick }) => {

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
    </tr>
  )
}

const Sidebar = ({ requests, handleSidebarClick }) => (
  <div id="sidebar">
    <table id="sidebar-table">
      <tbody>
      {
        requests.map(request => <SidebarRequest key={request.id} request={request} handleClick={handleSidebarClick}/>)
      }
      </tbody>
    </table>
  </div>
)

export default Sidebar
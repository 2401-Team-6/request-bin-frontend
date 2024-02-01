import { DateTime } from "luxon";

const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
function epochToDate(epoch) {
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  return new Date(DateTime.fromSeconds(Number(epoch), { zone: 'UTC' })
    .toLocal().toISO().toString()).toLocaleDateString("en-US", dateOptions)
}

const SidebarRequest = ({ request, handleClick, handleDeleteRequest }) => {
  const clickHandler = (event) => {
    handleClick(event, request)
  }

  return (  
    <tr onClick={clickHandler}>
      <td>
        {new Date(DateTime.fromSeconds(Number(request.created), { zone: 'UTC' })
          .toLocal().toISO().toString()).toLocaleTimeString("en-US")}
      </td>
      <td className={request.method.toLowerCase()}>
        {request.method}
      </td>
      <td>
        {request.path.length > 10 ? (request.path.slice(0, 10) + '...') : (request.path)}
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
      <span className="material-symbols-outlined">
        delete
      </span>
      DELETE ALL
    </div>
  )
}

const DeleteRequestButton = ({ onClick }) => (
  <span className="material-symbols-outlined sidebar-delete" onClick={onClick}>
    delete
  </span>
)

const Sidebar = ({ requests, handleSidebarClick, handleDeleteAll, handleDeleteRequest }) => {
  let sorted = requests.slice()
  sorted.sort((a, b) => a.created - b.created)

  let partitioned = [];
  for (let i = 0; i < sorted.length; i++) {
    let reqDate = epochToDate(sorted[i].created)

    if (partitioned.length == 0 ||
        epochToDate(partitioned[partitioned.length - 1][0].created) !== reqDate) {
          partitioned.push([])
    }

    partitioned[partitioned.length - 1].push(sorted[i])
  }

  
  return (
    <div id="sidebar">
      <table id="sidebar-table">
        <tbody>
        {
          partitioned.map(arr => <SidebarDate arr={arr} key={epochToDate(arr[0].created)} handleClick={handleSidebarClick} handleDeleteRequest={handleDeleteRequest} />)
        }
        </tbody>
      </table>
      <DeleteAllButton onClick={handleDeleteAll}/>
    </div>
  )
}

const SidebarDate = ({ arr, handleClick, handleDeleteRequest }) => (
  <>
    <tr className="sidebar-date" key={epochToDate(arr[0].created)}>
      <th colSpan="4">{epochToDate(arr[0].created)}</th>
    </tr>

    {arr.map(request => <SidebarRequest key={request.id} request={request} handleClick={handleClick} handleDeleteRequest={handleDeleteRequest}/>)}
  </>
)

export default Sidebar
const HeaderButton = ({ onClick, type }) => {
  switch (type) {
    case 'plus':
      return (
        <span className="material-symbols-outlined actionable header-button" type={type} onClick={onClick}>
          add
        </span>
      )
    case 'copy':
      return (
        <span className="material-symbols-outlined actionable header-button" type={type} onClick={onClick}>
          content_copy
        </span>
      )
    default:
      return (<></>)
  }
}

export default HeaderButton
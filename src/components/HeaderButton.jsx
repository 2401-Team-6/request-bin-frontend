const HeaderButton = ({ onClick, src }) => {
  return <img className="actionable header-button" src={src} onClick={onClick}/>
}

export default HeaderButton
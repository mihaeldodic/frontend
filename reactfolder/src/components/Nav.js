 const Nav = () => {
  return (
 <>
 <nav className="navbar navbar-expand-lg navbar-light bg-ligh">
      <div className="container">
        
        <a className="navbar-brand" href="/index.html">
          <img src="img/header/logo.svg" alt="logo" height="12" /> 
        </a>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar" aria-controls="mainNavbar" aria-expanded="true" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span> 
        </button>

        <div className="navbar-collapse collapse show" id="mainNavbar">
          
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            
         <li className="nav-item dropdown text-end">
              <a className="nav-link dropdown-toggle" href="#" id="ddElectric" role="button" data-bs-toggle="dropdown" aria-expanded="false">ELECTRIC</a>
              <ul className="dropdown-menu" aria-labelledby="ddElectric">
                <li><a className="dropdown-item text-end" href="#">Electric Ace</a></li>
                <li><a className="dropdown-item text-end" href="#">Electric Ivy</a></li>
              </ul>
            </li>
          <li className="nav-item dropdown text-end">
              <a className="nav-link dropdown-toggle" href="#" id="ddElectric" role="button" data-bs-toggle="dropdown" aria-expanded="false">CITY</a>
              <ul className="dropdown-menu" aria-labelledby="ddElectric">
                <li><a className="dropdown-item text-end" href="#">Caféracer</a></li>
                <li><a className="dropdown-item text-end" href="#">Robyn</a></li>
              </ul>
            </li>
           <li className="nav-item dropdown text-end">
              <a className="nav-link dropdown-toggle" href="#" id="ddElectric" role="button" data-bs-toggle="dropdown" aria-expanded="false">KIDS</a>
              <ul className="dropdown-menu" aria-labelledby="ddElectric">
                <li><a className="dropdown-item text-end" href="#">El Bear</a></li>
                <li><a className="dropdown-item text-end" href="#">El Robin</a></li>
              </ul>
            </li>
            <li className="nav-item">
              <a className="nav-link text-end" href="#">ACCESSORIES</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-end" href="#">STORES</a>
            </li>
           <li className="nav-item dropdown text-end">
              <a className="nav-link dropdown-toggle" href="#" id="ddElectric" role="button" data-bs-toggle="dropdown" aria-expanded="false">LEASING</a>
              <ul className="dropdown-menu" aria-labelledby="ddElectric">
                <li><a className="dropdown-item text-end" href="#">Private</a></li>
                <li><a className="dropdown-item text-end" href="#">Business</a></li>
              </ul>
            </li>
          </ul>

    <ul className="navbar-nav ms-auto align-items-center">
      <li className="nav-item">
        <a className="nav-link" href="/signin" title="Sign in">
            <img src="img/header/user.svg" alt="Sign in" className="icon-sm" />
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="/cart" title="Cart">
            <img src="img/header/cart.svg" alt="Cart" className="icon-lg " />
        </a>
      </li>
    </ul>
          
        </div>
      </div>
    </nav>
</>
    );
};

export default Nav;

export default ({ currentUser }) => {

    const links = [
        !currentUser && { label: 'Sign Up', href: '/auth/signup' },
        !currentUser && { label: 'Sign In', href: '/auth/signin' },
        currentUser && { label: 'Sign Out', href: '/auth/signout' }
    ]
        .filter(linkConfig => linkConfig)
        .map(({ label, href }) => {
            return (
                <li className="nav-item" key={href}>
                    <a className="nav-link" href={href}>
                        {label}
                    </a>
                </li>
            );
        });

  return (
    <nav className="navbar navbar-light bg-light px-5 mb-4">
      <a className="navbar-brand" href="/">
        GitTix
      </a>
      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">
          {links}
        </ul>
      </div>
    </nav>
  );
};
 
import 'bootstrap/dist/css/bootstrap.css';
import buildClient from "../api/build-client";
import Header from "../components/header";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  let currentUser = null;

  try {
    const { data } = await client.get('/api/users/currentuser');
    currentUser = data.currentUser;
  } catch (err) {
    currentUser = null;
  }

  const pageProps = appContext.Component.getInitialProps
    ? await appContext.Component.getInitialProps(appContext.ctx, client, currentUser)
    : {};

  return {
    pageProps,
    currentUser
  };
};

export default AppComponent;
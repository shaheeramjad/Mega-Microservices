import buildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are NOT signed in</h1>
  );
};

LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);
  try {
    const { data } = await client.get('/api/users/currentuser');
    return { currentUser: data.currentUser };
  } catch (err) {
    return { currentUser: null };
  }
};

export default LandingPage;
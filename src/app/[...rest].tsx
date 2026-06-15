import { Redirect } from 'expo-router';

// Any deep link (e.g. nfcpoc1://tap) that doesn't match a real route still
// shows the counter. The tap is counted in the root layout, not here.
export default function CatchAll() {
  return <Redirect href="/" />;
}

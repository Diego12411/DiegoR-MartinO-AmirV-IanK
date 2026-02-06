import { Link } from "react-router";

export default function HomePage() {
  return (
    <div>
      <h1>Home</h1>
      <Link to="/form">Go to form</Link>
    </div>
  );
}

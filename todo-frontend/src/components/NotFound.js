import { Link } from "react-router-dom";
function NotFound() {
  return (
    <div title="Not Found">
      <div className="text-center">
        <h2>Whoops, we cannot find that page.</h2>
        <p>
          You can always visit the <Link to="/">homepage</Link>
        </p>
      </div>
    </div>
  );
}

export default NotFound;

import { useEffect, useState } from 'react';
import './App.css';
import service from './service';
import worker from './app.worker';
import WebWorker from './WebWorker';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const webWorker = new WebWorker(worker);

  useEffect(() => {
    service().then(users => {
      setUsers(users);
      setIsLoading(false);
    })
  }, [])

  const sortAscending = () => {
    // const usersSort = users.sort((a, b) => a.commentCount - b.commentCount);
    // setUsers(usersSort)
    
    webWorker.postMessage({users, type: 'asc'});

    setIsSorting(true);

    webWorker.addEventListener('message',(e) => {
      const newList = e.data;
      setUsers(newList);
      setIsSorting(false);
    })
    return 
  }

  const sortDescending = () => {
    // const usersSort = users.sort((a, b) => b.commentCount - a.commentCount);
    // setUsers(usersSort)

    webWorker.postMessage({users, type: 'desc'});

    setIsSorting(true);

    webWorker.addEventListener('message',(e) => {
      const newList = e.data;
      setUsers(newList);
      setIsSorting(false);
    })
    return 
  }

  const renderUsers = () => {
    return users.map((user, index) => {
      return (
        <div key={index} className="card mt-4 mb-4">
          <div className="card-header">
            {user.name}
          </div>
          <div className="card-body">
            <h5 className="card-title">
              {user.email}
            </h5>
            <p className="card-text">
              {user.joinedOn.toString()}
            </p>

          </div>
          <div className="card-footer text-muted">
            {user.commentCount} comments
          </div>
        </div>
      );
    });
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="btn-group mr-2 mt-2" role="group" aria-label="Basic example">
            <button
              onClick={sortAscending}
              type="button"
              disabled={isLoading}
              className="btn btn-primary">
              Sort Ascending Number of Comments
            </button>
          </div>


          <div className="btn-group mt-2" style={{ marginLeft: '10px' }} role="group" aria-label="Basic example">
            <button
              onClick={sortDescending}
              type="button"
              disabled={isLoading}
              className="btn btn-success">
              Sort Descending Number of Comments
            </button>
          </div>
        </div>
      </div>

      {isSorting && <div className="mt-4">
        Sorting ...
      </div>}

      {isLoading &&
        <div className="mt-4">
          Loading ...
        </div>
      }

      {!isLoading &&
        <div className="col-md-12">
          {renderUsers()}
        </div>
      }
    </div>
  );
}

export default App;

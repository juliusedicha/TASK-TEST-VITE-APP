import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../authContext";
import { useNavigate } from "react-router-dom";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const VideoItem = ({ id, index, moveVideo, title, description }) => {
  const ref = React.useRef(null);

  const [, drop] = useDrop({
    accept: 'VIDEO',
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      moveVideo(dragIndex, hoverIndex);
      item.index = hoverIndex;
    }
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'VIDEO',
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  drag(drop(ref));

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <p>{description}</p>
    </div>
  );
};

const AdminDashboardPage = () => {
  const { state, dispatch } = useContext(AuthContext);
  const [videos, setVideos] = useState([]);
  const [currentPage, setCurrentPage] = useState(() => {
    const storedPage = parseInt(localStorage.getItem("currentPage"));
    return storedPage || 1;
  });
  const limitPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchVideos();
  }, [currentPage]);

  useEffect(() => {
    const storedVideos = localStorage.getItem("videos");
    if (storedVideos) {
      setVideos(JSON.parse(storedVideos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("currentPage", currentPage);
  }, [currentPage]);

  const fetchVideos = async () => {
    try {
      const response = await fetch(
        "https://reacttask.mkdlabs.com/v1/api/rest/video/PAGINATE",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-project": "cmVhY3R0YXNrOmQ5aGVkeWN5djZwN3p3OHhpMzR0OWJtdHNqc2lneTV0Nw==",
            "Authorization": `Bearer ${state.token}`
          },
          body: JSON.stringify({
            payload: {},
            page: currentPage,
            limit: limitPerPage
          })
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch videos");
      }

      const data = await response.json();
      setVideos(data.list.map((video, index) => ({ ...video, index })));
      localStorage.setItem("videos", JSON.stringify(data.list));
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  const moveVideo = (dragIndex, hoverIndex) => {
    const draggedVideo = videos[dragIndex];
    const newVideos = [...videos];
    newVideos.splice(dragIndex, 1);
    newVideos.splice(hoverIndex, 0, draggedVideo);
    setVideos(newVideos);
    localStorage.setItem("videos", JSON.stringify(newVideos));
  };

  const loadNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const loadPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <h1 className="text-3xl font-semibold mb-4">Admin Dashboard</h1>
        <div className="grid grid-cols-2 gap-4">
          {videos.map((video) => (
            <div key={video.id} className="border p-4">
              <VideoItem
                id={video.id}
                index={video.index}
                moveVideo={moveVideo}
                title={video.title}
                description={video.description}
              />
            </div>
          ))}
        </div>
        <div className="mt-4">
          <button
            onClick={loadPrevPage}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600 focus:outline-none"
          >
            Previous Page
          </button>
          <button
            onClick={loadNextPage}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
          >
            Next Page
          </button>
        </div>
      </div>
    </DndProvider>
  );
};

export default AdminDashboardPage;

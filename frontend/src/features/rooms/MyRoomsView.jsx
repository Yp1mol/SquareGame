import React from 'react';
import { Link } from 'react-router-dom';
import { useMyRooms } from './hooks/useMyRooms';

export default function MyRoomsView() {
  const { rooms, handleJoinRoom, handleDeleteRoom } = useMyRooms();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link to="/home" className="text-blue-500 hover:text-blue-600">
            ← Back to Home
          </Link>
          <Link to="/createroom" className="bg-green-500 text-white px-4 py-2 rounded">
            Create New Room
          </Link>
        </div>

        <h1 className="text-2xl font-bold mb-6 dark:text-white">Available Rooms</h1>

        {rooms.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No your rooms. Create one!
          </div>
        ) : (
          <div className="grid gap-4">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow flex justify-between items-center"
              >
                <div>
                  <div className="font-mono font-bold text-lg dark:text-white">
                    {room.code}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Host: {room.owner.username || 'Unknown'}
                  </div>
                  <div className="text-sm font-bold text-yellow-500">
                    Cost: {room.cost}
                  </div>
                </div>
                <button
                  onClick={() => handleJoinRoom(room.code)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Join Room
                </button>
                <button
                  onClick={() => handleDeleteRoom(room.code)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete Room
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
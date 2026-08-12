import React from 'react';
import { Link } from 'react-router-dom';
import { useMyRooms } from './hooks/useMyRooms';
import 'react-loading-skeleton/dist/skeleton.css';
import SkeletonRoom from './skeleton/skeletomRoom';

const STATUS = {
  0: 'Waiting for players',
  2: 'Host ready',
  3: 'Guest ready',
  5: 'In progress',
  10: 'Host won',
  11: 'Guest won',
  12: 'Draw',
};

export default function MyRoomsView() {
  const { rooms, handleJoinRoom, handleDeleteRoom, handleLeaveRoom, user, loading } = useMyRooms();

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
        {loading ? (
          <div className="space-y-4">
            <SkeletonRoom type="my" />
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No your rooms. Create one!
          </div>
        ) : (
          <div className="grid gap-4">
            {rooms.map((room) => {
              const isOwner = room.ownerId === user?.id;
              const isGuest = room.guestId === user?.id;
              const canLeave = isGuest && !room.guestReady;

              return (
                <div key={room.id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow flex justify-between items-center">
                  <div>
                    <div className="font-mono font-bold text-lg dark:text-white">{room.code}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Host: {room.owner?.username || 'Unknown'}</div>
                    <div className="text-sm font-bold text-yellow-500">Cost: {room.cost}</div>
                    <div className="text-xs text-gray-400"> Status: {STATUS[room.statusId]} </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleJoinRoom(room.code)} className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                      Enter
                    </button>
                    {isOwner && (
                      <button onClick={() => handleDeleteRoom(room.code)} className="cursor-pointer bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                        Delete
                      </button>
                    )}
                    {canLeave && (
                      <button onClick={() => handleLeaveRoom(room.code)} className="cursor-pointer bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
                        Leave
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
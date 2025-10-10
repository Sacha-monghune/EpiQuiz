"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

type Room = {
    id: number;
    name: string;
    started: boolean;
    users: any[];
};

export default function Rooms() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const router = useRouter();

//     useEffect(() => {
//         const fetchRooms = async () => {
//             try {
//                 const res = await fetch("http://10.49.84.163:4000/room", {
//                     method: "GET",
//                     credentials: "include",
//                 });
//                 if (!res.ok) throw new Error("Erreur API");
//                 const data = await res.json();
//                 setRooms(data);
//             } catch (err) {
//                 console.error("Erreur lors de la récupération des rooms:", err);
//             }
//         };
//         fetchRooms();
//     }, []);

//     const handleJoinRoom = async (idRoom: number) => {
//     try {
//         const res = await fetch(`http://10.49.84.163:4000/room/${idRoom}/join`, {
//             method: "PATCH",
//             headers: { "Content-Type": "application/json" },
//             credentials: "include",
//         });
//         if (!res.ok) throw new Error("Erreur en rejoignant la room");
//         const room = await res.json();
//         console.log("Rejoint la room:", room);

//         router.push(`/room/${idRoom}`);
//     } catch (err) {
//         console.error("Erreur en rejoignant la room:", err);
//     }
// };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Rooms créées</h2>
            <ul>
                {rooms.map(room => (
                    <li key={room.id} className="mb-4 flex items-center justify-between">
                        <div>
                            <span className="font-semibold">{room.name}</span>
                            {room.started ? " (Démarrée)" : " (En attente)"}
                            <span className="ml-2 text-gray-500">
                                Joueurs: {room.users.length}
                            </span>
                        </div>
                        <button
                            // onClick={() => handleJoinRoom(room.id)}
                            className="ml-4 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Rejoindre
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

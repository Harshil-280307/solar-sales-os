"use client";

import { useEffect, useState } from "react";

export default function FollowUps() {
  const [leads, setLeads] = useState([]);

  const fetchLeads = () => {
    fetch("http://127.0.0.1:8000/follow-ups")
      .then((res) => res.json())
      .then((data) => setLeads(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const sendFollowUp = async (id) => {
    try {
      await fetch(
        `http://127.0.0.1:8000/send-followup/${id}`,
        {
          method: "POST",
        }
      );

      fetchLeads();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "hot":
        return "bg-red-100 text-red-700";

      case "warm":
        return "bg-yellow-100 text-yellow-700";

      case "cold":
        return "bg-blue-100 text-blue-700";

      case "closed":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl text-white font-bold">
          Follow-Up Management
        </h1>

        <p className="text-white mt-2">
          Track and manage pending customer follow-ups.
        </p>
      </div>

      {leads.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-10 text-center">
          <h2 className="text-2xl font-semibold">
            No Follow-Ups Pending 🎉
          </h2>

          <p className="text-gray-500 mt-2">
            All leads are up to date.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {leads.map((lead) => (
            <div
              key={lead.id}
              className="bg-white rounded-xl shadow p-6"
            >
              <div className="flex justify-between items-start">

                <div>
                  <h2 className="text-xl font-bold">
                    {lead.name}
                  </h2>

                  <p className="text-gray-500">
                    {lead.phone}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    lead.status
                  )}`}
                >
                  {lead.status}
                </span>

              </div>

              <div className="mt-6">

                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">
                    Follow-Ups Done
                  </span>

                  <span className="font-bold">
                    {lead.follow_up_count}/3
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">

                  <div
                    className="bg-blue-600 h-3 rounded-full"
                    style={{
                      width: `${
                        (lead.follow_up_count / 3) * 100
                      }%`,
                    }}
                  />

                </div>

              </div>

              <button
                onClick={() =>
                  sendFollowUp(lead.id)
                }
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
              >
                Send Follow-Up
              </button>

            </div>
          ))}

        </div>
      )}
    </div>
  );
}
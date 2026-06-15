"use client";

import { useEffect, useState } from "react";

export default function LeadsPage() {
const [leads, setLeads] = useState([]);
const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] = useState("all");

const [editingLead, setEditingLead] = useState(null);

const [editForm, setEditForm] = useState({
name: "",
phone: "",
bill: "",
});

const fetchLeads = () => {
fetch("http://127.0.0.1:8000/leads")
.then((res) => res.json())
.then((data) => setLeads(data))
.catch((err) => console.error(err));
};

useEffect(() => {
fetchLeads();
}, []);

const updateStatus = async (id, status) => {
try {
await fetch(
`http://127.0.0.1:8000/update-status/${id}?status=${status}`,
{
method: "PUT",
}
);


  setLeads((prev) =>
    prev.map((lead) =>
      lead.id === id ? { ...lead, status } : lead
    )
  );
} catch (err) {
  console.error(err);
}


};

const deleteLead = async (id) => {
const confirmDelete = window.confirm(
"Delete this lead?"
);


if (!confirmDelete) return;

try {
  await fetch(
    `http://127.0.0.1:8000/delete-lead/${id}`,
    {
      method: "DELETE",
    }
  );

  setLeads((prev) =>
    prev.filter((lead) => lead.id !== id)
  );
} catch (err) {
  console.error(err);
}


};

const openEditModal = (lead) => {
setEditingLead(lead);


setEditForm({
  name: lead.name,
  phone: lead.phone,
  bill: lead.bill,
});


};

const saveEdit = async () => {
try {
await fetch(
`http://127.0.0.1:8000/update-lead/${editingLead.id}`,
{
method: "PUT",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify(editForm),
}
);


  fetchLeads();

  setEditingLead(null);
} catch (err) {
  console.error(err);
}


};

const filteredLeads = leads.filter((lead) => {
const matchSearch = (lead.name || "")
.toLowerCase()
.includes(search.toLowerCase());


const matchStatus =
  statusFilter === "all" ||
  lead.status === statusFilter;

return matchSearch && matchStatus;


});

return ( <div className="max-w-7xl mx-auto text-white">


  <div className="mb-8">
    <h1 className="text-4xl font-bold">
      Leads Management
    </h1>

    <p className="text-slate-400 mt-2">
      Manage all customer leads.
    </p>
  </div>

  <div className="bg-slate-900 rounded-xl shadow-lg p-4 mb-6 border border-slate-800">

    <div className="flex flex-col md:flex-row gap-4">

      <input
        type="text"
        placeholder="Search Customer..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="bg-slate-800 border border-slate-700 p-3 rounded-lg flex-1"
      />

      <select
        value={statusFilter}
        onChange={(e) =>
          setStatusFilter(e.target.value)
        }
        className="bg-slate-800 border border-slate-700 p-3 rounded-lg"
      >
        <option value="all">All Status</option>
        <option value="new">New</option>
        <option value="hot">Hot</option>
        <option value="warm">Warm</option>
        <option value="cold">Cold</option>
        <option value="contacted">Contacted</option>
        <option value="closed">Closed</option>
        <option value="lost">Lost</option>
      </select>

    </div>

  </div>

  <div className="bg-slate-900 rounded-xl shadow-lg overflow-hidden border border-slate-800">

    <table className="w-full">

      <thead className="bg-slate-800">

        <tr>
          <th className="p-4 text-left">
            Name
          </th>

          <th className="p-4 text-left">
            Phone
          </th>

          <th className="p-4 text-left">
            Bill
          </th>

          <th className="p-4 text-left">
            Status
          </th>

          <th className="p-4 text-left">
            Actions
          </th>
        </tr>

      </thead>

      <tbody>

        {filteredLeads.length > 0 ? (
          filteredLeads.map((lead) => (
            <tr
              key={lead.id}
              className="border-b border-slate-800 hover:bg-slate-800/50"
            >
              <td className="p-4">
                {lead.name}
              </td>

              <td className="p-4">
                {lead.phone}
              </td>

              <td className="p-4">
                ₹{lead.bill}
              </td>

              <td className="p-4">

                <select
                  value={lead.status}
                  onChange={(e) =>
                    updateStatus(
                      lead.id,
                      e.target.value
                    )
                  }
                  className="bg-slate-800 border border-slate-700 p-2 rounded-lg"
                >
                  <option value="new">New</option>
                  <option value="hot">Hot</option>
                  <option value="warm">Warm</option>
                  <option value="cold">Cold</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                  <option value="lost">Lost</option>
                </select>

              </td>

              <td className="p-4">

                <div className="flex gap-2">

                  <button
                    onClick={() =>
                      openEditModal(lead)
                    }
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteLead(lead.id)
                    }
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>

                  <button onClick={() =>
                      window.open(
                        `http://127.0.0.1:8000/generate-proposal/${lead.id}`,
                        "_blank"
                      )
                    }
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
                  >
                    PDF
                  </button>

                </div>

              </td>

            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={5}
              className="text-center p-8 text-slate-400"
            >
              No leads found
            </td>
          </tr>
        )}

      </tbody>

    </table>

  </div>

  {editingLead && (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

      <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-md shadow-2xl">

        <h2 className="text-2xl font-bold mb-6">
          Edit Lead
        </h2>

        <input
          value={editForm.name}
          onChange={(e) =>
            setEditForm({
              ...editForm,
              name: e.target.value,
            })
          }
          placeholder="Customer Name"
          className="w-full p-3 rounded-lg mb-4 bg-slate-800 border border-slate-700"
        />

        <input
          value={editForm.phone}
          onChange={(e) =>
            setEditForm({
              ...editForm,
              phone: e.target.value,
            })
          }
          placeholder="Phone Number"
          className="w-full p-3 rounded-lg mb-4 bg-slate-800 border border-slate-700"
        />

        <input
          value={editForm.bill}
          onChange={(e) =>
            setEditForm({
              ...editForm,
              bill: e.target.value,
            })
          }
          placeholder="Monthly Bill"
          className="w-full p-3 rounded-lg mb-6 bg-slate-800 border border-slate-700"
        />

        <div className="flex justify-end gap-3">

          <button
            onClick={() =>
              setEditingLead(null)
            }
            className="px-4 py-2 rounded-lg bg-slate-700"
          >
            Cancel
          </button>

          <button
            onClick={saveEdit}
            className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700"
          >
            Save Changes
          </button>

        </div>

      </div>

    </div>
  )}

</div>


);
}

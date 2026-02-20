// //TIPP session log viewing and deleting functionality

const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/login.html";
}

async function deleteLog(logId) {
  console.log("FE: DELETE /api/log/:logId");
  try {
    const response = await fetch(`/api/log/${logId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("FE: Failed to DELETE log data: ", response.status);
      return;
    }
    const data = await response.json().catch(() => {});
    console.log("Success! Response: ", data);
  } catch (err) {
    console.error("Network error patching log: ", err);
  }
}

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let logData = [];

async function fetchAndRender() {
  const token = localStorage.getItem("token");
  const res = await fetch("/api/log/all", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  logData = data.logs;
  renderAgenda();
}

function renderAgenda() {
  const container = document.getElementById("agendaView");
  const display = document.getElementById("monthYearDisplay");
  container.innerHTML = "";

  display.innerText = new Date(currentYear, currentMonth).toLocaleString(
    "default",
    { month: "long", year: "numeric" },
  );

  const filteredLogs = logData
    .filter((log) => {
      const d = new Date(log.timestamp);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  if (filteredLogs.length === 0) {
    container.innerHTML = `<div class="text-center text-white py-5">No sessions recorded for this month.</div>`;
    return;
  }

  const grouped = {};
  filteredLogs.forEach((log) => {
    const dateKey = new Date(log.timestamp).toLocaleDateString(undefined, {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(log);
  });

  for (const [date, sessions] of Object.entries(grouped)) {
    const dateSection = document.createElement("div");
    dateSection.className = "mb-4";

    dateSection.innerHTML = `
            <div class="sticky-top py-2 text-primary fw-bold">
                ${date}
            </div>
            <div class="list-group list-group-flush mt-2">
                ${sessions.map((log) => renderAgendaItem(log)).join("")}
            </div>
        `;
    container.appendChild(dateSection);
  }
}

function renderAgendaItem(log) {
  const date = new Date(log.timestamp).toDateString();
  const time = new Date(log.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const distressChange = (log.distressAfter || 0) - (log.distressBefore || 0);

  return `
<div class="list-group-item bg-dark text-white p-3 rounded mb-2">
  <div class="row align-items-center text-start">
    <div class="col-auto d-flex flex-column gap-1">
      <span class="badge bg-primary" style="min-width: 80px;">${date}</span>
      <span class="badge bg-primary" style="min-width: 80px;">${time}</span>
    </div>

    <div class="col">
      <div>
        Distress: ${log.distressBefore ?? "X"} → ${log.distressAfter ?? "X"} 
        <span class="ms-2">
          (${distressChange})
        </span>
      </div>
      <div class="small text-info mb-1">
        Emotion: <span class="text-white">${log.emotionBefore || 'None'}</span> 
        → <span class="text-white">${log.emotionAfter || 'None'}</span>
      </div>
      <div class="text-white-50 small">
        ${log.tempTime ? `Temp: ${log.tempTime}s | ` : ""}
        ${log.exerciseTime ? `Exercise: ${log.exerciseTime}s | ` : ""}
        ${log.breathingTime ? `Breathing: ${log.breathingTime}s | ` : ""}
        ${log.relaxationTime ? `Relaxation: ${log.relaxationTime}s | ` : ""}
      </div>
    </div>

    <div class="col-auto d-flex gap-2">
      <button class="btn btn-outline-primary btn-sm" onclick="openEditModal('${log._id}')">
        <i class="bi bi-pencil"></i>
      </button>
      <button class="btn btn-outline-danger btn-sm" onclick="handleDelete('${log._id}')">
        <i class="bi bi-trash"></i>
      </button>
    </div>
  </div>
</div>
`;
}

window.handleDelete = async function (logId) {
  if (confirm("Are you sure you want to delete this session log?")) {
    await deleteLog(logId);

    logData = logData.filter((log) => log._id !== logId);

    renderAgenda();
  }
};

document.getElementById("prevMonth").addEventListener("click", () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderAgenda();
});

document.getElementById("nextMonth").addEventListener("click", () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderAgenda();
});

window.openEditModal = function (logId) {
  const log = logData.find((l) => l._id === logId);
  if (!log) return;

  document.getElementById("editEmotionBefore").value = log.emotionBefore || "";
document.getElementById("editEmotionAfter").value = log.emotionAfter || "";
  document.getElementById("editLogId").value = logId;
  document.getElementById("editDistressBefore").value =
    log.distressBefore || "";
  document.getElementById("editDistressAfter").value = log.distressAfter || "";
  document.getElementById("editTemp").value = log.tempTime || 0;
  document.getElementById("editExercise").value = log.exerciseTime || 0;
  document.getElementById("editBreathing").value = log.breathingTime || 0;
  document.getElementById("editRelaxation").value = log.relaxationTime || 0;

  if (window.$) {
    window.$("#editModal").modal("show");
  } else {
    console.error("jQuery is not loaded!");
  }
};

window.submitEdit = async function () {
  const logId = document.getElementById("editLogId").value;
  const updatedData = {
  distressBefore: Number(document.getElementById("editDistressBefore").value),
  distressAfter: Number(document.getElementById("editDistressAfter").value),
  emotionBefore: document.getElementById("editEmotionBefore").value || null,
  emotionAfter: document.getElementById("editEmotionAfter").value || null,
  temperatureTime: Number(document.getElementById("editTemp").value),
  intenseExerciseTime: Number(document.getElementById("editExercise").value),
  breathingTime: Number(document.getElementById("editBreathing").value),
  relaxationTime: Number(document.getElementById("editRelaxation").value),
};

  try {
    const response = await fetch(`/api/log/${logId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (response.ok) {
      const index = logData.findIndex((l) => l._id === logId);
      logData[index] = {
        ...logData[index],
        ...updatedData,
        distressAfter: updatedData.distressLevel,
      };

      if (window.$) {
        window.$("#editModal").modal("hide");
      }

      renderAgenda();
    } else {
      alert("Failed to update log.");
    }
  } catch (err) {
    console.error("Error updating log:", err);
  }
};

fetchAndRender();

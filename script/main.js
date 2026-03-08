let allIssues = [];

const manageSpinner = (status) => {
  if (status === true) {
    document.getElementById("loading-spinner").classList.remove("hidden");
    document.getElementById("issue-container").classList.add("hidden");
  } else {
    document.getElementById("loading-spinner").classList.add("hidden");
    document.getElementById("issue-container").classList.remove("hidden");
  }
};

const loadIssues = async () => {
  manageSpinner(true);

  const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
  const result = await res.json();
  allIssues = result.data;
  displayIssues(allIssues);
  document.getElementById("total-issue-count").innerText = allIssues.length;
  manageSpinner(false);
};

const loadingSingleIssue = async (id) => {
  const url = `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`;
  const res = await fetch(url);
  const result = await res.json();
  displayIssueDetails(result.data);
};

const displayIssueDetails = (issue) => {
  const modalContent = document.getElementById("details-container");

  if (modalContent) {
    modalContent.innerHTML = `
            <h2 class="text-3xl font-bold">${issue.title}</h2>
          <div class="flex items-center gap-2 mb-6 text-sm text-gray-600">
            <span class="font-bold text-xs rounded-full text-white px-3 py-1 ${issue.status === "open" ? "bg-[#00A96E]" : "bg-[#8B5CF6]"}">
                ${issue.status === "open" ? "Opened" : "Closed"}
            </span>
            <span> • Opened by <span class=" text-gray-700">${issue.author}  </span>   •  ${new Date(issue.createdAt).toLocaleDateString()}</span>
          </div>

         <div class="flex flex-wrap gap-2"> ${issue.labels
              .map(
                (label) => `
                <span class="px-2 py-1 bg-amber-100 text-amber-600 text-[10px] rounded-md font-bold uppercase"># ${label}</span>`,
              )
              .join("")} </div>

          <p class="text-lg mb-8 text-[#64748B]">${issue.description}</p>

          <div class="grid grid-cols-2 p-6 rounded-xl bg-gray-50 gap-4">
            <div>
              <p class="text-gray-400 text-sm font-medium mb-1">Assignee:</p>
              <p class="font-bold text-lg text-[#1F2937]">${issue.author}</p>
            </div>
            <div>
            <p class="text-gray-400 text-sm font-medium mb-1">Priority:</p>
                <span class="px-4 py-1 ${issue.priority.toLowerCase() === "high" ? "bg-red-500" : "bg-amber-500"} text-white text-xs font-bold rounded-full uppercase inline-block">
                    ${issue.priority}
                </span>
            </div>
          </div>
    `;

    document.getElementById("issue_modal").showModal();
  }
};



const displayIssues = (issues) => {
  const IssueContainer = document.getElementById("issue-container");

  if (IssueContainer) {
    IssueContainer.innerHTML = "";

    issues.forEach((issue) => {
      const card = document.createElement("div");
      card.setAttribute("onclick", `loadingSingleIssue('${issue.id}')`);
      const isOpen = issue.status === "open";
      const borderColor = isOpen ? "border-green-500" : "border-purple-500";
      const iconClass = isOpen ? "fa-circle-check" : "fa-circle-xmark";
      const isColor = isOpen ? "text-green-500" : "text-purple-500";
      const iconBg = isOpen ? "bg-white" : "bg-[#F5F3FF]";

      let badgeColor = "";
      const priority = issue.priority.toLowerCase();
      if (priority === "high") {
        badgeColor = "bg-red-100 text-red-600";
      } else if (priority === "medium") {
        badgeColor = "bg-amber-100 text-amber-600";
      } else if (priority === "low") {
        badgeColor = "bg-gray-100 text-gray-600";
      }

      card.className = `bg-white border-t-4 ${borderColor} rounded-2xl shadow-sm p-6 flex flex-col gap-4`;

      card.innerHTML = `
        
            <div class="flex justify-between items-start">
                <div class="w-10 h-10 ${iconBg} rounded-full flex items-center justify-center ${isColor}">
            <i class="fa-solid ${iconClass} text-xl"></i>
                </div>
                <span class="px-3 py-1 ${badgeColor} text-[10px] font-bold rounded-full uppercase">${issue.priority}</span>
            </div>

            <div>
                <h3 class="text-lg font-bold text-[#1F2937]">
                    ${issue.title}
                </h3>
                <p class="text-[#64748B] text-sm mt-2 line-clamp-2">${issue.description}</p>
                </div>
            <div class="flex flex-wrap gap-2"> ${issue.labels
              .map(
                (label) => `
                <span class="px-2 py-1 bg-amber-100 text-amber-600 text-[10px] rounded-md font-bold uppercase"># ${label}</span>`,
              )
              .join("")} </div>
                <hr class="border-slate-100">
                <div class="flex justify-between items-center text-slate-400 text-[11px] font-semibold">
        <span>#${issue.id} by ${issue.author}</span>
        <span>${new Date(issue.createdAt).toLocaleDateString()}</span>
    </div>
    </div>
            `;
      IssueContainer.appendChild(card);
    });
  }
};

const updateCount = (number) => {
  const countElement = document.getElementById("total-issue-count");
  if (countElement) {
    countElement.innerText = number;
  }
};

const setActiveButton = (buttonId) => {
  const buttonIds = ["all-btn", "open-btn", "closed-btn"];
  buttonIds.forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.classList.remove("bg-[#4A00FF]", "text-white");
      btn.classList.add("bg-white", "text-black");
    }
  });

  const activeBtn = document.getElementById(buttonId);
  if (activeBtn) {
    activeBtn.classList.add("bg-[#4A00FF]", "text-white");
    activeBtn.classList.remove("bg-white", "text-black");
  }
};

document.getElementById("all-btn").addEventListener("click", function () {
  setActiveButton("all-btn");
  displayIssues(allIssues);
  updateCount(allIssues.length);
});

document.getElementById("open-btn").addEventListener("click", function () {
  setActiveButton("open-btn");
  const openIssues = allIssues.filter((issue) => issue.status === "open");
  displayIssues(openIssues);
  updateCount(openIssues.length);
});

document.getElementById("closed-btn").addEventListener("click", function () {
  setActiveButton("closed-btn");
  const closedIssues = allIssues.filter((issue) => issue.status === "closed");
  displayIssues(closedIssues);
  updateCount(closedIssues.length);
});

loadIssues();

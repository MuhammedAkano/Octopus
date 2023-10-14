document.addEventListener("DOMContentLoaded", function () {
    const url = "/static/data/user_data.json";
    let finalData;
    const tableBody = document.querySelector("#userData tbody");

    // Function to update the table with data
    function updateTable(data) {
        tableBody.innerHTML = ""; // Clear the table body

        data.user_data.forEach((user) => {
            user.data.forEach((workData, index) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${user.userid}</td>
                    <td class="editable" contenteditable="true">${workData["work-type"]}</td>
                    <td class="editable" contenteditable="true">${workData.aggregates.daily.current}</td>
                    <td class="editable" contenteditable="true">${workData.aggregates.daily.previous}</td>
                    <td class="editable" contenteditable="true">${workData.aggregates.weekly.current}</td>
                    <td class="editable" contenteditable="true">${workData.aggregates.weekly.previous}</td>
                    <td class="editable" contenteditable="true">${workData.aggregates.monthly.current}</td>
                    <td class="editable" contenteditable="true">${workData.aggregates.monthly.previous}</td>
                `;
                tableBody.appendChild(row);
            });
        });

        // Add a single Save button after all rows
        const saveButton = document.createElement("button");
        saveButton.textContent = "Save All Changes";
        saveButton.style.display = "block";
        saveButton.style.margin = "0 auto";
        saveButton.style.border = "2px solid #007bff";
        saveButton.style.backgroundColor = "#007bff";
        saveButton.style.color = "#fff";
        saveButton.style.padding = "10px 20px";
        saveButton.style.cursor = "pointer";
        saveButton.style.marginTop = "20px";
        saveButton.addEventListener("click", saveAllChanges);
        tableBody.parentElement.appendChild(saveButton);
    }

    // Function to fetch data and update the table
    function fetchDataAndUpdateTable() {
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                finalData = data;
                updateTable(finalData);
            });
    }

    // Fetch and update the table when the page loads
    fetchDataAndUpdateTable();

    function saveAllChanges() {
        const rows = tableBody.querySelectorAll("tr");
        const updatedData = {};

        rows.forEach((row, index) => {
            const userid = row.querySelector("td:first-child").textContent;
            const workType = row.querySelector(".editable:nth-child(2)").textContent;
            const dailyCurrent = row.querySelector(".editable:nth-child(3)").textContent;
            const dailyPrevious = row.querySelector(".editable:nth-child(4)").textContent;
            const weeklyCurrent = row.querySelector(".editable:nth-child(5)").textContent;
            const weeklyPrevious = row.querySelector(".editable:nth-child(6)").textContent;
            const monthlyCurrent = row.querySelector(".editable:nth-child(7)").textContent;
            const monthlyPrevious = row.querySelector(".editable:nth-child(8)").textContent;

            const temp_data = {
                "work-type": workType,
                "aggregates": {
                    "daily": {
                        "current": dailyCurrent,
                        "previous": dailyPrevious
                    },
                    "weekly": {
                        "current": weeklyCurrent,
                        "previous": weeklyPrevious
                    },
                    "monthly": {
                        "current": monthlyCurrent,
                        "previous": monthlyPrevious
                    }
                }
            };

            if (!updatedData[userid]) {
                updatedData[userid] = [];
            }
            updatedData[userid].push({ index, temp_data });
        });

        // Send updatedData to the server for saving
        saveDataToServer(updatedData);
        console.log(updatedData);
    }

    // Function to save data to the server
    function saveDataToServer(updatedData) {
        // Send the updatedData to the server using a POST request to update the JSON file
        fetch('/save', {
            method: 'POST',
            body: JSON.stringify(updatedData),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.message === 'Data temporarily saved') {
                    alert('Changes saved successfully!');
                } else {
                    alert('Failed to save data');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while saving data');
            });
    }
});

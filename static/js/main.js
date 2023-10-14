document.addEventListener("DOMContentLoaded", function () {
    // Helper function to select a single element
    const qs = (param) => document.querySelector(param);
    // Helper function to select multiple elements
    const qsa = (param) => document.querySelectorAll(param);
    try {
        // Get references to various elements on the page
        const daily = qs("#daily");
        const weekly = qs("#weekly");
        const monthly = qs("#monthly");
        const logout = qs("#logout");
        const reviewrequest = qs("#reviewrequest");
        const worktypeArray = qsa(".worktype");
        const aggregateArray = qsa(".work-hrs");
        const lastaggregateArray = qsa(".work-hrs-span");

        // The following lines are currently commented out, not in use
        // const url = "/static/data/user_data.json";
        // const editedDataElement = document.getElementById("edited-data");
        // const editedDataJSON = editedDataElement.getAttribute("data-edited-data");
        // const editedData = JSON.parse(editedDataJSON);

        let currentView = "daily"; // Store the current view (daily, weekly, monthly)

        // Get the user ID from the session (assuming you have a 'userid' stored in the session)
        const useridElement = document.getElementById("userid");
        const userid = useridElement.getAttribute("userid-data");

        // Variables for storing data
        let finalData;
        let editedData;

        // Function to update the table with the selected view (daily, weekly, monthly)
        function updateTable(view) {
            if (finalData && finalData.data) {
                for (let index = 0; index < finalData.data.length; index++) {
                    worktypeArray[index].innerHTML = finalData.data[index]['work-type'];

                    // Check if edited data is available for the current user and use it if present
                    if (editedData && editedData[userid] && editedData[userid][index] && editedData[userid][index].temp_data) {
                        aggregateArray[index].innerHTML = editedData[userid][index].temp_data.aggregates[view].current;
                        lastaggregateArray[index].innerHTML = editedData[userid][index].temp_data.aggregates[view].previous;
                    } else {
                        aggregateArray[index].innerHTML = finalData.data[index].aggregates[view].current;
                        lastaggregateArray[index].innerHTML = finalData.data[index].aggregates[view].previous;
                    }
                }
            } else {
                // Handle the case where the data structure is not as expected
                console.error("Data structure is not as expected:", finalData);
            }
        }

        // Fetch edited data from the server
        fetch(`/edited_data`)
            .then((response) => response.json())
            .then((data) => {
                editedData = data;
                // Register click event listeners for the daily, weekly, and monthly buttons
                if (daily) {
                    daily.addEventListener("click", () => {
                        currentView = "daily";
                        updateTable(currentView);
                    });
                }
                if (weekly) {
                    weekly.addEventListener("click", () => {
                        currentView = "weekly";
                        updateTable(currentView);
                    });
                }
                if (monthly) {
                    monthly.addEventListener("click", () => {
                        currentView = "monthly";
                        updateTable(currentView);
                    });
                }
            });

        // Fetch user data for the specified user ID
        fetch(`/user-data/${userid}`)
            .then((response) => response.json())
            .then((data) => {
                finalData = data;
                // Register click event listeners for the daily, weekly, and monthly buttons
                if (daily) {
                    daily.addEventListener("click", () => {
                        currentView = "daily";
                        updateTable(currentView);
                    });
                }
                if (weekly) {
                    weekly.addEventListener("click", () => {
                        currentView = "weekly";
                        updateTable(currentView);
                    });
                }
                if (monthly) {
                    monthly.addEventListener("click", () => {
                        currentView = "monthly";
                        updateTable(currentView);
                    });
                }
            });

        // Additional fetch for edited data (please verify if this is needed)
        fetch(`/edited_data`)
            .then((response) => response.json())
            .then((data) => {
                editedData = data;
                // Register click event listeners for the daily, weekly, and monthly buttons
                if (daily) {
                    daily.addEventListener("click", () => {
                        currentView = "daily";
                        updateTable(currentView);
                    });
                }
                if (weekly) {
                    weekly.addEventListener("click", () => {
                        currentView = "weekly";
                        updateTable(currentView);
                    });
                }
                if (monthly) {
                    monthly.addEventListener("click", () => {
                        currentView = "monthly";
                        updateTable(currentView);
                    });
                }
            });

        // Logout event listener
        if (logout) {
            logout.addEventListener("click", () => {
                const logoutUrl = logout.getAttribute("data-logout-url");
                window.location.href = logoutUrl;
            });
        }

        // Review request event listener
        if (reviewrequest) {
            reviewrequest.addEventListener("click", () => {
                const reviewrequestUrl = reviewrequest.getAttribute("reviewrequest-url");
                window.location.href = reviewrequestUrl;
            });
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
});

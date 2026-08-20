const leaderboardContainer = document.getElementById("leaderboard");

let currentLeaderboard = "responses";

// Get leaderboard data from backend
async function getLeaderboard(type) {
    try {
        const response = await fetch(`/api/leaderboard?type=${type}`);

        if (!response.ok) {
            throw new Error("Failed to load leaderboard");
        }

        const data = await response.json();

        displayLeaderboard(data);
    } catch (error) {
        console.error(error);

        leaderboardContainer.innerHTML = `
            <p class="error">
                Unable to load leaderboard.
            </p>
        `;
    }
}


// Display leaderboard
function displayLeaderboard(users) {
    leaderboardContainer.innerHTML = "";

    if (users.length === 0) {
        leaderboardContainer.innerHTML = `
            <p>No leaderboard data available.</p>
        `;
        return;
    }

    users.forEach((user, index) => {
        const position = index + 1;

        const row = document.createElement("div");
        row.classList.add("leaderboard-row");

        row.innerHTML = `
            <div class="rank">
                ${position}
            </div>

            <div class="user-info">
                <span class="username">
                    ${escapeHTML(user.username)}
                </span>

                <span class="score">
                    ${user.score}
                </span>
            </div>
        `;

        leaderboardContainer.appendChild(row);
    });
}


// Switch leaderboard
function changeLeaderboard(type) {
    currentLeaderboard = type;

    // Update buttons
    document.querySelectorAll(".leaderboard-button")
        .forEach(button => {
            button.classList.remove("active");
        });

    document
        .querySelector(`[data-type="${type}"]`)
        ?.classList.add("active");

    getLeaderboard(type);
}


// Prevent usernames from injecting HTML
function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}


// Load default leaderboard
getLeaderboard(currentLeaderboard);
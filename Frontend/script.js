let isSimulating = false;

const processTime = async (road) => {
  try {
    const response = await fetch(`resources/traffic${road}.jpg`); //fetches the locally stored image
    const fileBlob = await response.blob(); // converts to blob - data type for representing file like objects
    //console.log(fileBlob.type) // to make sure type of file converted to blob is jpg and not some html format
    const file = new File([fileBlob], "traffic.jpg", { type: fileBlob.type });

    const formData = new FormData();
    formData.append("file", file);

    const postResponse = await fetch("http://127.0.0.1:5000/image", {
      method: "POST",
      body: formData,
    });
    console.log("--------------------------------");
    if (!postResponse.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await postResponse.json();
    console.log(data);

    return data;
  } catch (error) {
    console.error("Error in processTime : " + error.message);
  }
};

// code to display the fetched information on the info-panel
const displayInfo = async (road) => {
  let timeLeft = 0;

  try {
    const data = await processTime(road); // Await the response from processTime
    timeLeft = data.time;

    // Displays information on the info panel
    document.getElementById("displayProcessedTime").innerText = `${data.time}`;
    document.getElementById("displayCars").innerText = `${data.cars}`;
    document.getElementById("displayBuses").innerText = `${data.buses}`;
    document.getElementById("displayBikes").innerText = `${data.bikes}`;

    // change the color of yellow cards back to red
    if (road != 1) {
      document.getElementById(`road${road - 1}`).style.backgroundColor =
        "rgb(201, 70, 70)";
      document.getElementById(`roadn${road - 1}`).style.backgroundColor =
        "rgb(201, 70, 70)";
    }

    // change the color of card to green
    document.getElementById(`road${road}`).style.backgroundColor = "green";
    document.getElementById(`roadn${road}`).style.backgroundColor = "green";

    // for the countdown
    await startCountdown(timeLeft);

    // change the color of card to yellow
    document.getElementById(`road${road}`).style.backgroundColor =
      "rgb(209, 209, 0)";
    document.getElementById(`roadn${road}`).style.backgroundColor =
      "rgb(209, 209, 0)";
    await delay(2000);

    if (road == 4) {
      document.getElementById(`road${road}`).style.backgroundColor =
        "rgb(201, 70, 70)";
      document.getElementById(`roadn${road}`).style.backgroundColor =
        "rgb(201, 70, 70)";
    }
  } catch (error) {
    console.error("Error in displayInfo:", error.message);
  }
};

const startCountdown = (timeLeft) => {
  // timeLeft = 10;
  return new Promise((resolve) => {
    const updateTimer = () => {
      if (timeLeft > 0) {
        document.getElementById("displayCountdown").innerText = `${timeLeft}`;
        timeLeft--;
      } else {
        document.getElementById("displayCountdown").innerText = "--";
        clearInterval(timerInterval);
        resolve(); // Resolves the Promise when the countdown finishes
      }
    };
    const timerInterval = setInterval(updateTimer, 1000);
    updateTimer(); // Call once immediately to show the initial time
  });
};

const simulate = async () => {
  if (isSimulating) {
    console.log("Simulation already in progress.");
    return; // Prevent starting another simulation
  }

  isSimulating = true; // Set to true to indicate simulation has started
  console.log("Simulation started.");

  try {
    for (let i = 1; i <= 4; i++) {
      await displayInfo(i); // Simulate each road sequentially
    }
  } catch (error) {
    console.error("Error during simulation:", error.message);
  } finally {
    isSimulating = false; // Reset after simulation completes
    console.log("Simulation ended.");
  }
};

// dynamic delay function
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// event listener that starts the entire simulation on the click
document.getElementById("simulateBtn").addEventListener("click", async (event) => {
  event.preventDefault();
  await simulate(); // Call the simulation function
});

// const fu = async () => {
//   const response = await fetch(`resources/traffic3.jpg`);
//   const fileBlob = await response.blob(); // converts to blob - data type for representing file like objects

//   const file = new File([fileBlob], "image.jpg", { type: fileBlob.type });

//   const formData = new FormData();
//   formData.append("file", file);
//   const res = await fetch("http://127.0.0.1:5000/image", {
//     method: "POST",
//     body: formData,
//   });
//   const data = await res.json();
//   console.log(data);
// };
// // fu();


//simulate();


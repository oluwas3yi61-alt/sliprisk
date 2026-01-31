// Image preview
document.getElementById("slipImage").addEventListener("change", function(e){
  const file = e.target.files[0];
  if(!file) return;

  const reader = new FileReader();
  reader.onload = function(){
    document.getElementById("preview").innerHTML = `<img src="${reader.result}">`;
  };
  reader.readAsDataURL(file);
});

// Add slip row
function addSlip(){
  const slips = document.getElementById("slips");
  const div = document.createElement("div");
  div.className = "slip";
  div.innerHTML = `
    <input type="text" placeholder="Match (optional)">
    <input type="number" step="0.01" placeholder="Odds">
  `;
  slips.appendChild(div);
}

function analyze(){
  const slipRows = document.querySelectorAll(".slip");
  let slipData = [];
  let totalProbability = 1;

  slipRows.forEach(row => {
    const match = row.children[0].value || "Unnamed match";
    const odds = parseFloat(row.children[1].value);

    if(!odds || odds <= 1) return;

    const probability = 1 / odds;
    totalProbability *= probability;

    let risk = "Low";
    if(odds >= 3) risk = "High";
    else if(odds >= 2) risk = "Medium";

    slipData.push({ match, odds, probability, risk });
  });

  if(slipData.length === 0){
    document.getElementById("result").innerHTML = "<p>Please enter valid odds.</p>";
    return;
  }

  // Find riskiest leg
  slipData.sort((a,b)=>b.odds - a.odds);
  slipData[0].riskiest = true;

  let percent = (totalProbability * 100).toFixed(2);

  let breakdownHTML = slipData.map(item => `
    <div style="margin-bottom:10px;">
      <strong>${item.match}</strong><br>
      Odds: ${item.odds} | Probability: ${(item.probability*100).toFixed(1)}%<br>
      <span class="${
        item.risk === "High" ? "risk-high" :
        item.risk === "Medium" ? "risk-medium" : "risk-low"
      }">
        ${item.risk} Risk ${item.riskiest ? "⚠️ Riskiest Leg" : ""}
      </span>
    </div>
  `).join("");

  document.getElementById("result").innerHTML = `
    <h3>Slip Breakdown</h3>
    ${breakdownHTML}
    <hr>
    <p>Total implied probability: <strong>${percent}%</strong></p>
    <p style="font-size:12px;color:#9ca3af;">
      High-odds selections reduce overall probability significantly.
    </p>
  `;
}

  let totalProbability = probabilities.reduce((a,b)=>a*b,1);
  let percent = (totalProbability*100).toFixed(2);

  let riskText = "";
  let riskClass = "";

  if(percent < 5 || riskyCount >= 2){
    riskText = "Very High Risk Slip";
    riskClass = "risk-high";
  } 
  else if(percent < 15){
    riskText = "High Risk Slip";
    riskClass = "risk-high";
  }
  else if(percent < 35){
    riskText = "Medium Risk Slip";
    riskClass = "risk-medium";
  }
  else{
    riskText = "Lower Risk Slip (Still not guaranteed)";
    riskClass = "risk-low";
  }

  document.getElementById("result").innerHTML = `
    <h3>Risk Analysis</h3>
    <p>Total implied probability: <strong>${percent}%</strong></p>
    <p class="${riskClass}"><strong>${riskText}</strong></p>
    <p style="font-size:12px;color:#9ca3af;">
      This is a mathematical risk estimate based on odds, not predictions or match outcomes.
    </p>
  `;
}

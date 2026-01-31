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

// Analyze logic
function analyze(){
  const oddsInputs = document.querySelectorAll("input[type='number']");
  let probabilities = [];
  let highestOdds = 0;
  let riskyCount = 0;

  oddsInputs.forEach(input=>{
    const odds = parseFloat(input.value);
    if(!odds || odds <= 1) return;

    const p = 1 / odds;
    probabilities.push(p);

    if(odds > highestOdds) highestOdds = odds;
    if(odds >= 3) riskyCount++;
  });

  if(probabilities.length === 0){
    document.getElementById("result").innerHTML = "<p>Please enter valid odds.</p>";
    return;
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

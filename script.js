const fileInput=document.getElementById('fileInput');
const extractButton=document.getElementById('extractButton');

let extractedData=[];


async function extractData(){
    const file=fileInput.files[0]
    if(!file){
        alert('Please select an Excel file first.');
        return;
    }

    showLoader();

    const formData=new FormData();
    formData.append('file',file);

    try{
        const response=await fetch('https://excel-extractor-server-api.onrender.com/extract',{
            method:'POST',
            body:formData
        })
        const result=await response.json();

        showSuccess("Data extracted successfully!");
        hideLoader();

        if(!response.ok){
            throw new error(result.error||"file extraction failer");
        }

        extractedData=result.data;

        console.log('Columns',result.columns);
        console.log('Rows',result.rows);
        console.log('Records',result.data);


        document.getElementsByClassName("dataSection")[0].style.display="block";

        const table=document.getElementById('dataTable');

        const thead=document.createElement('thead');
        const headerRow=thead.insertRow();

        result.columns.forEach(column=>{
            const th=document.createElement('th');
            th.textContent=column;
            headerRow.appendChild(th);
        });

        const tbody=document.createElement('tbody');

        result.data.forEach(row=>{
            const bodyRow=tbody.insertRow();

            result.columns.forEach(column=>{
                const cell=bodyRow.insertCell();
                cell.textContent=row[column]||[];
            });
        });

        table.appendChild(thead);
        table.appendChild(tbody);

    }catch(error){
        console.error(error);
        alert("An error occurred while extracting data from the Excel file.");
    }
}


async function analyzeData(){
    const question=document.getElementById('questionInput').value;
    
    if(!question){
        alert('Please enter a question.');
        return;
    }
    showLoader();

    const response=await fetch('https://excel-extractor-server-api.onrender.com/analyze',{
        method:'POST',
        headers:{
            'content-type':'application/json'
        },
        body:JSON.stringify({
            data:extractedData,
            question:question
        })

    });
    const result=await response.json();

    showSuccess("Data analyzed successfully!");

    hideLoader();
    console.log(result);
    document.getElementById('analysisResults').textContent=result.summary || result.error;;
    document.getElementById("analysisResults").style.display="block";

    const table=document.getElementById('analysisTable');

    const thead=document.createElement('thead');
    const headerRow=thead.insertRow();

    result.columns.forEach(column=>{
        const th=document.createElement('th');
        th.textContent=column;
        headerRow.appendChild(th);
    });

    const tbody=document.createElement('tbody');

    result.data.forEach(row=>{
        const bodyRow=tbody.insertRow();

        result.columns.forEach(column=>{
            const cell=bodyRow.insertCell();
            cell.textContent=row[column]||[];
        })
    })

    table.appendChild(thead);
    table.appendChild(tbody);
}
function showLoader() {
    document.getElementById("loadingPopup").style.display = "flex";
}

function hideLoader() {
    document.getElementById("loadingPopup").style.display = "none";
}

function showSuccess(message,title="Success") {
    const popup = document.getElementById("successPopup");
    document.getElementById("successTitle").textContent = title;
    document.getElementById("successMessage").textContent = message;

    // Restart the tick animation every time
    const icon = popup.querySelector(".success-icon");
    icon.style.display = "none";
    void icon.offsetWidth;
    icon.style.display = "block";

    popup.style.display = "flex";

    setTimeout(() => {
        popup.style.display = "none";
    }, 2000);
}

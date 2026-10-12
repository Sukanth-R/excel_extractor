const fileInput=document.getElementById('fileInput');
const extractButton=document.getElementById('extractButton');

let extractedData=[];


async function extractData(){
    const file=fileInput.files[0]
    if(!file){
        alert('Please select an Excel file first.');
        return;
    }

    const formData=new FormData();
    formData.append('file',file);

    try{
        const response=await fetch('https://excel-extractor-server-api.onrender.com/extract',{
            method:'POST',
            body:formData
        })
        const result=await response.json();

        if(!response.ok){
            throw new error(result.error||"file extraction failer");
        }

        extractedData=result.data;

        console.log('Columns',result.columns);
        console.log('Rows',result.rows);
        console.log('Records',result.data);

        alert("Successfully extracted data from the Excel file. Check the console for details.");

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
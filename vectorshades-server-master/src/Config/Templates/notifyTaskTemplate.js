module.exports = ({ name, link , project , task , message , assignedTo, bannerUrl = '' }) => {
    return `<div style="background-color:#f1f1f1;padding:20px 10px">  
    <div style="width: 800px;;margin:0 auto;border-radius:5px"> 
                <div style="background-image: url('${bannerUrl}'); width: 100%; height: 200px; background-size: cover;" ></div>
        <div style="background-color:#fff;padding:20px;margin:0px 0 30px 0px">
            <div style="margin-top:10px">
              <h2 style="font-weight:600;font-size:20px;margin:0; font-family:'Work Sans',sans-serif;">Dear ${name},</h2>
              <div>
    
            <div>
                <p style="font-family:'Work Sans',sans-serif;" >
${message}
                </p>
                              <p style="font-family:'Work Sans',sans-serif;font-weight:600" >
Project Name : ${project}
                </p>
              <p style="font-family:'Work Sans',sans-serif;font-weight:600" >
Task Name : ${task}
                </p>
                  <p style="font-family:'Work Sans',sans-serif;font-weight:600" >
Task Assigned To : ${assignedTo}
                </p>
    
            <div style="padding: 0;margin: 0;margin-top: 20px;" >
                <p style="padding: 0;margin: 0;margin-top: 5px;font-family:'Work Sans',sans-serif;color: lightgrey;" >Vector Shades LTD</p>
                <p style="padding: 0;margin: 0;margin-top: 5px;font-family:'Work Sans',sans-serif;color: lightgrey;" >Kochi, Kerala, India</p>
            </div>
    
            </div>
            </div>
        </div>
    </div>
    </div>`
}